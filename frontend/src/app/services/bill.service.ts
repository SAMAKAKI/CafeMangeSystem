import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generate(data: any): Observable<any>{
    return this.http.post(`${this.url}/bill/generate`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getPdf(data: any): Observable<Blob>{
    return this.http.post(`${this.url}/bill/getPdf`, data, {responseType: 'blob'});
  }

  getBills(): Observable<any>{
    return this.http.get(`${this.url}/bill/getBills`);
  }

  delete(id: any): Observable<any>{
    return this.http.delete(`${this.url}/bill/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
