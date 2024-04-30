import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/bookings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  categories;
  loggedInUser;
  bookings;
  id: number;
  showPasswordFields: boolean = false;
  passwordValue: string;
  repeatPasswordValue: string;
  passwordLengthError: boolean = false;
  passwordsMatchError: boolean = false;
  errorMessage: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
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
