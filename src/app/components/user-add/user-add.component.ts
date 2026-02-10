import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit, AfterViewInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;

  userForm!: FormGroup;
  roles: any[] = [];

  // name:string='';
  mode: 'add' | 'edit' | 'view' = 'add';
  userId: number | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
      this.mode = this.router.url.includes('edit') ? 'edit' : 'view';
      this.loadUserAndRoles();
    } else {
      this.loadRoles();
    }

    if (this.mode === 'view') {
      this.userForm.disable();
    }
  }

  onCancel() {
    this.userForm.reset();
    this.router.navigate(['/dashboard/users']);
  }

  // setName()
  // {
  //   this.userForm.name().value.set(name);
  // }

  ngAfterViewInit(): void {
    this.firstNameInput?.nativeElement.focus();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.mode === 'add' ? Validators.required : []],
      roleId: [null, Validators.required],
    });
  }

  loadUserAndRoles(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (res) => {
        this.userForm.patchValue(res.data);
        this.loadRoles();
      },

      error: () => this.toastr.error('Failed to load user'),
    });
  }

  // loadRoles(): void {
  //   this.userService.getRolesForDropdown().subscribe({
  //     next: (res) => {
  //       const activeRoles = res.data.filter((r: any) => r.IsActive);
  //       this.roles=res.data;

  //       if (
  //         this.userForm.value.roleId &&
  //         !activeRoles.some((r: any) => r.id === this.userForm.value.roleId)
  //       ) {
  //         this.roles = [
  //           {
  //             id: this.userForm.value.roleId,
  //             roleName:
  //               res.data.find((r: any) => r.id === this.userForm.value.roleId)
  //                 ?.roleName + ' (Inactive)',
  //             disabled: true,
  //           },
  //           ...activeRoles,
  //         ];
  //       } else {
  //         this.roles = activeRoles;
  //       }
  //     },
  //   });
  // }

  loadRoles(): void {
    this.userService.getRolesForDropdown().subscribe({
      next: (res) => {
        const rolesData = res.data || [];

        // If IsActive exists → filter
        const activeRoles =
          rolesData.length && rolesData[0].hasOwnProperty('IsActive')
            ? rolesData.filter((r: any) => r.IsActive)
            : rolesData;

        if (
          this.userForm.value.roleId &&
          !activeRoles.some((r: any) => r.id === this.userForm.value.roleId)
        ) {
          this.roles = [
            {
              id: this.userForm.value.roleId,
              roleName:
                rolesData.find((r: any) => r.id === this.userForm.value.roleId)
                  ?.roleName + ' (Inactive)',
              disabled: true,
            },
            ...activeRoles,
          ];
        } else {
          this.roles = activeRoles;
        }
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSave(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.userForm.getRawValue();

    if (this.mode === 'add') {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.toastr.success('User created successfully');
          this.router.navigate(['/dashboard/users']);
        },
        error: (err) =>
          this.toastr.error(err.error?.message || 'Create failed'),
      });
    } else if (this.mode === 'edit' && this.userId) {
      this.userService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.toastr.success('User updated');
          this.router.navigate(['/dashboard/users']);
        },
        error: () => this.toastr.error('Update failed'),
      });
    }
  }
}
