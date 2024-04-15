import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { BookingService } from '../../services/bookings.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css',
})
export class DoctorProfileComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  categories: any;
  bookings: any;
  id: number;
  loggedInUser: any;
  doctor: any;
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log(param['id']);
      this.userService.user(param['id']).subscribe((resp) => {
        this.doctor = resp;
        console.log(this.doctor);
      });
      this.bookingService.doctor(param['id']).subscribe((resp) => {
        this.bookings = resp;

        this.id = param['id'];
      });
    });

    this.categoryService.categories().subscribe((resp) => {
      this.categories = resp;
    });
    this.authService.currentUser.subscribe((user) => {
      this.loggedInUser = user;
    });
  }
  renderCategoryNames(): string {
    if (this.doctor?.categories.length === 1) {
      return this.doctor?.categories?.name;
    } else {
      let categoryNames = '';
      for (let i = 0; i < this.doctor?.categories?.length; i++) {
        categoryNames += this.doctor?.categories[i]?.name;
        if (i !== this.doctor?.categories?.length - 1) {
          categoryNames += '/';
        }
      }
      return categoryNames;
    }
  }
}
