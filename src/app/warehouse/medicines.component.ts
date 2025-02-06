import { Component, OnInit } from '@angular/core';
import { MedicinesService } from '../services/medicines.service';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss']
})
export class MedicinesComponent implements OnInit {
  medicines: any[] = [];

  constructor(private medicinesService: MedicinesService) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.medicinesService.getMedicines().subscribe(data => {
      this.medicines = data;
    });
  }

  updateMedicine(id: number) {
    const newQuantity = prompt('Inserisci nuova quantità:');
    if (newQuantity !== null) {
      const quantityNumber = Number(newQuantity);
      if (!isNaN(quantityNumber) && quantityNumber >= 0) {
        this.medicinesService.updateMedicine(id, quantityNumber).subscribe(() => {
          this.loadMedicines();
        });
      } else {
        alert("Inserisci un numero valido!");
      }
    }
  }

  deleteMedicine(id: number) {
    if (confirm("Sei sicuro di voler eliminare questo medicinale?")) {
      this.medicinesService.deleteMedicine(id).subscribe(() => {
        this.loadMedicines();
      });
    }
  }

  openAddModal() {
    const nome = prompt("Nome del medicinale:");
    const quantita = prompt("Quantità:");
    const scadenza = prompt("Scadenza (YYYY-MM-DD):");

    if (nome && quantita && scadenza) {
      const newMedicine = { nome, quantita: Number(quantita), scadenza };
      this.medicinesService.addMedicine(newMedicine).subscribe(() => {
        this.loadMedicines();
      });
    }
  }
}
