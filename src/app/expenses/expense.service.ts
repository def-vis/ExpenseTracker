import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiUrl + '/expenses'; // Replace with your API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExpenses(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  getExpense(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post(this.apiUrl, expense, { headers: this.authService.getAuthHeaders() });
  }

  updateExpense(expense: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${expense.id}`, expense, { headers: this.authService.getAuthHeaders() });
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}