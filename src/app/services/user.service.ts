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
}
