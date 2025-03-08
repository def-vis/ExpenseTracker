import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expenses/expense.service';
import { CategoryService } from '../categories/category.service';
import { CommonModule } from '@angular/common';
import { Expense } from '../expenses/expense.model'; // Ensure you have an Expense model
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  totalExpenses: number = 0;
  totalCategories: number = 0;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTotalExpenses();
    this.fetchTotalCategories();
  }

  fetchTotalExpenses(): void {
    this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      this.totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
    });
  }

  fetchTotalCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.totalCategories = categories.length;
    });
  }

  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}