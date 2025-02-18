import {Component, OnInit} from '@angular/core';
import {HeadOfDepartmentService} from '../services/head-of-department.service';
import {Location} from '@angular/common';
import {AdminService} from '../services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-doctors-admin',
  templateUrl: './doctors-admin.component.html',
  styleUrl: './doctors-admin.component.css'
})
export class DoctorsAdminComponent implements OnInit{
  dottori: any[] = [];
  capoReparti: any[] = [];
  reparti: any[] = [];
  nuovoRepartoId!: number;
  selectedRepartoId!: number;  // Dichiarazione della variabile
  nuovoReparto: string = '';
  nuovoDottoreNome: string = '';
  nuovoDottoreCognome: string = '';
  nuovoDottoreEmail: string = '';
  nuovoCapoRepartoNome: string = '';
  nuovoCapoRepartoCognome: string = '';
  nuovoCapoRepartoEmail: string = '';
  nuovoDottoreRepartoNome: string = '';
  nuovoCapoRepartoNomeReparto: string = '';
  apiUrl = 'http://localhost:8081/api/admin';

  turni: string[] = ['Mattina', 'Pomeriggio', 'Notte', 'Monto', 'Smonto'];
  giorniSettimana: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  turniAssegnati: { [key: number]: { [giorno: string]: string } } = {};


  constructor(private adminService: AdminService,private http: HttpClient, private location: Location, private headOfDepartmentService: HeadOfDepartmentService, private toastr: ToastrService) {}

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

    console.log(" Valore di this.nuovoDottoreRepartoNome:", this.nuovoDottoreRepartoNome);

    const nuovoDottore = {
      firstName: this.nuovoDottoreNome,
      lastName: this.nuovoDottoreCognome,
      email: this.nuovoDottoreEmail,
      repartoNome: this.nuovoDottoreRepartoNome
    };

    console.log("Inviando il nuovo dottore al backend:", nuovoDottore);

    this.adminService.creaDottore(nuovoDottore).subscribe({
      next: (response: any) => {
        console.log("Risposta dal backend:", response);

        const messaggio = typeof response === 'string' ? response : response.message;

        this.toastr.success(messaggio || "Dottore aggiunto con successo!");
        this.caricaDati();
      },
      error: err => {
        console.error("Errore nell'aggiunta del dottore", err);
        this.toastr.error("Errore nell'aggiunta del dottore.");
      }
    });

  }


  aggiungiReparto() {
    if (!this.nuovoReparto.trim()) {
      this.toastr.error("Il nome del reparto è obbligatorio!");
      return;
    }

    this.adminService.aggiungiReparto(this.nuovoReparto).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || "Reparto aggiunto con successo!");
        this.loadReparti();
        this.nuovoReparto = "";
      },
      error: () => {
      }
    });
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

    console.log("🚀 Inviando capo reparto:", nuovoCapo);

    this.adminService.creaCapoReparto(nuovoCapo).subscribe({
      next: (response: any) => {
        console.log("Risposta dal backend:", response);

        const messaggio = typeof response === 'string' ? response : response.message;

        this.toastr.success(messaggio || "Capo Reparto aggiunto con successo!");
        this.caricaDati();
      },
      error: err => {
        console.error("Errore nell'aggiunta del capo reparto", err);
        this.toastr.error("Errore nell'aggiunta del capo reparto.");
      }
    });
  }



  aggiungiDottoreAReparto(dottoreId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const repartoId = parseInt(selectElement.value, 10);

    if (isNaN(repartoId)) {
      console.error("Errore: Nessun reparto selezionato o ID non valido!");
      return;
    }

    const repartoSelezionato = this.reparti.find(rep => rep.id === repartoId);
    const repartoNome = repartoSelezionato ? repartoSelezionato.nome : "Reparto sconosciuto";

    console.log(`Assegnazione del dottore con ID: ${dottoreId} al reparto ${repartoNome} (ID: ${repartoId})`);

    this.adminService.aggiungiDottoreAReparto(dottoreId, repartoId).subscribe({
      next: (message: string) => {
        console.log("Risposta del backend:", message);
        this.loadDottori();
      },
      error: (err: any) => console.error("Errore nell'assegnazione del dottore al reparto", err)
    });
  }



  assegnaCapoReparto(capoRepartoId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const repartoId = selectElement?.value ? parseInt(selectElement.value, 10) : NaN;

    if (isNaN(repartoId)) {
      console.error("Errore: ID reparto non valido o non selezionato!");
      this.toastr.error("Errore: Seleziona un reparto valido!");
      return;
    }

    console.log(`Assegnazione del capo reparto con ID: ${capoRepartoId} al reparto ${repartoId}`);

    this.adminService.assegnaCapoReparto(capoRepartoId, repartoId).subscribe({
      next: (message: string) => {
        console.log("Risposta backend:", message);
        this.toastr.success("Capo reparto assegnato con successo!");

        this.capoReparti.forEach(capo => {
          if (capo.id === capoRepartoId) {
            capo.repartoNome = this.reparti.find(r => r.id === repartoId)?.nome || 'Sconosciuto';
          }
        });

        this.loadCapoReparto();
      },
      error: (err: any) => {
        console.error(" Errore nell'assegnazione del capo reparto:", err);
        this.toastr.error("Errore nell'assegnazione del capo reparto.");
      }
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


  cambiaReparto(utenteId: number, repartoId: number): void {
    if (!repartoId || isNaN(repartoId)) {
      this.toastr.error('Errore: Seleziona un reparto valido.');
      return;
    }

    console.log(`Invio richiesta per cambiare reparto dell'utente ${utenteId} → Reparto ${repartoId}`);

    this.adminService.assegnaCapoReparto(utenteId, repartoId)
      .subscribe({
        next: () => {
          this.toastr.success('Reparto aggiornato con successo!');

          const dottore = this.dottori.find(d => d.id === utenteId);
          if (dottore) {
            dottore.repartoNome = this.reparti.find(r => r.id === repartoId)?.nome || 'Sconosciuto';
          }

          console.log("Dottore aggiornato in frontend:", this.dottori);

          this.loadDottori();
        },
        error: (error: any) => {
          console.error(" Errore aggiornando il reparto:", error);
          this.toastr.error('Errore nell\'aggiornamento del reparto.');
        }
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

  loadReparti() {
    this.adminService.getReparti().subscribe({
      next: (data: any[]) => {
        this.reparti = data;
        console.log("Lista reparti aggiornata:", this.reparti);
      },
      error: (err: any) => console.error("Errore nel caricamento dei reparti", err)
    });
  }

  protected readonly parseInt = parseInt;
}
