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
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.categoryService.categories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    });
  }
  toggleEdit(id) {
    this.idToEdit = id;
    this.edit = !this.edit;
  }
  toggleDelete() {
    this.delete = !this.delete;
  }
}
