import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css'],
})
export class RoleAddComponent implements OnInit, AfterViewInit {
  @ViewChild('roleNameInput') roleNameInput!: ElementRef<HTMLInputElement>;

  roleForm!: FormGroup;

  mode: 'add' | 'edit' | 'view' = 'add';
  roleId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.roleId = +id;
        this.mode = this.router.url.includes('edit') ? 'edit' : 'view';
        this.getRole(this.roleId);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.mode !== 'view') {
        this.roleNameInput?.nativeElement.focus();
      }
    });
  }

  initForm() {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      level: [null, Validators.required],
    });
  }

  get f() {
    return this.roleForm.controls;
  }

  getRole(id: number) {
    this.roleService.getRoleById(id).subscribe({
      next: (res) => {
        this.roleForm.patchValue(res.data);

        if (this.mode === 'view') {
          this.roleForm.disable();
        }
      },
      error: () => this.toastr.error('Failed to load role'),
    });
  }

  onSave() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const payload = this.roleForm.getRawValue();

    if (this.mode === 'edit' && this.roleId) {
      this.roleService.updateRole(this.roleId, payload).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard/roles']);
        },
        error: () => this.toastr.error('Failed to update role'),
      });
    } else {
      this.roleService.createRole(payload).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard/roles']);
        },
        error: () => this.toastr.error('Failed to create role'),
      });
    }
  }
}
