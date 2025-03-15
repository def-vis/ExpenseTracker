import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../expense.service';
import { Router } from '@angular/router';
import { Expense } from '../expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseDetailComponent } from '../expense-detail/expense-detail.component';
import moment from 'moment';

interface GroupedExpenses {
  [key: string]: Expense[];
}

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  groupedExpenses: GroupedExpenses = {};

  constructor(private expenseService: ExpenseService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe((data: Expense[]) => {
      this.expenses = data;
      this.groupExpenses();
    });
  }

  groupExpenses(): void {
    const currentDate = moment();
    const tempGroupedExpenses: GroupedExpenses = this.expenses.reduce(
      (groups: GroupedExpenses, expense: Expense) => {
        const expenseDate = moment(expense.date);
        const diffDays = currentDate.diff(expenseDate, 'days');

        let groupKey = '';

        if (diffDays < 7) {
          groupKey = `This Week`;
        } else if (expenseDate.isSame(currentDate, 'month')) {
          const weekOfMonth = Math.ceil(expenseDate.date() / 7);
          groupKey = `Week ${weekOfMonth} of ${expenseDate.format('MMMM YYYY')}`;
        } else {
          groupKey = expenseDate.format('MMMM YYYY');
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }

        groups[groupKey].push(expense);
        return groups;
      },
      {}
    );

    // Sort the group keys in chronological order
    const sortedKeys = Object.keys(tempGroupedExpenses).sort((a, b) => {
      // Define custom order
      const order = [
        'This Week',
        'Week 1 of',
        'Week 2 of',
        'Week 3 of',
        'Week 4 of'
      ];

      const aIsWeek = order.some(prefix => a.startsWith(prefix));
      const bIsWeek = order.some(prefix => b.startsWith(prefix));

      if (a === 'This Week') return -1;
      if (b === 'This Week') return 1;

      if (aIsWeek && bIsWeek) {
        return a.localeCompare(b); // Sort weeks in order
      } else if (aIsWeek) {
        return -1; // Place weeks before months
      } else if (bIsWeek) {
        return 1; // Place months after weeks
      }

      // Handle "Month Year" cases
      const momentA = moment(a, 'MMMM YYYY', true);
      const momentB = moment(b, 'MMMM YYYY', true);

      if (momentA.isValid() && momentB.isValid()) {
        return momentB.isBefore(momentA) ? -1 : 1; // Newest month first
      }

      return 0;
    });

    this.groupedExpenses = Object.fromEntries(
      sortedKeys.map(key => [key, tempGroupedExpenses[key]])
    );
    console.log(this.groupedExpenses);
  }

  openExpenseDetail(): void {
    const dialogRef = this.dialog.open(ExpenseDetailComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.loadExpenses();
    });
  }

  deleteExpense(id: number): void {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadExpenses();
    });
  }
}