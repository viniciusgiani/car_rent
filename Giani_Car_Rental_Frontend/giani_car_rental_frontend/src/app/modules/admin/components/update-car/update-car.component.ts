import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ImageModalComponent } from '../../utils/image-modal/image-modal.component';

@Component({
  selector: 'app-update-car',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImageModalComponent],
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.scss',
})
export class UpdateCarComponent {
  carId: number = this.activatedRoute.snapshot.params['id'];
  existingImage: string | null = null;
  updateCarForm!: FormGroup;
  imgChanged: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  message: { type: string; text: string } | null = null;
  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateCarForm = this.fb.group({
      file: [null],
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required],
    });
    this.getCarById();
  }

  onSubmit(): void {
    if (this.updateCarForm.valid) {
      this.updateCar();
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event?.target.files[0];
    this.imgChanged = true;
    this.existingImage = null;
    this.updateCarForm.patchValue({ file: this.selectedFile });
    this.previewImage();
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getCarById() {
    this.adminService.getCarById(this.carId).subscribe((res) => {
      console.log(res);
      const carDto = res;
      this.existingImage = 'data:image/jpeg;base64,' + (res.imageBase64 ?? '');
      console.log(carDto);
      console.log(this.existingImage);
      this.updateCarForm.patchValue(carDto);
    });
  }

  updateCar() {
    const formData: FormData = new FormData();
    if (this.imgChanged && this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('brand', this.updateCarForm.get('brand')!.value);
    formData.append('name', this.updateCarForm.get('name')!.value);
    formData.append('type', this.updateCarForm.get('type')!.value);
    formData.append('color', this.updateCarForm.get('color')!.value);
    formData.append('year', this.updateCarForm.get('year')!.value);
    formData.append(
      'transmission',
      this.updateCarForm.get('transmission')!.value
    );
    formData.append(
      'description',
      this.updateCarForm.get('description')!.value
    );
    formData.append('price', this.updateCarForm.get('price')!.value);

    this.adminService.updateCar(this.carId, formData).subscribe(
      (res) => {
        this.setMessage('success', 'Car updated successfully');
        this.router.navigateByUrl('/admin/dashboard');
      },
      (error) => {
        this.setMessage('danger', 'Error while updating car');
      }
    );
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }

  openImageModal(imageUrl: string | null) {
    if (imageUrl) {
      this.imageModal.imageUrl = imageUrl;
      this.imageModal.openModal();
    }
  }
}
