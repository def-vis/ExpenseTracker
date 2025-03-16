import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { Expense } from '../expense.model';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../categories/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  encapsulation: ViewEncapsulation.None, // Disable view encapsulation
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule]
})
export class ExpenseDetailComponent implements OnInit {
  expense: any = {};
  categories: any[] = [];
  newCategoryName: string = '';
  isEditMode: boolean = false;
  showCategories: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private router: Router,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ExpenseDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
      this.expense.date = new Date().toISOString().split('T')[0]; // Set default date to current date
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
        this.dialogRef.close();
      });
    } else {
      this.expenseService.addExpense(this.expense).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.expense.image = file;
    }
  }

  // uploadImage(): void {
  //   if (this.expense.image) {
  //     this.expenseService.uploadImage(this.expense.image).subscribe((expense: any) => {
  //       if(expense.id == 0) {
  //       this.expense = expense;
  //       }
  //       else{
  //         this.router.navigate(['/expenses']);
  //       }
  //     });
  //   }
  // }
  uploadScreenshot(): void {
    if (this.expense.image) {
      this.expenseService.uploadScreenshot(this.expense.image).subscribe((expense: any) => {
        this.dialogRef.close();
      });
    }
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }
}