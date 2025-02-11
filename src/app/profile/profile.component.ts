import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import {UtenteService} from '../services/utente.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  errorMessage: string = '';

  constructor(private utenteShopService: UtenteService, private router: Router) {}

  ngOnInit(): void {
    this.utenteShopService.getUserDetailsDataBase().subscribe(
        (userData: any) => {
        this.userDetails = userData;
      },
        (error: any) => {
        console.error("Errore durante il recupero dei dati dell'utente:", error);
        this.errorMessage = 'Errore durante il recupero del profilo utente.';
      }
    );
  }

  goToPatients(): void {
    this.router.navigate(['/patients']);
  }
}
