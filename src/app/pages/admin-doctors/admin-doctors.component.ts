import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrl: './admin-doctors.component.css',
})
export class AdminDoctorsComponent implements OnInit {
  users: any;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users().subscribe((resp) => {
      console.log(resp);
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
}
