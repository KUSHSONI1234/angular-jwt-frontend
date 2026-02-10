import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.usernameInput.nativeElement.focus();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          const data = res.data;

          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          localStorage.setItem('roleName', data.roleName);
          localStorage.setItem('roleLevel', data.roleLevel);
          localStorage.setItem('token', data.token);

          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.toastr.error(err?.error?.message || 'Login Failed');
      },
    });
  }

  // Getter for cleaner template
  get f() {
    return this.loginForm.controls;
  }
}
