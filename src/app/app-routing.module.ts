import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// import {AdminComponent} from './admin/admin.component';
import {ProfileComponent} from './profile/profile.component';
import {ErrorComponent} from './error/error.component';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeadOfDipartmentComponent} from './head-of-dipartment/head-of-dipartment.component';
import {DoctorComponent} from './doctor/doctor.component';
import { CalendarComponent } from './calendar/calendar.component';
import {PatientsComponent} from './patients/patients.component';

const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },
  {path:'home', component:AppComponent},
  { path: 'dottore', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['dottore'] } },
  { path: 'capo-reparto', component: HeadOfDipartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'paziente', component: PatientsComponent, canActivate: [AuthGuard], data: { roles: ['dottore', 'capo-reparto'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarComponent },
  { path: 'error', component: ErrorComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
