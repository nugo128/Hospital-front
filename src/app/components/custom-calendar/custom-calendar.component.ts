import { Component } from '@angular/core';
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
export class CustomCalendarComponent {
  currentDate = new Date();
  weekStart: Date;
  weekEnd: Date;
  days: Date[] = [];
  timeSlots: TimeSlot[] = [];
  bookedSlots: BookedSlot[] = [];

  constructor() {
    this.calculateWeek();
    this.generateTimeSlots();
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
    }
  }
  isWeekend(day: Date): boolean {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
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
