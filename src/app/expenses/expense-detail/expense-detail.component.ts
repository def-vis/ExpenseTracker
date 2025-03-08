import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense, PaymentMethod } from '../expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule]
})
export class ExpenseDetailComponent implements OnInit {
  expense: Expense = new Expense();
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private router: Router
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