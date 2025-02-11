import { Component, OnInit } from '@angular/core';
import { PazienteService } from '../services/paziente.service';
import { Paziente } from '../models/paziente';


@Component({
  selector: 'app-pazienti',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PazientiComponent implements OnInit {
  pazienti: Paziente[] = [];
  pazienteId: number | null = null;
  pazienteSelezionato: Paziente | null = null;
  nuovoPaziente: Paziente = {
    nome: '',
    cognome: '',
    eta: 0,
    diagnosi: '',
    email: ''
  };

  constructor(private pazienteService: PazienteService) {}

  ngOnInit(): void {}

  cercaPaziente(): void {
    if (this.pazienteId === null || isNaN(this.pazienteId)) {
      console.error("ID paziente non valido");
      return;
    }

    this.pazienteService.getPazienteById(this.pazienteId).subscribe({
      next: (paziente) => {
        this.pazienteSelezionato = paziente;
      },
      error: (error) => {
        console.error('Errore nel recupero del paziente:', error);
      }
    });
  }

  salvaPaziente(): void {
    this.pazienteService.savePaziente(this.nuovoPaziente).subscribe({
      next: (paziente) => {
        console.log('Paziente salvato con successo:', paziente);
        this.pazienti.push(paziente);
        this.resettaFormPaziente();
      },
      error: (error) => {
        console.error('Errore nel salvataggio del paziente:', error);
      }
    });
  }

  cancellaPaziente(id: number): void {
    this.pazienteService.deletePaziente(id).subscribe({
      next: () => {
        console.log('Paziente cancellato con successo');
        this.pazienti = this.pazienti.filter(p => p.id !== id);
        this.pazienteSelezionato = null;
      },
      error: (error) => {
        console.error('Errore nella cancellazione del paziente:', error);
      }
    });
  }

  resettaFormPaziente(): void {
    this.nuovoPaziente = {
      nome: '',
      cognome: '',
      eta: 0,
      diagnosi: '',
      email: ''
    };
  }
}
