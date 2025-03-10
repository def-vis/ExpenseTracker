import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Category } from './category.model';
import { environment } from '../../environments/environment';
import { LoaderService } from '../Loader/loader-service.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl + '/categories'; // Replace with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  getCategories(): Observable<Category[]> {
    this.loaderService.show();
    return this.http.get<Category[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  getCategory(id: number): Observable<Category> {
    this.loaderService.show();
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  addCategory(category: Category): Observable<Category> {
    this.loaderService.show();
    return this.http.post<Category>(this.apiUrl, category, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  updateCategory(category: Category): Observable<Category> {
    this.loaderService.show();
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }

  deleteCategory(id: number): Observable<void> {
    this.loaderService.show();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() }).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}