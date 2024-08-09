import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getAllCars(): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/customer/cars`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  getCarById(carId: number): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/customer/car/${carId}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  bookCar(bookCarDto: any): Observable<any> {
    return this.http
      .post(`${BASIC_URL}/api/customer/car/book`, bookCarDto, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  getBookingsByUserId(): Observable<any> {
    return this.http
      .get(
        `${BASIC_URL}/api/customer/car/bookings/${this.storageService.getUserId()}`,
        {
          headers: this.createAuthorizationHeader(),
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  searchCar(searchCriteria: any): Observable<any> {
    return this.http
      .post(`${BASIC_URL}/api/customer/car/search`, searchCriteria, {
        headers: this.createAuthorizationHeader().set(
          'Content-Type',
          'application/json'
        ),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  private createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.storageService.getToken()
    );
  }
}
