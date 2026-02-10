import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  imports: [FormsModule, CommonModule, RouterLink, MatPaginator],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  users: any[] = [];
  roles: any[] = [];
  loggedInRoleLevel = Number(localStorage.getItem('roleLevel'));
  searchText: string = ''; // <-- Add this line
  menus: any[] = [];
  loading = false;
  searchSubject = new Subject<string>();

  // Pagination
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.getMenus();

    this.searchSubject
      .pipe(debounceTime(300)) 
      .subscribe(() => {
        this.pageNumber = 1;
        this.getUsers();
      });
  }

  // Get roles first
  // getRoles() {
  //   this.roleService.getAllRoles().subscribe({
  //     next: (res: any) => {
  //       this.roles = res.data;
  //       this.getUsers(); // fetch users after roles loaded
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to fetch roles');
  //     },
  //   });
  // }

  getMenus() {
    this.menuService.getMenus().subscribe({
      next: (res: any) => {
        this.menus = res.data;
      },
      error: () => {
        this.toastr.error('Failed to fetch menus');
      },
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchText);
  }

  //  Server-side pagination
  getUsers() {
    this.loading = true;

    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText, // <-- Send search text to backend
    };

    this.userService.getUsersWithPagination(payload).subscribe({
      next: (res: any) => {
        this.users = res.data.map((user: any) => ({
          ...user,
          roleName:
            this.roles.find((r) => r.id === user.roleId)?.roleName || '-',
        }));

        this.totalCount = res.totalCount;

        const maxPageIndex = Math.ceil(this.totalCount / this.pageSize) - 1;
        if (this.paginator && this.paginator.pageIndex > maxPageIndex) {
          this.paginator.pageIndex = Math.max(maxPageIndex, 0);
          this.pageNumber = this.paginator.pageIndex + 1;
        }

        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to fetch users');
        this.loading = false;
      },
    });
  }

  pageChanged(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  toggleStatus(menu: any) {
    if (!menu.id) return;

    const action = menu.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this menu?`)) return;

    this.menuService.toggleStatus(menu.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          // flip UI value
          menu.isActive = !menu.isActive;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: () => this.toastr.error('Failed to toggle status'),
    });
  }

  deleteUser(menu: any) {
    if (!menu.id) return;
    if (!confirm('Are you sure you want to delete this menu?')) return;

    this.menuService.deleteMenu(menu.id).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.getUsers(); // refresh current page
      },
      error: () => this.toastr.error('Failed to delete menu'),
    });
  }

  viewUser(menu: any) {
    this.router.navigate([`/dashboard/menu/view/${menu.id}`]);
  }

  editUser(menu: any) {
    this.router.navigate([`/dashboard/menu/edit/${menu.id}`]);
  }
}
