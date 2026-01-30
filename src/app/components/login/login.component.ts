import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  loginData = {
    username: '',
    password: '',
  };

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit(): void {
    this.usernameInput.nativeElement.focus();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm) {
    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        if (res?.success) {
          const data = res.data;
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          // localStorage.setItem('roleId', data.roleId);
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
}
