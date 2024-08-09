import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { StorageService } from './auth/services/storage/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'giani_car_rental_frontend';

  isCustomerLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
      }
    });
    this.updateLoginStatus();
  }

  private updateLoginStatus(): void {
    this.isAdminLoggedIn = this.storageService.isAdminLoggedIn();
    this.isCustomerLoggedIn = this.storageService.isCustomerLoggedIn();
  }

  logout() {
    this.storageService.logout();
    this.router.navigateByUrl('/login');
  }
}
