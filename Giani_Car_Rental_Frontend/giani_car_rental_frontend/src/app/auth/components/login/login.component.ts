import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;
  message: { type: string; text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole
          };
          this.storageService.saveUser(user);
          this.storageService.saveToken(res.jwt);

          if (this.storageService.isAdminLoggedIn()) {
            this.router.navigateByUrl("/admin/dashboard");
          } else if (this.storageService.isCustomerLoggedIn()) {
            this.router.navigateByUrl("/customer/dashboard");
          }
        }
      },
      error: (err) => {
        this.setMessage('danger', 'Bad credentials');
      }
    });
  }

  setMessage(type: string, text: string) {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }
}



