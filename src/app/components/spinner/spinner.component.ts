import { ChangeDetectorRef, Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  isLoading = false;

  constructor(
    private spinnerService: SpinnerService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.spinnerService.getSpinnerVisible().subscribe((visible) => {
      this.isLoading = visible;
      this.cdRef.detectChanges();
    });
  }
}
