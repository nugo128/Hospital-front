import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../global';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  categories() {
    return this.http.get(`${BASE_API_URL}/categories`);
  }
  editCategory(id: number, name: string): Observable<string> {
    const url = `${BASE_API_URL}/categories/${id}`;
    const params = { name: name };
    return this.http
      .post(url, {}, { params: params, responseType: 'arraybuffer' })
      .pipe(
        map((response: ArrayBuffer) => {
          return new TextDecoder().decode(response);
        })
      );
  }
  deleteCategory(id) {
    return this.http.delete(`${BASE_API_URL}/categories/${id}`);
  }
}
