import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: [''],
      name: [''],
      lastName: [''],
      idNumber: [''],
      password: [''],
    });
  }
  formdata: any;
  onSubmit() {
    this.formdata = this.registrationForm.value;
    console.log(this.formdata);
  }
}
