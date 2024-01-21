import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDetails(): Observable<any>{
    return this.http.get(`${this.url}/dashboard/details`);
  }
  
}
