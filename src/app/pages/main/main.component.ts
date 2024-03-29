import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  categories: any;
  users: any;
  constructor(
    private userService: UserService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.userService.users().subscribe((resp) => {
      console.log(resp);
      this.users = resp;
    });
    this.categoryService.categories().subscribe((resp) => {
      this.categories = resp;
    });
  }
}
