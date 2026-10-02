import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./auth.scss'],
})
export class Auth {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router,
  ) {
    this.authForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      email: [''],
      avatarUrl: [''],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('email')?.clearValidators();
    } else {
      this.authForm
        .get('confirmPassword')
        ?.setValidators([Validators.required]);

      this.authForm
        .get('email')
        ?.setValidators([Validators.required, Validators.email]);
    }

    this.authForm.get('confirmPassword')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { login, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(login, password).subscribe({
        next: () => {
          this.modalService.open('Success', 'Login successful');
          this.authForm.reset();
          this.router.navigate(['/map']);
        },
        error: (err) => {
          this.modalService.open(
            'Error',
            err.message || 'Login failed'
          );
        },
      });

      return;
    }

    this.modalService.open(
      'Demo Application',
      'Registration is currently unavailable. This is a demo version of the application.'
    );
  }
}