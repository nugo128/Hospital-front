import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MainComponent } from './pages/main/main.component';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminDoctorsComponent } from './pages/admin-doctors/admin-doctors.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'book-appointment/:id', component: BookAppointmentComponent },
  {
    path: 'register',
    component: RegistrationComponent,
    children: [
      {
        path: 'verify',
        component: RegistrationComponent,
      },
      {
        path: 'reset-password',
        component: RegistrationComponent,
      },
    ],
  },
  { path: 'user-profile/:id', component: UserProfileComponent },
  { path: 'doctor-profile/:id', component: DoctorProfileComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'doctors', component: AdminDoctorsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
