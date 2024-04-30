import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerVisible = new BehaviorSubject<boolean>(false);
  private loadingRequestCount = 0;
  getSpinnerVisible() {
    return this.spinnerVisible.asObservable();
  }

  show() {
    if (this.loadingRequestCount === 0) {
      this.spinnerVisible.next(true);
    }
    this.loadingRequestCount++;
  }

  hide() {
    this.loadingRequestCount--;
    if (this.loadingRequestCount === 0) {
      this.spinnerVisible.next(false);
    }
  }
}
