import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(formData) {
    return this.http.post(`${BASE_API_URL}/users`, formData);
  }
  verify(token) {
    return this.http.post(`${BASE_API_URL}/users/verify?token=${token}`, {});
  }
  login(formData) {
    return this.http.post(`${BASE_API_URL}/users/login`, formData);
  }
  users() {
    return this.http.get(`${BASE_API_URL}/users`);
  }
}
