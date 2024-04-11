import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../services/bookings.service';
import { AuthService } from '../../services/auth.service';
interface TimeSlot {
  time: string;
}

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrl: './custom-calendar.component.css',
})
export class CustomCalendarComponent implements OnInit {
  currentDate = new Date();
  weekStart: Date;
  weekEnd: Date;
  days: Date[] = [];
  timeSlots: TimeSlot[] = [];
  bookedSlots: any = [];
  now = new Date();
  loggedInUser: any = null;
  pleaseLogIn = false;
  approveBooking = false;
  bookingData = {};
  @Input() id = 0;
  startOfMonth = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    1
  );

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.calculateWeek();
    this.generateTimeSlots();
  }
  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.bookingService.doctor(this.id).subscribe((resp) => {
      console.log(resp);
      for (let i = 0; i < resp['length']; i++) {
        const dateString = resp[i].bookingDate.split('T')[0];

        this.bookedSlots.push({
          date: dateString,
          time: resp[i].time,
          doctorId: resp[i]['doctorId'],
          userId: resp[i]['userId'],
        });
      }
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
      (s) => s.date === dateString && s.time === slot.time
    );
    if (index > -1) {
      this.approveBooking = false;
      this.bookedSlots.splice(index, 1);
    } else {
      if (this.loggedInUser) {
        const data = {
          date: dateString,
          time: slot.time,
          userId: this.loggedInUser.id,
          doctorId: +this.id,
        };
        this.bookedSlots.push(data);
        this.bookingData = data;
        this.approveBooking = true;
      } else {
        this.pleaseLogIn = true;
        console.log(2);
        setTimeout(() => {
          this.pleaseLogIn = false;
        }, 5000);
      }
    }
  }
  description: string = '';
  submit() {
    this.bookingData['description'] = this.description;
    this.bookingData['bookingDate'] = this.bookingData['date'];

    this.bookingService.book(this.bookingData).subscribe((resp) => {
      this.approveBooking = false;
    });
  }
  isWeekend(day: Date, slot: string): boolean {
    const dayOfWeek = day.getDay();
    const currentDate = new Date();
    const isToday = day.toDateString() === currentDate.toDateString();
    const startTime = new Date(
      currentDate.toDateString() + ' ' + slot['time'].split('-')[0].trim()
    );
    const checkHours = isToday ? currentDate > startTime : false;
    return (
      dayOfWeek === 0 ||
      dayOfWeek === 6 ||
      day <
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ) ||
      checkHours
    );
  }

  isBooked(date: Date, slot: TimeSlot): boolean {
    const dateString = date.toISOString().split('T')[0];
    return this.bookedSlots.some(
      (s) => s.date === dateString && s.time === slot.time
    );
  }
  isBookedByUser(date: Date, slot: TimeSlot): boolean {
    const dateString = date.toISOString().split('T')[0];
    const loggedInUserId = this.loggedInUser?.id;
    return this.bookedSlots.some(
      (s) =>
        s.date === dateString &&
        s.time === slot.time &&
        s.userId === loggedInUserId
    );
  }

  getSlotClass(date: Date, slot: TimeSlot) {
    if (this.isBookedByUser(date, slot)) {
      return 'my';
    } else if (this.isBooked(date, slot)) {
      return 'booked';
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
}
