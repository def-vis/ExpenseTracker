import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class CategoryDetailComponent implements OnInit {
  categoryId: number = 0;
  category: Category = new Category();

  constructor(private categoryService: CategoryService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];
    this.getCategoryDetails();
  }

  getCategoryDetails(): void {
    if (this.categoryId) {
      this.categoryService.getCategory(this.categoryId).subscribe(data => {
        this.category = data;
      });
    }
  }

  saveCategory(): void {
    if (this.categoryId) {
      this.categoryService.updateCategory(this.category).subscribe(() => {
        // Handle successful update
      });
    } else {
      this.categoryService.addCategory(this.category).subscribe(() => {
        // Handle successful addition
      });
    }
  }
}