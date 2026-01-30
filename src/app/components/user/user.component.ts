import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  imports: [FormsModule, CommonModule, RouterLink],
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  loggedInRoleLevel = Number(localStorage.getItem('roleLevel'));

  loading = true;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

 getUsers() {
  this.userService.getAllUsers().subscribe({
    next: (res) => {
      // res is already an array
      this.users = res.map((user: any) => ({
        ...user,
        roleName:
          this.roles.find((r) => r.id === user.roleId)?.roleName || '-',
      }));
      this.loading = false;
    },
    error: () => {
      this.toastr.error('Failed to fetch users');
      this.loading = false;
    },
  });
}


  getRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
        this.getUsers();
      },
      error: () => {
        this.toastr.error('Failed to fetch roles');
        this.loading = false;
      },
    });
  }

  toggleStatus(user: any) {
    if (!user.id) return;

    const action = user.isActive ? 'block' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (res) => {
        user.isActive = res.data.isActive;
        // this.toastr.success(res.message);
      },
      error: () => this.toastr.error('Failed to toggle status'),
    });
  }

  deleteUser(user: any) {
    if (!user.id) return;
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.users = this.users.filter((u) => u.id !== user.id);
      },
      error: () => this.toastr.error('Failed to delete user'),
    });
  }

  viewUser(user: any) {
    this.router.navigate([`/dashboard/users/view/${user.id}`]);
  }

  editUser(user: any) {
    this.router.navigate([`/dashboard/users/edit/${user.id}`]);
  }
}
