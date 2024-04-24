import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditEmailDialogComponent } from '../../components/edit-email-dialog/edit-email-dialog.component';
import { AdminCalendarComponent } from '../../components/admin-calendar/admin-calendar.component';
@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.css',
})
export class EditDoctorComponent implements OnInit {
  @ViewChild(AdminCalendarComponent) childComponent: AdminCalendarComponent;
  user: any;
  editId: boolean = false;
  editEmail: boolean = false;
  editPassword: boolean = false;
  editBookings: boolean = false;
  idNumberValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  repeatPasswordValue: string = '';
  errorMessage: string;
  edittingOn: boolean = false;
  deletingOn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.user(param['id']).subscribe((resp) => {
        this.user = resp;
        console.log(resp);
      });
    });
  }
  formdata = new FormData();
  uploadFile(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.formdata.append('image', file, file.name);
      this.userService.edit(this.user.id, this.formdata).subscribe({
        next: (resp) => {
          console.log(resp);
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data: string = reader.result as string;
            const cleanBase64Data = base64Data.replace(
              /^data:image\/(jpeg|png);base64,/,
              ''
            );
            this.user.image = cleanBase64Data;
          };
          reader.readAsDataURL(file);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(EditEmailDialogComponent, {
      data: { id: this.user.id, email: this.user.email },
      panelClass: 'custom-dialog-container',
      height: '450px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
    });
  }
  update() {
    if (this.idNumberValue) {
      this.formdata.append('IdNumber', this.idNumberValue);
    }
    if (this.passwordValue && this.repeatPasswordValue) {
      this.formdata.append('password', this.passwordValue);
      this.formdata.append('repeatPassword', this.repeatPasswordValue);
    }
    if (this.editId || this.editPassword) {
      this.userService.edit(this.user.id, this.formdata).subscribe({
        next: (resp) => {
          this.editEmail = false;
          this.editId = false;
          this.editPassword = false;
          this.errorMessage = '';
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error.message;
        },
      });
    }
  }
  renderCategoryNames(): string {
    if (!this.user || !this.user.categories) return '';
    return this.user.categories.map((cat) => cat.name).join('/');
  }
  toggleEditId() {
    this.editId = !this.editId;
  }
  toggleEditEmail() {
    this.editEmail = !this.editEmail;
    this.openDialog();
  }
  toggleEditPassword() {
    this.editPassword = !this.editPassword;
  }
  toggleEditBookings() {
    this.editBookings = !this.editBookings;
  }
  editting() {
    this.edittingOn = !this.edittingOn;
    this.deletingOn = false;
  }
  deleting() {
    this.deletingOn = !this.deletingOn;
    this.edittingOn = false;
  }
  recieveDeleteOff() {
    this.deletingOn = false;
  }
  recieveEdittingOff() {
    this.edittingOn = false;
  }
}
