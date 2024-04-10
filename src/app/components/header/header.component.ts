import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loggedInUser: any;
  constructor(
    public dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.loggedInUser = user;
      console.log(this.loggedInUser);
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: '450px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'login') {
        this.authService.currentUser.subscribe((user) => {
          this.loggedInUser = user;
          console.log(this.loggedInUser);
        });
      }
      if (result === 'reset') {
        this._snackbar.open('აქტივაციის კოდი გამოგზავნილია მეილზე', 'Close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000,
        });
      }
    });
  }
}
