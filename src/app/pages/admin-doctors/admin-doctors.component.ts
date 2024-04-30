import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrl: './admin-doctors.component.css',
})
export class AdminDoctorsComponent implements OnInit {
  users: any;
  delete: boolean = false;
  deleteID: number = 0;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users().subscribe((resp) => {
      this.users = resp;
    });
  }
  getFontSize(n: number): string {
    let result: number;
    if (n === 4) {
      result = 7;
    } else if (n === 3) {
      result = 14;
    } else if (n === 2) {
      result = 21;
    } else if (n === 1) {
      result = 28;
    } else {
      result = 0;
    }
    return `${result}px`;
  }
  deleteDoctor(id) {
    this.delete = true;
    this.deleteID = id;
  }
  cancelDelete() {
    this.delete = false;
  }
  confirmDelete() {
    this.userService.delete(this.deleteID).subscribe({
      next: (resp) => {
        const index = this.users.findIndex((user) => user.id === this.deleteID);
        this.users.splice(index, 1);
        this.delete = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
