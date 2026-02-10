import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;

  registerForm!: FormGroup;
  showRegisterPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.firstNameInput.nativeElement.focus();
  }

  toggleRegisterPassword(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields', 'Warning');
      return;
    }

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(
          res?.message || 'Registration successful',
          'Success'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastr.info(
            err?.error?.message ||
              'User already exists. Redirecting to login...',
            'Info'
          );
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else if (err.status === 400) {
          this.toastr.error(
            err?.error?.message || 'Invalid registration data',
            'Error'
          );
        } else {
          this.toastr.error(
            'Something went wrong. Please try again.',
            'Error'
          );
        }
      },
    });
  }
}
