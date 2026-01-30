import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:5048/api/roles';

  constructor(private http: HttpClient) {}

  // CREATE ROLE
  createRole(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // GET ALL ROLES
  getAllRoles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // GET ROLE BY ID
  getRoleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // UPDATE ROLE
  updateRole(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETE ROLE (SOFT DELETE)
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // TOGGLE ACTIVE / INACTIVE
  // TOGGLE ACTIVE / INACTIVE
  toggleRoleStatus(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-status`, null);
  }

  
}
