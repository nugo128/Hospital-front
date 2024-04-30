import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
})
export class BookAppointmentComponent implements OnInit {
  user: any;
  categories: any;
  id: number;
  highlitedCategory: string;
  jobEntries: { date: string; description: string }[] = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.id = param['id'];
      this.userService.user(param['id']).subscribe((resp) => {
        this.user = resp;
        const parts = resp['description']?.split('.');
        parts?.forEach((part) => {
          const [dateRange, description] = part?.split(/,\s*/);
          this.jobEntries.push({ date: dateRange, description: description });
        });
      });
    });
    this.categoryService.categories().subscribe((resp) => {
      this.categories = resp;
    });
  }
  renderCategoryNames(): string {
    if (this.user?.categories.length === 1) {
      this.highlitedCategory = this.user?.categories[0]?.name;
      return this.user?.categories[0]?.name;
    } else {
      this.highlitedCategory = this.user?.categories[0]?.name;
      let categoryNames = '';
      for (let i = 0; i < this.user?.categories?.length; i++) {
        categoryNames += this.user?.categories[i]?.name;
        if (i !== this.user?.categories?.length - 1) {
          categoryNames += '/';
        }
      }
      return categoryNames;
    }
  }
}
