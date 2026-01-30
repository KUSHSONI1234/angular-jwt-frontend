import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class RoleComponent implements OnInit {
  roles: any[] = [];
  loading = true;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data; // backend returns { data: [...] }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to fetch roles');
        this.loading = false;
      },
    });
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
