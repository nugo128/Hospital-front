import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      email: [''],
      name: [''],
      lastName: [''],
      idNumber: [''],
      password: [''],
      repeatPassword: [''],
      image: [null],
      code: [''],
    });
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
    if (this.router.url === '/register/reset-password') {
      this.authService
        .resetPassword(
          this.registrationForm.value.code,
          this.registrationForm.value.password,
          this.registrationForm.value.repeatPassword
        )
        .subscribe((resp) => {
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
        });
    } else {
      this.formdata.append('email', this.registrationForm.value.email);
      this.formdata.append('name', this.registrationForm.value.name);
      this.formdata.append('lastname', this.registrationForm.value.lastname);
      this.formdata.append('idNumber', this.registrationForm.value.idNumber);
      this.formdata.append('password', this.registrationForm.value.password);
      this.formdata.append('image', this.registrationForm.value.image);

      this.authService.register(this.formdata).subscribe((resp) => {
        console.log(resp);
      });
    }
  }
}
