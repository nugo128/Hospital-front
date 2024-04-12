import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/bookings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  categories;
  loggedInUser;
  bookings;
  id;
  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log(param['id']);
      this.bookingService.user(param['id']).subscribe((resp) => {
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
}
