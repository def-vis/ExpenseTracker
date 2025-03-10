import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { tap, finalize, retryWhen, delay, concatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoaderService } from '../Loader/loader-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/users';
  private token: string | null = null;
  private isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router, private loaderService: LoaderService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    this.loaderService.show();
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        this.isLoggedIn = true;
      }),
      retryWhen(errors =>
        errors.pipe(
          concatMap((error, count) => {
            if (count < 3) {
              return of(error).pipe(delay(1000)); // Retry after 1 second
            }
            return throwError(error);
          })
        )
      ),
      finalize(() => this.loaderService.hide())
    );
  }

  register(userData: { email: string; password: string }): Observable<any> {
    this.loaderService.show();
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((error, count) => {
            if (count < 3) {
              return of(error).pipe(delay(1000)); // Retry after 1 second
            }
            return throwError(error);
          })
        )
      ),
      finalize(() => this.loaderService.hide())
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}