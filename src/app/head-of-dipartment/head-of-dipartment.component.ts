import { Component } from '@angular/core';
import {AuthenticationService} from '../auth/authenticationService';

@Component({
  selector: 'app-head-of-dipartment',
  templateUrl: './head-of-dipartment.component.html',
  styleUrl: './head-of-dipartment.component.css'
})
export class HeadOfDipartmentComponent {
  constructor(public authenticationService: AuthenticationService) {}

  logout() {
    this.authenticationService.logout();
  }

}
