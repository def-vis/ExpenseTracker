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

type GroupedExpenses = [string, Expense[]][]; 


@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  groupedExpenses: GroupedExpenses = [];


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
    
    // Use a Map to store expenses since it maintains order
    const tempGroupedExpenses = new Map<string, Expense[]>();
  
    this.expenses.forEach((expense) => {
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
  
      if (!tempGroupedExpenses.has(groupKey)) {
        tempGroupedExpenses.set(groupKey, []);
      }
  
      tempGroupedExpenses.get(groupKey)!.push(expense);
    });
  
    // Sort keys in order
    const sortedKeys = Array.from(tempGroupedExpenses.keys()).sort((a, b) => {
      if (a === 'This Week') return -1;
      if (b === 'This Week') return 1;
  
      const weekRegex = /^Week (\d) of (.+)$/;
      const aMatch = a.match(weekRegex);
      const bMatch = b.match(weekRegex);
  
      if (aMatch && bMatch) {
        // Compare by month first
        const momentA = moment(aMatch[2], 'MMMM YYYY');
        const momentB = moment(bMatch[2], 'MMMM YYYY');
  
        if (momentA.isBefore(momentB)) return 1;
        if (momentA.isAfter(momentB)) return -1;
  
        // If same month, compare by week number
        const weekA = parseInt(aMatch[1]);
        const weekB = parseInt(bMatch[1]);
        return weekA - weekB;
      }
  
      // Handle "Month Year" cases
      const momentA = moment(a, 'MMMM YYYY', true);
      const momentB = moment(b, 'MMMM YYYY', true);
  
      if (momentA.isValid() && momentB.isValid()) {
        return momentB.isBefore(momentA) ? -1 : 1; // Newest month first
      }
  
      return 0;
    });
  
    // Convert sorted keys back into a sorted array of key-value pairs
    this.groupedExpenses = sortedKeys.map((key) => [
      key,
      tempGroupedExpenses.get(key)!,
    ]);
  
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