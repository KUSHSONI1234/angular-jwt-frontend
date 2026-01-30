import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;

  registerData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  };

  showRegisterPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit() {
    this.firstNameInput.nativeElement.focus();
  }

  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      this.toastr.warning('Please fill all required fields', 'Warning');
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (res: any) => {
        // ✅ Successful registration (201)
        this.toastr.success(
          res?.message || 'Registration successful',
          'Success',
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (err) => {
        //  User already exists → redirect to login
        if (err.status === 409) {
          this.toastr.info(
            err?.error?.message ||
              'User already exists. Redirecting to login...',
            'Info',
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else if (err.status === 400) {
          this.toastr.error(
            err?.error?.message || 'Invalid registration data',
            'Error',
          );
        } else {
          this.toastr.error('Something went wrong. Please try again.', 'Error');
        }
      },
    });
  }
}
