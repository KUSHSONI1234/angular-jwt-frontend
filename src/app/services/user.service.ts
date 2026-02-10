import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5048/api/users';

  constructor(private http: HttpClient) {}

  // CREATE USER
  createUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // GET ALL USERS
  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // GET USER BY ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // UPDATE USER
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETE USER
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // TOGGLE ACTIVE/BLOCKED
  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-status`, null);
  }

  // GET ROLES FOR DROPDOWN
  getRolesForDropdown(): Observable<any> {
    return this.http.get('http://localhost:5048/api/roles/dropdown');
  }

  getUsersWithPagination(payload: {
    pageNumber: number;
    pageSize: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/GetUsersWithPagination`, payload);
  }
}
