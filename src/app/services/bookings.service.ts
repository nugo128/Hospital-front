import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../global';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  doctor(id) {
    return this.http.get(`${BASE_API_URL}/Bookings/${id}`);
  }
  book(data) {
    return this.http.post(`${BASE_API_URL}/Bookings/`, data);
  }
}
