import { Component, Input } from '@angular/core';
import { BookingService } from '../../services/bookings.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
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
  bookingData = {};
  startOfMonth = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    1
  );
  valuesToEdit = {};

  description: string = '';

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar
  ) {
    this.calculateWeek();
    this.generateTimeSlots();
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log(param['id']);
      this.bookingService.user(param['id']).subscribe((resp) => {
        this.bookedSlots = resp;
        console.log(resp);
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

  bookSlot(date: Date, slot: TimeSlot) {
    const dateString = date.toISOString().split('T')[0];
    const index = this.bookedSlots.findIndex(
      (s) => s.bookingDate.split('T')[0] === dateString && s.time === slot.time
    );
    console.log(index);
    console.log(console.log(this.bookedSlots[index]));
    if (this.edit && index !== -1) {
      this.editBooking = true;
      this.valuesToEdit = this.bookedSlots[index];
    }
  }
  submit() {
    console.log(this.valuesToEdit);
    if (this.description) {
      this.valuesToEdit['description'] = this.description;
    }
    this.bookingService
      .edit(this.valuesToEdit['id'], this.valuesToEdit)
      .subscribe((resp) => {
        console.log(resp);
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
  }
}
