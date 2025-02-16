import {NgModule, APP_INITIALIZER, PLATFORM_ID, inject} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
// import { AdminComponent } from './admin/admin.component';
import { PatientsComponent } from './patients/patients.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NotificationService} from './services/notification.service';
import { CommonModule } from '@angular/common';
import {DoctorComponent} from './doctor/doctor.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import {CalendarComponent} from './calendar/calendar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {SomministraMedicinaDialogComponent} from './somministra-medicina-dialog/somministra-medicina-dialog.component';
import {MatOption} from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {WarehouseComponent} from './warehouse/warehouse.component';
import {HeadOfDepartmentComponent} from './head-of-department/head-of-department.component';
import {EventDialogComponent} from './event-dialog/event-dialog.component';
import {CalendarHeadOfDepartmentComponent} from './calendar-head-of-department/calendar-head-of-department.component';
import {DoctorsComponent} from './doctors/doctors.component';




export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak
        .init({
          config: {
            url: 'http://localhost:8080',
            realm: 'hospital-realm',
            clientId: 'hospital-app',
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
          },
        })
        .then(() => {
          console.log('Sono dentro',keycloak.isLoggedIn());
          console.log('Eccomi', keycloak.getToken());
          console.log('Keycloak inizializzato con successo');
        })
        .catch((err) => {
          console.error('Sono dentro',keycloak.isLoggedIn());
          console.error('Eccomi', keycloak.getToken());
          console.error('Errore inizializzazione Keycloak:', err);
        })
      : Promise.resolve();
}




@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    PatientsComponent,
    ErrorComponent,
    // AdminComponent,
    NotFoundComponent,
    DoctorComponent,
    CalendarComponent,
    SomministraMedicinaDialogComponent,
    WarehouseComponent,
    HeadOfDepartmentComponent,
    EventDialogComponent,
    CalendarHeadOfDepartmentComponent,
    DoctorsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    CommonModule,
    FullCalendarModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatAutocompleteTrigger,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
    CommonModule,
    MatOption,
    MatAutocompleteTrigger,
    MatAutocomplete,

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
