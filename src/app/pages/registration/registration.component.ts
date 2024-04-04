import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      email: [''],
      name: [''],
      lastName: [''],
      idNumber: [''],
      password: [''],
      image: [null],
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.authService.verify(params.token).subscribe(
        (resp) => {
          console.log(resp['message']);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }
  formdata: FormData;
  onSubmit() {
    this.formdata = this.registrationForm.value;
    console.log(this.formdata);
    this.authService.register(this.formdata).subscribe((resp) => {
      console.log(resp);
    });
  }
}
