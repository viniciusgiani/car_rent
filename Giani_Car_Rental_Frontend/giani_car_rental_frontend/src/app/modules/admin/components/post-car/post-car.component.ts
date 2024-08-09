import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-post-car',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.scss'],
})
export class PostCarComponent implements OnInit {
  postCarForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  message: { type: string; text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postCarForm = this.fb.group({
      file: [null, Validators.required],
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required],
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event?.target.files[0];
    this.postCarForm.patchValue({ file: this.selectedFile });
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

  onSubmit(): void {
    if (this.postCarForm.valid) {
      this.postCar();
    }
  }

  postCar() {
    const formData: FormData = new FormData();
    formData.append('image', this.selectedFile!);
    formData.append('brand', this.postCarForm.get('brand')!.value);
    formData.append('name', this.postCarForm.get('name')!.value);
    formData.append('type', this.postCarForm.get('type')!.value);
    formData.append('color', this.postCarForm.get('color')!.value);
    formData.append('year', this.postCarForm.get('year')!.value);
    formData.append(
      'transmission',
      this.postCarForm.get('transmission')!.value
    );
    formData.append('description', this.postCarForm.get('description')!.value);
    formData.append('price', this.postCarForm.get('price')!.value);

    this.adminService.postCar(formData).subscribe(
      (res) => {
        this.setMessage('success', 'Car posted successfully');
        this.router.navigateByUrl('/admin/dashboard');
      },
      (error) => {
        this.setMessage('danger', 'Error while posting car');
      }
    );
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => (this.message = null), 5000);
  }
}
