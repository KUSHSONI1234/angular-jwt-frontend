import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class UserAddComponent implements OnInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;

  roles: any[] = [];

  userData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleId: null as number | null,
    roleName: '',
  };

  mode: 'add' | 'edit' | 'view' = 'add';
  userId: number | null = null;
  showPassword = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit(): void {
    // Focus the input after the view is initialized
    if (this.firstNameInput) {
      this.firstNameInput.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.userId = +id;
      this.mode = this.router.url.includes('edit') ? 'edit' : 'view';
      this.loadUserAndRoles();
    } else {
      this.loadRoles();
    }
  }

  loadUserAndRoles() {
    this.userService.getUserById(this.userId!).subscribe({
      next: (userRes) => {
        this.userData = userRes.data;
        this.loadRoles();
      },
      error: () => this.toastr.error('Failed to load user'),
    });
  }

  loadRoles() {
    this.userService.getRolesDropdown().subscribe({
      next: (roleRes) => {
        const activeRoles = roleRes.data.filter((r: any) => r.isActive);

        if (this.userRoleIsActive(activeRoles)) {
          this.roles = activeRoles;
        } else {
          this.roles = this.addInactiveRole(activeRoles);
        }
      },
    });
  }

  userRoleIsActive(activeRoles: any[]): boolean {
    return activeRoles.some((r) => r.id === this.userData.roleId);
  }

  addInactiveRole(activeRoles: any[]) {
    return [
      {
        id: this.userData.roleId,
        roleName: this.userData.roleName + ' (Inactive)',
        disabled: true,
      },
      ...activeRoles,
    ];
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSave() {
    if (this.mode === 'edit' && this.userId) {
      this.userService.updateUser(this.userId, this.userData).subscribe({
        next: () => {
          this.toastr.success('User updated');
          this.router.navigate(['/dashboard/users']);
        },
        error: () => this.toastr.error('Update failed'),
      });
    }
  }
}
