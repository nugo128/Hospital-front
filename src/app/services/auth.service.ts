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
  verifyTwoStep(email, code) {
    return this.http.post(
      `${BASE_API_URL}/users/verify-two-step?email=${email}&code=${code}`,
      {}
    );
  }
  forgotPassword(email) {
    return this.http.post(
      `${BASE_API_URL}/users/forgot-password?email=${email}`,
      {}
    );
  }
  resetPassword(code, password, repeat) {
    return this.http.post(
      `${BASE_API_URL}/users/reset-password?token=${code}`,
      {
        password,
        repeatPassword: repeat,
      }
    );
  }
}
