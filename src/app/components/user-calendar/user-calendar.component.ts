import { Component, Input } from '@angular/core';
import { BookingService } from '../../services/bookings.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
interface TimeSlot {
  time: string;
}
@Component({
  selector: 'app-user-calendar',
  templateUrl: './user-calendar.component.html',
  styleUrl: './user-calendar.component.css',
})
export class UserCalendarComponent {
  editBooking = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  currentDate = new Date();
  weekStart: Date;
  weekEnd: Date;
  days: Date[] = [];
  bookedSlots: any = [];
  timeSlots: TimeSlot[] = [];
  now = new Date();
  edit: boolean = false;
  deleteBooking: boolean = false;
  delete: boolean = false;
  deleteId: number = 0;
  bookingData = {};
  startOfMonth = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    1
  );
  doctor: any;
  valuesToEdit = {};
  viewBooking: boolean = false;

  description: string = '';

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar
  ) {
    this.calculateWeek();
    this.generateTimeSlots();
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.bookingService.user(param['id']).subscribe((resp) => {
        this.bookedSlots = resp;
      });
    });
  }
  calculateWeek() {
    const day = this.currentDate.getDay(),
      diff = this.currentDate.getDate() - day + (day === 0 ? -6 : 1);
    this.weekStart = new Date(this.currentDate.setDate(diff));
    this.weekEnd = new Date(this.weekStart);
    this.weekEnd.setDate(this.weekStart.getDate() + 6);
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const newDay = new Date(this.weekStart);
      newDay.setDate(newDay.getDate() + i);
      this.days.push(newDay);
    }
    this.startOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      this.currentDate.getDate()
    );
    this.calculateWeek();
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      this.currentDate.getDate()
    );
    this.calculateWeek();
  }
  generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 9; hour <= 16; hour++) {
      this.timeSlots.push({ time: `${hour}:00 - ${hour + 1}:00` });
    }
  }
  closeView() {
    this.viewBooking = false;
    this.doctor = {};
    this.description = '';
  }

  bookSlot(date: Date, slot: TimeSlot) {
    const dateString = date.toISOString().split('T')[0];
    const index = this.bookedSlots.findIndex(
      (s) => s.bookingDate.split('T')[0] === dateString && s.time === slot.time
    );
    if (this.edit && index !== -1) {
      this.editBooking = true;
      this.description = this.bookedSlots[index]['description'];
      this.valuesToEdit = this.bookedSlots[index];
    }
    if (this.delete && index !== -1) {
      this.deleteBooking = true;
      this.deleteId = this.bookedSlots[index]['id'];
    }
    if (this.isBooked(date, slot) && !this.editBooking && !this.deleteBooking) {
      this.userService
        .user(this.bookedSlots[index].doctorId)
        .subscribe((resp) => {
          this.doctor = resp;
        });
      this.description = this.bookedSlots[index]['description'];
      this.viewBooking = !this.viewBooking;
    }
  }
  submitDelete() {
    this.bookingService.delete(this.deleteId).subscribe((resp) => {
      const index = this.bookedSlots.findIndex((s) => s.id === this.deleteId);
      this.bookedSlots.splice(index, 1);
      this.delete = false;
      this.deleteBooking = false;
      this.deleteId = 0;
      this._snackbar.open('ჯავშანი წარმატებით წაიშალა!', 'დახურვა', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5000,
      });
    });
  }
  submit() {
    if (this.description) {
      this.valuesToEdit['description'] = this.description;
    }
    this.bookingService
      .edit(this.valuesToEdit['id'], this.valuesToEdit)
      .subscribe((resp) => {
        this.edit = false;
        this.editBooking = false;
        this.valuesToEdit = {};
        this._snackbar.open('აღწერა წარმატებით შეიცვალა!', 'დახურვა', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000,
        });
      });
  }
  isWeekend(day: Date): boolean {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  isBooked(date: Date, slot: TimeSlot): boolean {
    const dateString = date.toISOString().split('T')[0];
    return this.bookedSlots.some(
      (s) => s.bookingDate.split('T')[0] === dateString && s.time === slot.time
    );
  }

  getSlotClass(date: Date, slot: TimeSlot) {
    if (this.isBooked(date, slot)) {
      return 'my';
    } else {
      return '';
    }
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.calculateWeek();
  }

  prevWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.calculateWeek();
  }
  toggleEdit() {
    this.edit = !this.edit;
    this.editBooking = false;
    this.valuesToEdit = {};
    this.delete = false;
    this.deleteBooking = false;
    this.viewBooking = false;
  }
  toggleDelete() {
    this.delete = !this.delete;
    this.deleteBooking = false;
    this.editBooking = false;
    this.edit = false;
    this.viewBooking = false;
  }
  activeTime(bookingSlots, time) {
    return bookingSlots.some(
      (obj) => obj.hasOwnProperty('time') && obj.time === time
    );
  }
}
