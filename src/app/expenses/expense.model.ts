export class Expense {
  id: number;
  amount: number;
  categoryId: number;
  date: Date;
  description?: string;
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  isAnomaly: boolean;

  constructor() {
    this.id = 0;
    this.amount = 0;
    this.categoryId = 0;
    this.date = new Date();
    this.description = '';
    this.paymentMethod = PaymentMethod.Cash;
    this.isRecurring = false;
    this.isAnomaly = false;
  }
}

export enum PaymentMethod {
  Cash = 'Cash',
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  Other = 'Other'
}