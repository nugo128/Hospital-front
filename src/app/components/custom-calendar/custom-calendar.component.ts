import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../services/bookings.service';
interface TimeSlot {
  time: string;
}

interface BookedSlot {
  date: string;
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
  bookedSlots: BookedSlot[] = [];
  now = new Date();
  @Input() id = 0;
  startOfMonth = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    1
  );

  constructor(private bookingService: BookingService) {
    this.calculateWeek();
    this.generateTimeSlots();
  }
  ngOnInit(): void {
    this.bookingService.doctor(this.id).subscribe((resp) => {
      for (let i = 0; i < resp['length']; i++) {
        const dateString = resp[i].bookingDate.split('T')[0];

        this.bookedSlots.push({ date: dateString, time: resp[i].time });
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
      this.bookedSlots.splice(index, 1);
    } else {
      this.bookedSlots.push({ date: dateString, time: slot.time });
      console.log(this.bookedSlots);
    }
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

  getSlotClass(date: Date, slot: TimeSlot) {
    return this.isBooked(date, slot) ? 'booked' : '';
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
