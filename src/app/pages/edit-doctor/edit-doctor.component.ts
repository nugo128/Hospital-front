import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.css',
})
export class EditDoctorComponent implements OnInit {
  user: any;
  editId: boolean = false;
  editEmail: boolean = false;
  editPassword: boolean = false;
  editBookings: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
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
  renderCategoryNames(): string {
    if (!this.user || !this.user.categories) return '';
    return this.user.categories.map((cat) => cat.name).join('/');
  }
  toggleEditId() {
    this.editId = !this.editId;
  }
  toggleEditEmail() {
    this.editEmail = !this.editEmail;
  }
  toggleEditPassword() {
    this.editPassword = !this.editPassword;
  }
  toggleEditBookings() {
    this.editBookings = !this.editBookings;
  }
}
