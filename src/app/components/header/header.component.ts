import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loggedInUser: any;
  lang: string = localStorage.getItem('lang')
    ? localStorage.getItem('lang')
    : 'ge';
  constructor(
    public dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(this.lang);
  }

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
  switchLanguage(language: string) {
    this.translate.use(language);
    this.lang = language;
    localStorage.setItem('lang', language);
  }
}
