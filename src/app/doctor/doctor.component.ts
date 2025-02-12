import { Component } from '@angular/core';
import { AuthenticationService } from '../auth/authenticationService';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent {
  constructor(public authenticationService: AuthenticationService) {}

  logout() {
    this.authenticationService.logout();
  }
}
