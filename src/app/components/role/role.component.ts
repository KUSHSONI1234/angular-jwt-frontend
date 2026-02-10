import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  imports: [FormsModule, CommonModule, RouterLink, MatPaginatorModule],
})
export class RoleComponent implements OnInit {
  roles: any[] = [];
  loading = true;
  searchText: string = '';
  pageNumber = 1;
  pageIndex = 0;
  pageSize = 5;
  searchSubject = new Subject<string>();

  totalCount = 0;
  // pageSize = 5;
  // totalCount = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    this.searchSubject
      .pipe(debounceTime(300)) // wait 300ms after typing stops
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadRoles();
      });
  }

  loadRoles() {
    this.loading = true;

    const payload = {
      pageNumber: this.pageIndex + 1, // backend is 1-based
      pageSize: this.pageSize,
      searchText: this.searchText, // <-- Send search text to backend
    };

    this.roleService.getRolesWithPagination(payload).subscribe({
      next: (res) => {
        this.roles = res.data.data;
        this.totalCount = res.data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to fetch roles');
        this.loading = false;
      },
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchText);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }

  deleteRole(role: any) {
    if (!role.id) return;
    if (!confirm('Are you sure you want to delete this role?')) return;

    this.roleService.deleteRole(role.id).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Role deleted successfully');
        this.roles = this.roles.filter((r) => r.id !== role.id);
      },
      error: () => this.toastr.error('Failed to delete role'),
    });
  }

  viewRole(role: any) {
    this.router.navigate([`/dashboard/roles/view/${role.id}`]);
  }

  editRole(role: any) {
    this.router.navigate([`/dashboard/roles/edit/${role.id}`]);
  }

  toggleStatus(role: any) {
    if (!role.id) return;

    const action = role.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this role?`)) return;

    this.roleService.toggleRoleStatus(role.id).subscribe({
      next: (res) => {
        role.isActive = res.data.isActive;
        // optional toast
        // this.toastr.success(res.message);
      },
      error: () => this.toastr.error('Failed to toggle role status'),
    });
  }
}
