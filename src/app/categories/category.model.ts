import { Expense } from '../expenses/expense.model';

export class Category {
  id: number;
  name: string;
  expenses: Expense[];

  constructor() {
    this.id = 0;
    this.name = '';
    this.expenses = [];
  }
}