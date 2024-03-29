import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
})
export class DoctorCardComponent {
  @Input() name = '';
  @Input() position;
  @Input() starCount = 0;
  @Input() image = '';
  @Input() id = 0;
  constructor(private router: Router) {}

  renderCategoryNames(): string {
    if (this.position.length === 1) {
      return this.position[0]?.name;
    } else {
      let categoryNames = '';
      for (let i = 0; i < this.position?.length; i++) {
        categoryNames += this.position[i]?.name;
        if (i !== this.position?.length - 1) {
          categoryNames += '/';
        }
      }
      return categoryNames;
    }
  }
  book(id) {
    this.router.navigate([`book-appointment/${id}`]);
  }
}
