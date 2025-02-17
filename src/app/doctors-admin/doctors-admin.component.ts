import {Component, OnInit} from '@angular/core';
import {Dottore} from '../models/dottore';
import {HeadOfDepartmentService} from '../services/head-of-department.service';
import {DoctorService} from '../services/doctor.service';
import {Location} from '@angular/common';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-doctors-admin',
  templateUrl: './doctors-admin.component.html',
  styleUrl: './doctors-admin.component.css'
})
export class DoctorsAdminComponent implements OnInit{
  dottori: any[] = [];
  capoReparti: any[] = [];
  reparti: any[] = [];
  selectedRepartoId!: number;
  nuovoReparto: string = '';
  nuovoDottoreNome: string = '';
  nuovoDottoreCognome: string = '';
  nuovoDottoreEmail: string = '';
  nuovoCapoRepartoNome: string = '';
  nuovoCapoRepartoCognome: string = '';
  nuovoCapoRepartoEmail: string = '';
  nuovoDottoreRepartoNome: string = '';
  nuovoCapoRepartoNomeReparto: string = '';

  turni: string[] = ['Mattina', 'Pomeriggio', 'Notte', 'Monto', 'Smonto'];
  giorniSettimana: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  turniAssegnati: { [key: number]: { [giorno: string]: string } } = {};


  constructor(private adminService: AdminService, private location: Location, private headOfDepartmentService: HeadOfDepartmentService, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.caricaDati();
    this.loadCapoReparto();
    this.caricaReparti();
    this.loadDottori();

  }

  caricaDati() {
    this.adminService.getDottori().subscribe(data => this.dottori = data);
    this.adminService.getCapoReparti().subscribe((data: any[]) => this.capoReparti = data);
    this.adminService.getReparti().subscribe(data => this.reparti = data);
  }

  caricaReparti() {
    this.headOfDepartmentService.getReparti().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  aggiungiDottore() {
    if (!this.nuovoDottoreNome || !this.nuovoDottoreCognome || !this.nuovoDottoreEmail || !this.nuovoDottoreRepartoNome) {
      console.error("Tutti i campi sono obbligatori, incluso il reparto.");
      return;
    }

    const nuovoDottore = {
      firstName: this.nuovoDottoreNome,
      lastName: this.nuovoDottoreCognome,
      email: this.nuovoDottoreEmail,
      repartoNome: this.nuovoDottoreRepartoNome
    };

    this.adminService.creaDottore(nuovoDottore).subscribe({
      next: () => {
        console.log("Dottore aggiunto con successo!");
        this.caricaDati();
      },
      error: err => console.error("Errore nell'aggiunta del dottore", err)
    });
  }


  aggiungiReparto() {
    this.adminService.creaReparto(this.nuovoReparto).subscribe();
  }

  aggiungiCapoReparto() {
    if (!this.nuovoCapoRepartoNome || !this.nuovoCapoRepartoCognome || !this.nuovoCapoRepartoEmail || !this.nuovoCapoRepartoNomeReparto) {
      console.error("Tutti i campi sono obbligatori, incluso il reparto.");
      return;
    }

    const nuovoCapo = {
      firstName: this.nuovoCapoRepartoNome,
      lastName: this.nuovoCapoRepartoCognome,
      email: this.nuovoCapoRepartoEmail,
      repartoNome: this.nuovoCapoRepartoNomeReparto
    };

    this.adminService.creaCapoReparto(nuovoCapo).subscribe({
      next: () => {
        console.log("Capo reparto aggiunto con successo!");
        this.caricaDati();
      },
      error: err => console.error("Errore nell'aggiunta del capo reparto", err)
    });
  }


  aggiungiDottoreAReparto(dottoreId: number, event: Event) {
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

    console.log(`Assegnazione del dottore con ID: ${dottoreId} al reparto ${repartoIdNumber}`);

    this.adminService.aggiungiDottoreAReparto(dottoreId, repartoIdNumber).subscribe({
      next: (message: string) => {
        console.log(message);
        this.loadDottori();
      },
      error: (err: any) => console.error("Errore nell'assegnazione del dottore al reparto", err)
    });
  }

  assegnaCapoReparto(capoRepartoId: number, event: Event) {
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

    console.log(`Assegnazione del capo reparto con ID: ${capoRepartoId} al reparto ${repartoIdNumber}`);

    this.adminService.assegnaCapoReparto(capoRepartoId, repartoIdNumber).subscribe({
      next: (message: string) => {
        console.log(message);
        this.loadCapoReparto();
      },
      error: (err: any) => console.error("Errore nell'assegnazione del capo reparto", err)
    });
  }




  goBack(): void {
    this.location.back();
  }

  loadDottori(): void {
    this.adminService.getDottori().subscribe({
      next: (data: any[]) => {
        console.log("Tutti i dottori ricevuti:", data);
        this.dottori = data.map(dottore => ({
          ...dottore,
          reparto: dottore.repartoNome || 'Nessun reparto'
        }));
      },
      error: (err: any) => console.error('Errore nel caricamento dei dottori', err)
    });
  }

  loadCapoReparto(): void {
    this.adminService.getCapoReparti().subscribe({
      next: (data: any[]) => {
        console.log("Dati ricevuti dal backend per capi reparto:", data);
        this.capoReparti = data.map(capo => ({
          ...capo,
          reparto: capo.repartoNome || "Nessun reparto"
        }));
      },
      error: (err: any) => console.error("Errore nel caricamento dei capi reparto", err)
    });
  }



  cambiaRepartoCapoReparto(capoRepartoId: number, event: Event) {
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

    console.log(`Cambio reparto del capoReparto con ID: ${capoRepartoId} al reparto ${repartoIdNumber}`);
    this.headOfDepartmentService.getReparti().subscribe({
      next: (data: any[]) => {
        console.log("Reparti caricati:", data);
        this.reparti = data;
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
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

  assegnaTurno(capoRepartoId: number, giorno: string, turno: string) {
    if (!this.turniAssegnati[capoRepartoId]) {
      this.turniAssegnati[capoRepartoId] = {};
    }


    if (this.turniAssegnati[capoRepartoId][giorno] === turno) {
      delete this.turniAssegnati[capoRepartoId][giorno];
    } else {
      this.turniAssegnati[capoRepartoId][giorno] = turno;
    }

    console.log(`Turni assegnati:`, this.turniAssegnati);
  }

  getTurnoColor(capoRepartoId: number, giorno: string, turno: string): string {
    return this.turniAssegnati[capoRepartoId]?.[giorno] === turno ? this.getTurnoCssClass(turno) : 'transparent';
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
