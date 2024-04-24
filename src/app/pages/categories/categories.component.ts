import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  edit: boolean = false;
  idToEdit: number = 0;
  delete: boolean = false;
  categories: any;
  editText: string;
  deleteId: number;
  errorMessage: string;
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.categoryService.categories().subscribe((resp) => {
      this.categories = resp;
    });
  }
  toggleEdit(id) {
    this.idToEdit = id;
    this.edit = !this.edit;
  }
  deleteCategory(id) {
    this.errorMessage = '';
    this.delete = true;
    this.deleteId = id;
  }
  confirmDelete() {
    this.categoryService.deleteCategory(this.deleteId).subscribe({
      next: (resp) => {
        this.errorMessage = '';
        const index = this.categories.findIndex(
          (cat) => cat.id === this.deleteId
        );
        this.categories.splice(index, 1);
        this.delete = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.delete = false;
      },
    });
  }
  cancelDelete() {
    this.delete = false;
    this.deleteId = 0;
    this.errorMessage = '';
  }
  editCategory(id) {
    this.categoryService.editCategory(id, this.editText).subscribe((resp) => {
      const index = this.categories.findIndex((cat) => cat.id === id);
      this.categories[index].name = this.editText;
      this.editText = '';
      this.edit = false;
    });
  }
}
