import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
// import {AdminComponent} from './admin/admin.component';
import {ProfileComponent} from './profile/profile.component';
import {ErrorComponent} from './error/error.component';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {DoctorComponent} from './doctor/doctor.component';
import { CalendarComponent } from './calendar/calendar.component';
import {PatientsComponent} from './patients/patients.component';
import {WarehouseComponent} from './warehouse/warehouse.component';
import {HeadOfDepartmentComponent} from './head-of-department/head-of-department.component';
import {CalendarHeadOfDepartmentComponent} from './calendar-head-of-department/calendar-head-of-department.component';

const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },
  {path:'home', component:AppComponent},
  { path: 'dottore', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['dottore'] } },
  { path: 'capo-reparto', component: HeadOfDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'paziente', component: PatientsComponent, canActivate: [AuthGuard], data: { roles: ['dottore', 'capo-reparto'] } },
  { path: 'magazzino', component: WarehouseComponent, canActivate: [AuthGuard], data: { roles: ['dottore'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'calendarioHeadOfDepartment', component: CalendarHeadOfDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto']}},
  { path: 'calendario', component: CalendarComponent },
  { path: 'error', component: ErrorComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
