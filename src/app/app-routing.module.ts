import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MainComponent } from './pages/main/main.component';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
