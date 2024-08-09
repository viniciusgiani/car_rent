import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  
  signupForm!: FormGroup;
  message: { type: string; text: string } | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidate.bind(this)]],
    });
  }

  confirmationValidate(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signupForm.get('password')?.value) {
      return { confirm: true };
    }
    return null;
  }

  register() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe(
        (res) => {
          if (res.id != null) {
            this.setMessage('success', 'Signup successful!');
            this.router.navigateByUrl('/login');
          } else {
            this.setMessage('danger', 'Signup failed. Please try again.');
          }
        },
        (error) => {
          this.setMessage('danger', 'An error occurred. Please try again later.');
        }
      );
    } else {
      this.setMessage('danger', 'Please correct the errors in the form.');
    }
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }

}

