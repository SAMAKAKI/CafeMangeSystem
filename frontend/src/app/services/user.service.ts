import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  url = environment.apiUrl;

  signUp(data: any): Observable<any>{
    return this.http.post(`${this.url}/user/signup`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  forgotPassword(data: any): Observable<any>{
    return this.http.post(`${this.url}/user/forgotPassword`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  login(data: any): Observable<any>{
    return this.http.post(`${this.url}/user/login`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  checkToken(): Observable<any>{
    return this.http.get(`${this.url}/user/checkToken`);
  }

  changePassword(data: any): Observable<any>{
    return this.http.post(`${this.url}/user/changePassword`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getUsers(): Observable<any>{
    return this.http.get(`${this.url}/user/get`);
  }

  updateUser(data: any): Observable<any>{
    return this.http.patch(`${this.url}/user/update`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  } 
}
