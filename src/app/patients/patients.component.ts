import { Component, OnInit } from '@angular/core';
import {Paziente} from '../models/paziente';
import {PazienteService} from '../services/paziente.service';
import {DoctorService} from '../services/doctor.service';
import {ToastrService} from 'ngx-toastr';
import {SomministraMedicinaDialogComponent} from '../somministra-medicina-dialog/somministra-medicina-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {Medicinale, MedicinaleService} from '../services/medicinale.service';



@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Paziente[] = [];
  medicinali: Medicinale[] = [];
  somministrazioni: any[] = [];



  constructor(private patientService: PazienteService, private doctorService: DoctorService,private toastr: ToastrService, public dialog: MatDialog, private location: Location, private medicinaleService: MedicinaleService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadMedicinali();
  }

  goBack(): void {
    this.location.back();
  }

  loadPatients(): void {
    this.patientService.getPatientsByDoctor().subscribe({
      next: (data: Paziente[]) => {
        console.log("Pazienti ricevuti:", data);


        this.patients = data.map(paziente => ({
          ...paziente,
          dataRicovero: new Date(paziente.dataRicovero)
        }));
      },
      error: (err: any) => console.error('Errore nel caricamento dei pazienti', err)
    });
  }




  loadMedicinali(): void {
    this.medicinaleService.getMedicinaliDisponibili().subscribe({
      next: (data: Medicinale[]) => {
        this.medicinali = data;
      },
      error: (err: any) => console.error('Errore nel caricamento dei medicinali', err)
    });
  }


  downloadMedicalRecord(pazienteId: number): void {
    this.patientService.downloadMedicalRecord(pazienteId).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
          this.toastr.error("Errore: il PDF è vuoto o non disponibile.", "Errore");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cartella_Clinica_${pazienteId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success("Cartella clinica scaricata con successo!", "Successo");
      },
      error: (err) => {
        this.toastr.error("Errore nel download della cartella clinica: " + err.message, "Errore");
      }
    });
  }

  /*somministraMedicina(pazienteId: number, quantita: number): void {
    console.log("Inizio somministrazione per paziente:", pazienteId, "Quantità:", quantita);

    this.patientService.getRepartoByPaziente(pazienteId).subscribe({
      next: (reparto) => {
        console.log("Reparto ricevuto:", reparto);

        const capoRepartoId = reparto.capoReparto.id;
        console.log("Apro il dialog di somministrazione...");

        const dialogRef = this.dialog.open(SomministraMedicinaDialogComponent, {
          width: '350px',
          data: { pazienteId, capoRepartoId, medicinali: this.medicinali }
        });

        dialogRef.afterClosed().subscribe(selectedMedicinale => {
          console.log("Dialog chiuso. Valore selezionato:", selectedMedicinale);

          if (!selectedMedicinale || !selectedMedicinale.nome) {
            console.warn("Nessun medicinale selezionato o valore non valido.");
            return;
          }

          const nomeMedicinale = selectedMedicinale.nome;
          const body = {
            pazienteId: pazienteId,
            capoRepartoId: capoRepartoId,
            nomeMedicinale: nomeMedicinale,
            quantita: quantita
          };

          console.log("Invio richiesta di somministrazione con body:", body);

          this.doctorService.somministraMedicine(body).subscribe({
            next: (response) => {
              console.log("Somministrazione avvenuta con successo!", response);
              this.toastr.success(response, "Somministrazione effettuata");
              this.loadPatients();
              this.loadSomministrazioni(pazienteId);
            },
            error: (err) => {
              console.error("Errore nella somministrazione", err);
              this.toastr.error("Errore nella somministrazione: " + err.message, "Errore");
            }
          });
        });
      },
      error: (err) => {
        this.toastr.error("Errore nel recupero del reparto: " + err.message, "Errore");
      }
    });
  }
*/

  somministraMedicina(pazienteId: number, quantita: number): void {
    this.patientService.getRepartoByPaziente(pazienteId).subscribe({
      next: (reparto) => {
        console.log("Reparto ricevuto:", reparto);
        const capoRepartoId = reparto.capoReparto.id;

        const dialogRef = this.dialog.open(SomministraMedicinaDialogComponent, {
          width: '350px',
          data: { pazienteId, medicinali: this.medicinali },
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(selectedMedicinale => {
          console.log(" Dialog chiuso. Valore ricevuto:", selectedMedicinale);

          if (!selectedMedicinale || !selectedMedicinale.nome) {
            console.warn(" Nessun medicinale selezionato o valore non valido.");
            return;
          }

          const nomeMedicinale = selectedMedicinale.nome;
          console.log("Nome Medicinale inviato:", nomeMedicinale);

          this.doctorService.somministraMedicine(pazienteId,capoRepartoId, nomeMedicinale, quantita).subscribe({
            next: (response) => {
              this.toastr.success(response, "Somministrazione effettuata");
              this.loadPatients();
            },
            error: (err) => {
              this.toastr.error("Errore nella somministrazione: " + err.message, "Errore");
            }
          });
        });
      },
      error: (err) => {
        this.toastr.error("Errore nel recupero del reparto: " + err.message, "Errore");
      }
    });
  }



  getQuantitaMedicina(): number {
    if (this.medicinali.length > 0) {
      return this.medicinali[0].quantita;
    }
    return 0;
  }
}
