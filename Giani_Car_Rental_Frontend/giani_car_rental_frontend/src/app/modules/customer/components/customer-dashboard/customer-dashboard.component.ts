import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageModalComponent } from '../../../admin/utils/image-modal/image-modal.component';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, ImageModalComponent, RouterLink],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  cars: any = [];
  message: { type: string; text: string } | null = null;

  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getAllCars();
  }

  getAllCars() {
    this.customerService.getAllCars().subscribe(
      (res: any[]) => {
        this.cars = res.map((car) => ({
          ...car,
          processedImg: 'data:image/jpeg;base64,' + car.imageBase64,
        }));
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.setMessage('error', 'Error fetching cars.');
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
