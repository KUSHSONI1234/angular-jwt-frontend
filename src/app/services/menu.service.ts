import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'http://localhost:5048/api/menu'; // change if port differs

  constructor(private http: HttpClient) {}

  // CREATE
  addMenu(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // UPDATE
  updateMenu(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // DELETE (Soft Delete)
  deleteMenu(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // TOGGLE STATUS
  toggleStatus(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/toggle-status`, {});
  }

  // GET ALL MENUS
  getMenus(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // GET MASTER MENUS (Dropdown)
  getMasterMenus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masters`);
  }

  getMenuById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getMenusWithPagination(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/pagination`, payload);
  }
}
