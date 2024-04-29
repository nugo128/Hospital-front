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
  data: any;
  displayedUsers: any[] = [];
  limit = 6;
  showAll = false;
  selectedCategory: string;
  constructor(
    private userService: UserService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.userService.users().subscribe((resp) => {
      console.log(resp);
      this.data = resp;
      this.users = this.data.sort((a, b) => {
        return b.pinned - a.pinned || a.name.localeCompare(b.name);
      });
      this.displayedUsers = this.users.slice(0, this.limit);
    });
    this.categoryService.categories().subscribe((resp) => {
      console.log(resp);
      this.categories = resp;
    });
  }
  filterUsersByCategory(category: any): void {
    console.log(category);
    if (!category || this.selectedCategory === category) {
      this.displayedUsers = this.users.slice(0, 6);
      this.selectedCategory = '';
      return;
    }
    this.selectedCategory = category;
    this.displayedUsers = this.users.filter((user) =>
      user.categories.some((cat) => cat.name === category)
    );
  }
  onViewAll(): void {
    this.showAll = !this.showAll;
    this.displayedUsers = this.showAll
      ? this.users
      : this.users.slice(0, this.limit);
  }
  changePinned(data: number) {
    const index = this.users.findIndex((user) => user.id === data);
    this.users[index]['pinned'] = !this.users[index]['pinned'];
    this.users = this.users.sort((a, b) => {
      return b.pinned - a.pinned || a.name.localeCompare(b.name);
    });
    !this.showAll
      ? (this.displayedUsers = this.users.slice(0, this.limit))
      : this.users;
  }
}
