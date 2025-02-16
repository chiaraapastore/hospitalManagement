import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeadOfDepartmentService } from '../services/head-of-department.service';
import { DoctorService } from '../services/doctor.service';
import { Dottore } from '../models/dottore';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  dottori: Dottore[] = [];
  reparti: any[] = [];
  ferieDisponibili: string[] = [];
  selectedRepartoId!: number;
  turni: string[] = ['Mattina', 'Pomeriggio', 'Notte', 'Monto', 'Smonto'];
  giorniSettimana: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  turniAssegnati: { [key: number]: { [giorno: string]: string } } = {};
  constructor(
    private headOfDepartmentService: HeadOfDepartmentService,
    private doctorService: DoctorService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getRepartoCapoReparto();
    this.caricaReparti();
    this.caricaFerieDisponibili();
  }

  caricaReparti() {
    this.headOfDepartmentService.getReparti().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  caricaFerieDisponibili() {
    this.headOfDepartmentService.getFerieDisponibili().subscribe({
      next: (ferie: string[]) => {
        this.ferieDisponibili = ferie;
      },
      error: (err: any) => console.error("Errore nel caricamento delle ferie", err)
    });
  }


  getRepartoCapoReparto() {
    this.headOfDepartmentService.getUserInfo().subscribe({
      next: (utente: any) => {
        if (!utente || !utente.repartoId) {
          console.error("Errore: Reparto ID non trovato per l'utente!");
          return;
        }
        this.selectedRepartoId = utente.repartoId;
        console.log("Reparto selezionato:", this.selectedRepartoId);
        this.loadDottori();
      },
      error: (err: any) => console.error("Errore nel recupero utente", err)
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadDottori(): void {
    this.doctorService.getDottoriByReparto(this.selectedRepartoId).subscribe({
      next: (data: Dottore[]) => {
        console.log("Dottori ricevuti:", data);

        this.headOfDepartmentService.getUserInfo().subscribe({
          next: (utente: any) => {
            const capoRepartoEmail = utente.email;
            this.dottori = data.filter(dottore => dottore.email !== capoRepartoEmail);
          },
          error: (err: any) => console.error("Errore nel recupero dell'utente", err)
        });
      },
      error: (err: any) => console.error('Errore nel caricamento dei dottori', err)
    });
  }

  cambiaRepartoDottore(doctorId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const repartoId = selectElement?.value || '';

    if (!repartoId) {
      console.error("Nessun reparto selezionato!");
      return;
    }

    const repartoIdNumber = parseInt(repartoId, 10);
    if (isNaN(repartoIdNumber)) {
      console.error("Errore: ID reparto non valido");
      return;
    }

    console.log(`Cambio reparto del dottore con ID: ${doctorId} al reparto ${repartoIdNumber}`);
    this.headOfDepartmentService.getReparti().subscribe({
      next: (data: any[]) => {
        console.log("Reparti caricati:", data);
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  assegnaFerie(doctorId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const dataFerie = selectElement?.value || '';

    if (!dataFerie) {
      console.error("Nessuna data ferie selezionata!");
      return;
    }

    console.log(`Assegnazione ferie al dottore con ID: ${doctorId} per il giorno ${dataFerie}`);
    this.headOfDepartmentService.assegnaFerie(doctorId, dataFerie).subscribe(() => {
      console.log("Ferie assegnate con successo");
    });
  }

  toggleTurnoTable(doctorId: number) {
    this.dottori.forEach(dottore => {
      if (dottore.id === doctorId) {
        dottore.showTurnoTable = !dottore.showTurnoTable;
      } else {
        dottore.showTurnoTable = false;
      }
    });
  }

  assegnaTurno(doctorId: number, giorno: string, turno: string) {
    if (!this.turniAssegnati[doctorId]) {
      this.turniAssegnati[doctorId] = {};
    }


    if (this.turniAssegnati[doctorId][giorno] === turno) {
      delete this.turniAssegnati[doctorId][giorno];
    } else {
      this.turniAssegnati[doctorId][giorno] = turno;
    }

    console.log(`Turni assegnati:`, this.turniAssegnati);
  }

  getTurnoColor(doctorId: number, giorno: string, turno: string): string {
    return this.turniAssegnati[doctorId]?.[giorno] === turno ? this.getTurnoCssClass(turno) : 'transparent';
  }

  getTurnoCssClass(turno: string): string {
    const colors: { [key: string]: string } = {
      'Mattina': '#ffeb3b',
      'Pomeriggio': '#ff9800',
      'Notte': '#3f51b5',
      'Monto': '#26a69a',
      'Smonto': '#9e9e9e'
    };
    return colors[turno] || 'white';
  }

}
