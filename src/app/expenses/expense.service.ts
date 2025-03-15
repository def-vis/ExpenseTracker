import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoaderService } from '../Loader/loader-service.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiUrl + '/expenses'; // Replace with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  getExpenses(): Observable<any> {
    this.loaderService.show();
    return this.http.get(this.apiUrl, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  getExpense(id: number): Observable<any> {
    this.loaderService.show();
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  addExpense(expense: any): Observable<any> {
    this.loaderService.show();
    return this.http.post(this.apiUrl, expense, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  updateExpense(expense: any): Observable<any> {
    this.loaderService.show();
    return this.http.put(`${this.apiUrl}/${expense.id}`, expense, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  deleteExpense(id: number): Observable<any> {
    this.loaderService.show();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  // uploadImage(file: File): Observable<any> {
  //   this.loaderService.show();
  //   const formData = new FormData();
  //   formData.append('imageFile', file);
  //   return this.http.post(`${this.apiUrl}/Extract`, formData, { headers: this.authService.getAuthHeaders() }).pipe(
  //     finalize(() => this.loaderService.hide())
  //   );
  // }

  uploadScreenshot(file: File): Observable<any> {
    this.loaderService.show();
    const formData = new FormData();
    formData.append('imageFile', file);
    return this.http.post(`${this.apiUrl}/ExtractScreenshot`, formData, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}