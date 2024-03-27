import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginDialogComponent>
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  formdata: any;
  onSubmit() {
    this.formdata = this.loginForm.value;
    console.log(this.formdata);
    this.authService.login(this.formdata).subscribe((resp) => {
      console.log(resp);
      localStorage.setItem('token', resp['token']);
    });
  }
}
