import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-get-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.scss',
})
export class GetBookingsComponent {
  bookings: any;
  isSpinning: boolean = false;
  message: { type: string; text: string } | null = null;

  constructor(private adminService: AdminService) {
    this.getbookings();
  }

  getbookings() {
    this.isSpinning = true;
    this.adminService.getCarBookings().subscribe((res) => {
      this.isSpinning = false;
      this.bookings = res;
    });
  }

  changeBookingStatus(bookingId: number, status: string) {
    this.isSpinning = true;
    this.adminService.changeBookingStatus(bookingId, status).subscribe(
      (res) => {
        this.isSpinning = false;
        console.log(res);
        this.getbookings();
        this.setMessage('Success', 'Booking status changed');
      },
      (error) => {
        this.setMessage('Error', 'Booking status did not changed');
      }
    );
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }
}
