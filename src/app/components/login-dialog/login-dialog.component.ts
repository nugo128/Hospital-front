import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
})
export class LoginDialogComponent {
  errorMessage: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loginForm: FormGroup;
  twoStepActive = false;
  touched: boolean = false;
  validationMessages = {
    email: {
      required: 'მეილი სავალდებულოა',
      email: 'მეილის ფორმატი არასწორია',
    },
    password: {
      required: 'პაროლი სავალდებულოა',
      minlength: 'პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან',
    },
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private _snackbar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      code: [''],
    });
  }
  formdata: any;
  closeDialogWithData(type: string): void {
    this.dialogRef.close(type);
  }
  getErrors(control) {
    return Object.keys(control.errors);
  }
  onSubmit() {
    this.touched = true;
    this.errorMessage = '';
    console.log(this.loginForm.get('password').errors);
    this.formdata = this.loginForm.value;
    if (this.loginForm.valid) {
      this.authService.login(this.formdata).subscribe({
        next: (resp) => {
          this.touched = false;
          if (resp['token']) {
            console.log(resp);
            localStorage.setItem('token', resp['token']);
            this.closeDialogWithData('login');
          } else {
            this.twoStepActive = true;
            this._snackbar.open(
              'კოდი გამოგზავნილია მითითებულ მეილზე!',
              'დახურვა',
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 5000,
              }
            );
          }
        },
        error: (err) => {
          this.errorMessage = err.error;
        },
      });
    }
  }
  onVerify() {
    this.authService
      .verifyTwoStep(this.loginForm.value.email, this.loginForm.value.code)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          localStorage.setItem('token', resp['token']);
          this.closeDialogWithData('login');
        },
        error: (err) => {
          this.errorMessage = err.error;
        },
      });
  }
  reset() {
    this.formdata = this.loginForm.value;
    console.log(this.formdata['email']);
    this.authService
      .forgotPassword(this.formdata['email'])
      .subscribe((response) => {
        console.log(response);

        if (response['message'] === 'Password reset email sent') {
          this.closeDialogWithData('reset');
          this.router.navigate(['/register/reset-password']);
        }
      });
  }
}
