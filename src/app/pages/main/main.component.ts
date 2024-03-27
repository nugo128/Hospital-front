import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  public categories: any;
  public users: any;
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.authService.users().subscribe((resp) => {
      console.log(resp);
      this.users = resp;
    });
    this.categoryService.categories().subscribe((resp) => {
      this.categories = resp;
    });
  }
}
