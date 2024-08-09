import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsComponent {
  bookings: any;
  isSpinning: boolean = false;

  constructor(private customerService: CustomerService) {
    this.getMyBookings();
  }

  getMyBookings() {
    this.isSpinning = true;
    this.customerService.getBookingsByUserId().subscribe((res) => {
      this.isSpinning = false;
      this.bookings = res;
    });
  }
}
