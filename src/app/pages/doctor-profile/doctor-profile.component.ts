import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { BookingService } from '../../services/bookings.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css',
})
export class DoctorProfileComponent implements OnInit {
  currentCategory: string = '';
  constructor(
    private categoryService: CategoryService,
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {}
  categories: any;
  bookings: any;
  id: number;
  loggedInUser: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  doctor: any;
  showPasswordFields: boolean = false;
  passwordValue: string;
  repeatPasswordValue: string;
  passwordLengthError: boolean = false;
  passwordsMatchError: boolean = false;
  errorMessage: string = '';
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.user(param['id']).subscribe((resp) => {
        this.doctor = resp;
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
      this.currentCategory = this.doctor?.categories?.name;
      return this.doctor?.categories?.name;
    } else {
      let categoryNames = '';
      for (let i = 0; i < this.doctor?.categories?.length; i++) {
        categoryNames += this.doctor?.categories[i]?.name;
        if (i !== this.doctor?.categories?.length - 1) {
          categoryNames += '/';
        }
      }
      this.currentCategory = categoryNames;
      return categoryNames;
    }
  }
  changePassword() {
    this.showPasswordFields = !this.showPasswordFields;
  }

  submitChangePassword() {
    const formdata = new FormData();
    this.passwordLengthError = this.passwordValue.length < 6;
    this.passwordsMatchError = this.passwordValue !== this.repeatPasswordValue;
    if (!this.passwordLengthError && !this.passwordsMatchError) {
      formdata.append('password', this.passwordValue);
      formdata.append('repeatPassword', this.repeatPasswordValue);
      this.userService.edit(this.id, formdata).subscribe({
        next: (resp) => {
          this._snackbar.open('პაროლი წარმატებით შეიცვალა!', 'დახურვა', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000,
          });
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
