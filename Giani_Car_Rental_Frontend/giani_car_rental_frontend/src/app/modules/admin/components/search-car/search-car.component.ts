import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-search-car',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-car.component.html',
  styleUrl: './search-car.component.scss',
})
export class SearchCarComponent {
  searchCarForm!: FormGroup;
  isSpinning = false;
  message: { type: string; text: string } | null = null;
  cars: any = [];
  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      color: [null],
      transmission: [null],
    });
  }

  onSubmit() {
    this.searchCar();
  }

  searchCar() {
    this.isSpinning = true;
    const searchCriteria = this.searchCarForm.value;

    this.adminService.searchCar(searchCriteria).subscribe(
      (res) => {
        this.setMessage('success', 'Car(s) found');
        this.isSpinning = false;
        this.cars = res.carDtoList.map((e: any) => ({
          ...e,
          processedImg: 'data:image/jpeg;base64,' + e.imageBase64,
        }));
      },
      (error) => {
        this.setMessage('error', 'Error while searching car(s)');
        this.isSpinning = false;
      }
    );
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }
}
