import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  add(data: any): Observable<any>{
    return this.http.post(`${this.url}/product/add`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data: any): Observable<any>{
    return this.http.patch(`${this.url}/product/update`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  get(): Observable<any>{
    return this.http.get(`${this.url}/product/get`);
  }

  updateStatus(data: any): Observable<any>{
    return this.http.patch(`${this.url}/product/updateStatus`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: any): Observable<any>{
    return this.http.delete(`${this.url}/product/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getProductsByCategory(id: any): Observable<any>{
    return this.http.get(`${this.url}/product/getByCategory/${id}`);
  }

  getProductById(id: any): Observable<any>{
    return this.http.get(`${this.url}/product/getById/${id}`);
  }
}
