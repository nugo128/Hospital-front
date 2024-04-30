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
  user(id: number) {
    return this.http.get(`${BASE_API_URL}/users/${id}`);
  }
  edit(id: number, data) {
    return this.http.put(`${BASE_API_URL}/users/${id}`, data);
  }
  changeEmail(id: number) {
    return this.http.post(`${BASE_API_URL}/users/change-email?id=${id}`, '');
  }
  verifyCode(id: number, code: string) {
    return this.http.post(
      `${BASE_API_URL}/users/change-email-verify?id=${id}&code=${code}`,
      ''
    );
  }

  newEmail(id: number, code: string) {
    return this.http.post(
      `${BASE_API_URL}/users/set-email?id=${id}&newEmail=${code}`,
      ''
    );
  }
  verifyNewEmail(id: number, code: string, email: string) {
    return this.http.post(
      `${BASE_API_URL}/users/new-email-verify?id=${id}&code=${code}&email=${email}`,
      ''
    );
  }
  togglePinned(id: number) {
    return this.http.post(`${BASE_API_URL}/users/TogglePinned/${id}`, '');
  }
  downloadFile(id: number) {
    return this.http.get(`${BASE_API_URL}/users/download/${id}`);
  }
  delete(id: number) {
    return this.http.delete(`${BASE_API_URL}/users/${id}`);
  }
}
