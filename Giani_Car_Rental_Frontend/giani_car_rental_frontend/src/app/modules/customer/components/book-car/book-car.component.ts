import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { ImageModalComponent } from '../../../admin/utils/image-modal/image-modal.component';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-book-car',
  standalone: true,
  imports: [CommonModule, ImageModalComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './book-car.component.html',
  styleUrls: ['./book-car.component.scss'],
})
export class BookCarComponent {
  carId: number = this.activatedRoute.snapshot.params['id'];
  message: { type: string; text: string } | null = null;
  car: any;
  processedImage: any;
  validateForm!: FormGroup;
  isSpinning = false;
  dateFormat!: 'DD-MM-YYYY';

  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      toDate: [null, Validators.required],
      fromDate: [null, Validators.required],
    });
    this.getCarById();
  }

  getCarById() {
    this.customerService.getCarById(this.carId).subscribe(
      (res: any) => {
        console.log(res);
        this.processedImage = 'data:image/jpeg;base64,' + res.imageBase64;
        this.car = res;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.setMessage('error', 'Error fetching cars.');
      }
    );
  }

  onSubmit(): void {
    if (this.validateForm.valid) {
      this.isSpinning = true;
      const userId = this.storageService.getUserId();
      const carId = this.carId;

      if (!userId || !carId) {
        this.setMessage('error', 'User ID or Car ID is missing.');
        return;
      }

      const bookingData = {
        userId: userId,
        carId: carId,
        fromDate: this.validateForm.value.fromDate,
        toDate: this.validateForm.value.toDate,
      };

      this.bookACar(bookingData);
    } else {
      console.log('Form is invalid');
    }
  }

  bookACar(data: any) {
    this.customerService.bookCar(data).subscribe(
      (res) => {
        this.setMessage('success', 'Booking request submitted successfully');
        this.router.navigateByUrl('/customer/dashboard');
        this.isSpinning = false;
      },
      (error) => {
        console.error('Error booking car:', error);
        this.setMessage('error', 'Something went wrong');
        this.isSpinning = false;
      }
    );
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }

  openImageModal(imageUrl: string) {
    this.imageModal.imageUrl = imageUrl;
    this.imageModal.openModal();
  }
}
