import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_API_URL } from '../global';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser(token);
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  private loadCurrentUser(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(`${BASE_API_URL}/users/loggedInUser`, {
        headers,
      })
      .subscribe(
        (user) => {
          this.currentUserSubject.next(user);
        },
        (error) => {
          console.error('Failed to load user details', error);
        }
      );
  }
  private storeToken(token: string) {
    localStorage.setItem('token', token);
  }
  register(formData) {
    return this.http.post(`${BASE_API_URL}/users`, formData);
  }
  verify(token) {
    return this.http.post(`${BASE_API_URL}/users/verify?token=${token}`, {});
  }
  login(formData) {
    return this.http.post(`${BASE_API_URL}/users/login`, formData).pipe(
      map((response) => {
        this.storeToken(response['token']);
        this.loadCurrentUser(response['token']);
        return response;
      })
    );
  }
  verifyTwoStep(email, code) {
    return this.http
      .post(
        `${BASE_API_URL}/users/verify-two-step?email=${email}&code=${code}`,
        {}
      )
      .pipe(
        map((response) => {
          this.storeToken(response['token']);
          this.loadCurrentUser(response['token']);
          return response;
        })
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
  private readonly ROLE_KEY = 'userRole';
  setUserRole(role: string) {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  clearUserRole() {
    localStorage.removeItem(this.ROLE_KEY);
  }
}
