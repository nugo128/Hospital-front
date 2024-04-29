import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../global';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  users() {
    return this.http.get(`${BASE_API_URL}/users`);
  }
  user(id) {
    return this.http.get(`${BASE_API_URL}/users/${id}`);
  }
  edit(id, data) {
    return this.http.put(`${BASE_API_URL}/users/${id}`, data);
  }
  changeEmail(id) {
    return this.http.post(`${BASE_API_URL}/users/change-email?id=${id}`, '');
  }
  verifyCode(id, code) {
    return this.http.post(
      `${BASE_API_URL}/users/change-email-verify?id=${id}&code=${code}`,
      ''
    );
  }

  newEmail(id, code) {
    return this.http.post(
      `${BASE_API_URL}/users/set-email?id=${id}&newEmail=${code}`,
      ''
    );
  }
  verifyNewEmail(id, code, email) {
    return this.http.post(
      `${BASE_API_URL}/users/new-email-verify?id=${id}&code=${code}&email=${email}`,
      ''
    );
  }
  togglePinned(id) {
    return this.http.post(`${BASE_API_URL}/users/TogglePinned/${id}`, '');
  }
  downloadFile(id) {
    return this.http.get(`${BASE_API_URL}/users/download/${id}`);
  }
}
