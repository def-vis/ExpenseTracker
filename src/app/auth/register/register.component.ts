import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Currency } from '../currency.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  password: string = "";
  currency: string = "";

  currencies = Object.keys(Currency);

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      currency: this.currency
    };

    this.authService.register(user).subscribe(
      response => {
        // Handle successful registration
        this.router.navigate(['/login']);
      },
      error => {
        // Handle registration error
        alert('Registration failed. Please try again.');
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}