import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {AdminComponent} from './admin/admin.component';

import {ProfileComponent} from './profile/profile.component';
import {ErrorComponent} from './error/error.component';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';



const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },
  {path:'home', component:AppComponent, canActivate: [AuthGuard], data: { role:['dottore'] }},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
