import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  currentUrl: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  errorMessage: string;
  touched: boolean = false;
  validationMessages = {
    email: {
      required: 'ელ. ფოსტა აუცილებელია.',
      email: 'გთხოვთ, შეიყვანოთ სწორი ელ. ფოსტა.',
    },
    name: {
      required: 'სახელი აუცილებელია.',
      minlength: 'სახელი უნდა იყოს მინიმუმ 5 სიმბოლო.',
    },
    lastName: {
      required: 'გვარი აუცილებელია.',
    },
    idNumber: {
      required: 'პირადი ნომერი აუცილებელია.',
      minlength: 'პირადი ნომერი უნდა იყოს 11 სიმბოლო.',
      maxlength: 'პირადი ნომერი უნდა იყოს 11 სიმბოლო.',
    },
    password: {
      required: 'პაროლი აუცილებელია.',
      minlength: 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო.',
    },
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        console.log(val['url']);
        this.currentUrl = val['url'];
      }
    });
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required]],
      idNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: [''],
      image: [null],
      code: [''],
    });
  }
  getErrors(control) {
    return Object.keys(control.errors);
  }

  ngOnInit() {
    console.log(12);
    this.currentUrl = this.router.url;
    console.log(this.router.url);
    if (this.router.url === '/register/verify') {
      this.route.queryParams.subscribe((params) => {
        console.log(params);
        this.authService.verify(params.token).subscribe(
          (resp) => {
            console.log(resp['message']);
            this.router.navigate(['/']);
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  }
  formdata = new FormData();
  onSubmit() {
    this.errorMessage = '';
    if (this.router.url === '/register/reset-password') {
      this.authService
        .resetPassword(
          this.registrationForm.value.code,
          this.registrationForm.value.password,
          this.registrationForm.value.repeatPassword
        )
        .subscribe({
          next: (resp) => {
            if (resp['message'] === 'Password reset successfully') {
              this.registrationForm.patchValue({
                code: '',
                password: '',
                repeatPassword: '',
              });
              this.router.navigate(['/']);
              this._snackbar.open('პაროლი წარმატებით შეიცვალა!', 'დახურვა', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 5000,
              });
            }
          },
          error: (err) => {
            this.errorMessage = err.error;
          },
        });
    } else {
      Object.entries(this.registrationForm.value).forEach(([key, value]) => {
        if (typeof value === 'string') {
          this.formdata.append(key, value);
        } else if (value instanceof File) {
          this.formdata.append(key, value, value.name);
        }
      });
      this.touched = true;
      if (this.registrationForm.valid) {
        this.authService.register(this.formdata).subscribe({
          next: (resp) => {
            this.touched = false;
            console.log(resp);
          },
          error: (err) => {
            this.errorMessage = err.error;
            console.log(err);
          },
        });
      }
    }
  }
}
