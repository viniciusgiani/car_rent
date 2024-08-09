import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ImageModalComponent } from '../../utils/image-modal/image-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ImageModalComponent, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  cars: any = [];
  message: { type: string; text: string } | null = null;

  @ViewChild('imageModal') imageModal!: ImageModalComponent;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAllCars();
  }

  getAllCars() {
    this.adminService.getAllCars().subscribe((res: any[]) => {
      this.cars = res.map(car => ({
        ...car,
        processedImg: 'data:image/jpeg;base64,' + car.imageBase64
      }));
    }, error => {
      console.error('Error fetching cars:', error);
      this.setMessage('error', 'Error fetching cars.');
    });
  }

  deleteCar(id: number) {
    this.adminService.deleteCar(id).subscribe(() => {
      this.getAllCars();
      this.setMessage('success', 'Car deleted successfully.');
    }, error => {
      console.error('Error deleting car:', error);
      this.setMessage('error', 'Error deleting car.');
    });
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }

  openImageModal(imageUrl: string) {
    this.imageModal.imageUrl = imageUrl;
    this.imageModal.openModal();
  }
}



