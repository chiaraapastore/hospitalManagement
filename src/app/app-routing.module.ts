import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
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
import {DoctorsComponent} from './doctors/doctors.component';
import {WarehouseHeadOfDepartmentComponent} from './warehouse-head-of-department/warehouse-head-of-department.component';
import {AdminComponent} from './admin/admin.component';
import {DoctorsAdminComponent} from './doctors-admin/doctors-admin.component';
import {WarehouseAdminComponent} from './warehouse-admin/warehouse-admin.component';
import {DatiStatisticheComponent} from './dati-statistiche/dati-statistiche.component';

const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },
  {path:'home', component:AppComponent},
  { path: 'dottore', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['dottore'] } },
  { path: 'capo-reparto', component: HeadOfDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'paziente', component: PatientsComponent, canActivate: [AuthGuard], data: { roles: ['dottore', 'capo-reparto'] } },
  { path: 'magazzino', component: WarehouseComponent, canActivate: [AuthGuard], data: { roles: ['dottore'] } },
  { path: 'magazzinoCapoReparto', component: WarehouseHeadOfDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dottori', component: DoctorsComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto'] } },
  { path: 'dottoriAdmin', component: DoctorsAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'magazzinoAdmin', component: WarehouseAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'dati-statistiche', component: DatiStatisticheComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  {path: 'calendarioHeadOfDepartment', component: CalendarHeadOfDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['capo-reparto']}},
  { path: 'calendario', component: CalendarComponent },
  { path: 'error', component: ErrorComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
