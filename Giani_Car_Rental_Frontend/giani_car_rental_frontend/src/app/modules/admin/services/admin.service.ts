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
export class AdminService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  postCar(carDto: FormData): Observable<any> {
    return this.http
      .post(`${BASIC_URL}/api/admin/car`, carDto, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  getAllCars(): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/admin/cars`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  deleteCar(id: number): Observable<any> {
    return this.http
      .delete(`${BASIC_URL}/api/admin/car/${id}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  getCarById(id: number): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/admin/car/${id}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  updateCar(carId: number, carDto: FormData): Observable<any> {
    return this.http
      .put(`${BASIC_URL}/api/admin/car/${carId}`, carDto, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  getCarBookings(): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/admin/car/bookings`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  changeBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http
      .get(`${BASIC_URL}/api/admin/car/booking/${bookingId}/${status}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  searchCar(searchCriteria: any): Observable<any> {
    return this.http
      .post(`${BASIC_URL}/api/admin/car/search`, searchCriteria, {
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

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.storageService.getToken()
    );
  }
}
