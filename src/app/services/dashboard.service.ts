import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:5048/api/dashboard';

  constructor(private http: HttpClient) {}

  // Active Users Count API
  getActiveUsersCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active-users-count`);
  }
}
