import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/input/input.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonComponent } from './components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './pages/main/main.component';
import { DoctorCardComponent } from './components/doctor-card/doctor-card.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';
import { CustomCalendarComponent } from './components/custom-calendar/custom-calendar.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserCalendarComponent } from './components/user-calendar/user-calendar.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminDoctorsComponent } from './pages/admin-doctors/admin-doctors.component';
import { EditDoctorComponent } from './pages/edit-doctor/edit-doctor.component';
import { EditEmailDialogComponent } from './components/edit-email-dialog/edit-email-dialog.component';
import { AdminCalendarComponent } from './components/admin-calendar/admin-calendar.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { UserGuard } from './guards/user-guard';
import { DoctorGuard } from './guards/doctor-guard';
import { AdminGuard } from './guards/admin-guard';
import { TokenInterceptor } from './token.interceptor';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerInterceptor } from './services/spinner-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    HeaderComponent,
    InputComponent,
    FooterComponent,
    ButtonComponent,
    MainComponent,
    DoctorCardComponent,
    LoginDialogComponent,
    BookAppointmentComponent,
    CustomCalendarComponent,
    UserProfileComponent,
    UserCalendarComponent,
    DoctorProfileComponent,
    DoctorCalendarComponent,
    AdminComponent,
    AdminDoctorsComponent,
    EditDoctorComponent,
    EditEmailDialogComponent,
    AdminCalendarComponent,
    CategoriesComponent,
    ErrorPageComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDialogModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    UserGuard,
    DoctorGuard,
    AdminGuard,
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
