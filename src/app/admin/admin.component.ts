import { Component, OnInit } from '@angular/core';
import { UtenteService } from '../services/utente.service';
import { NotificationService } from '../services/notification.service';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {

  nuovoRepartoNome: string = '';
  utenteIdDaAggiungere: string = '';
  repartoIdDaAggiungere: string = '';
  utenteIdCapoReparto: string = '';
  repartoIdCapoReparto: string = '';

  notifications: string[] = [];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private utenteService: UtenteService,
  ) {}

  ngOnInit(): void {
    this.caricaNotifiche();
  }

  caricaNotifiche(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifiche: string[]) => {
        this.notifications = notifiche;
      },
      error: (error: any) => {
        console.error('Errore nel caricamento delle notifiche:', error);
      }
    });
  }

  creaReparto(): void {
    if (this.nuovoRepartoNome) {
      this.adminService.creaReparto(this.nuovoRepartoNome).subscribe({
        next: (response) => {
          this.notificationService.addNotification(`Reparto "${this.nuovoRepartoNome}" creato con successo.`);
          this.nuovoRepartoNome = ''; // Resetta il campo
        },
        error: (error: { message: any; }) => {
          console.error('Errore nella creazione del reparto:', error);
          this.notificationService.addNotification(`Errore nella creazione del reparto: ${error.message}`);
        }
      });
    } else {
      this.notificationService.addNotification('Il nome del reparto non può essere vuoto.');
    }
  }

  aggiungiDottoreAReparto(): void {
    const utenteId = parseInt(this.utenteIdDaAggiungere, 10);
    const repartoId = parseInt(this.repartoIdDaAggiungere, 10);

    if (!isNaN(utenteId) && !isNaN(repartoId)) {
      this.adminService.aggiungiDottoreAReparto(utenteId, repartoId).subscribe({
        next: (response) => {
          this.notificationService.addNotification(`Utente ${utenteId} aggiunto al reparto ${repartoId}.`);
          this.utenteIdDaAggiungere = '';
          this.repartoIdDaAggiungere = '';
        },
        error: (error: { message: any; }) => {
          console.error('Errore nell\'aggiunta dell\'utente al reparto:', error);
          this.notificationService.addNotification(`Errore nell\'aggiunta dell\'utente al reparto: ${error.message}`);
        }
      });
    } else {
      this.notificationService.addNotification('Inserisci un ID utente e un ID reparto validi.');
    }
  }

  assegnaCapoReparto(): void {
    const utenteId = parseInt(this.utenteIdCapoReparto, 10);
    const repartoId = parseInt(this.repartoIdCapoReparto, 10);

    if (!isNaN(utenteId) && !isNaN(repartoId)) {
      this.adminService.assegnaCapoReparto(utenteId, repartoId).subscribe({
        next: (response) => {
          this.notificationService.addNotification(`Utente ${utenteId} assegnato come capo del reparto ${repartoId}.`);
          this.utenteIdCapoReparto = '';
          this.repartoIdCapoReparto = '';
        },
        error: (error) => {
          console.error('Errore nell\'assegnazione del capo reparto:', error);
          this.notificationService.addNotification(`Errore nell\'assegnazione del capo reparto: ${error.message}`);
        }
      });
    } else {
      this.notificationService.addNotification('Inserisci un ID utente e un ID reparto validi.');
    }
  }

}
