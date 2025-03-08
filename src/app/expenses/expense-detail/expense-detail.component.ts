import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense } from '../expense.model';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../categories/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  encapsulation: ViewEncapsulation.None, // Disable view encapsulation
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule]
})
export class ExpenseDetailComponent implements OnInit {
  expense: any = {};
  categories: any[] = [];
  newCategoryName: string = '';
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.expenseService.getExpense(Number(id)).subscribe(expense => {
        this.expense = expense;
      });
    } else {
      this.expense = new Expense();
    }
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      const newCategory = new Category();
      newCategory.name = this.newCategoryName.trim();
      this.categoryService.addCategory(newCategory).subscribe((category: any) => {
        this.getCategories();
      });
    }
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
     this.getCategories();
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.expenseService.updateExpense(this.expense).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    } else {
      this.expenseService.addExpense(this.expense).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/expenses']);
  }
}