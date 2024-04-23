import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-email-dialog',
  templateUrl: './edit-email-dialog.component.html',
  styleUrl: './edit-email-dialog.component.css',
})
export class EditEmailDialogComponent implements OnInit {
  emailVerificationCodeSent: boolean = false;
  oldEmailVerified: boolean = false;
  newEmailCodeSent: boolean = false;
  succesfullyChanged: boolean = false;
  oldEmailCode: string = '';
  errorMessage: string;
  newEmail: string;
  newEmailCode: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEmailDialogComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.changeEmail(this.data['id']).subscribe({
      next: (resp) => {
        this.emailVerificationCodeSent = true;
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }
  verifyCode() {
    this.userService.verifyCode(this.data['id'], this.oldEmailCode).subscribe({
      next: (resp) => {
        this.oldEmailVerified = true;
        this.emailVerificationCodeSent = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }
  enterNewEmail() {
    this.userService.newEmail(this.data['id'], this.newEmail).subscribe({
      next: (resp) => {
        this.oldEmailVerified = false;
        this.newEmailCodeSent = true;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }
  verifyNewCode() {
    this.userService
      .verifyNewEmail(this.data['id'], this.newEmailCode, this.newEmail)
      .subscribe({
        next: (resp) => {
          this.succesfullyChanged = true;
          this.newEmailCodeSent = false;
          this.errorMessage = '';
          setTimeout(() => {
            this.dialogRef.close('email changed');
          }, 5000);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }
}
