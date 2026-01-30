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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css'],
})
export class RoleAddComponent implements OnInit, AfterViewInit {
  @ViewChild('roleNameInput') roleNameInput!: ElementRef<HTMLInputElement>;

  roleData = {
    roleName: '',
    level: null as number | null,
  };

  mode: 'add' | 'edit' | 'view' = 'add';
  roleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.roleId = +id;
        this.mode = this.router.url.includes('edit') ? 'edit' : 'view';
        this.getRole(id);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.roleNameInput?.nativeElement.focus();
    }, 0);
  }

  getRole(id: string) {
    this.roleService.getRoleById(+id).subscribe({
      next: (res) => {
        this.roleData = res.data;
      },
      error: () => this.toastr.error('Failed to load role'),
    });
  }

  onSave() {
    if (this.mode === 'edit' && this.roleId) {
      this.roleService.updateRole(this.roleId, this.roleData).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard/roles']);
        },
        error: () => this.toastr.error('Failed to update role'),
      });
    } else {
      this.roleService.createRole(this.roleData).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard/roles']);
        },
        error: () => this.toastr.error('Failed to create role'),
      });
    }
  }
}
