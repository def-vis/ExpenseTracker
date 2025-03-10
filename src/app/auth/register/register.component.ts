import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Currency } from '../currency.enum';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  currencies = Object.keys(Currency);
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]]
      // ,      currency: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      this.authService.register(user).pipe(
        catchError(error => {
          // Handle registration error
          this.errorMessage = 'Registration failed. Please try again later.';
          alert(this.errorMessage);
          return of(null);
        })
      ).subscribe(
        response => {
          if (response) {
            // Handle successful registration
            this.router.navigate(['/login']);
          }
        }
      );
    } else {
      if (this.registerForm.get('password')?.errors?.['passwordStrength']) {
        alert('Password must contain a number, a special character, and an uppercase letter.');
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid = hasUpperCase && hasNumber && hasSpecialCharacter;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
}