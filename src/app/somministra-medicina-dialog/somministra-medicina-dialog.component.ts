import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medicinale } from '../models/medicinale';

@Component({
  selector: 'app-somministra-medicina-dialog',
  templateUrl: './somministra-medicina-dialog.component.html',
  styleUrls: ['./somministra-medicina-dialog.component.css']
})
export class SomministraMedicinaDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedMedicinale: Medicinale | null = null;
  quantita: number = 1;
  private previousAriaHidden: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<SomministraMedicinaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pazienteId: number; medicinali: Medicinale[] }
  ) {}

  ngOnInit(): void {
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      this.previousAriaHidden = appRoot.getAttribute('aria-hidden');
      appRoot.removeAttribute('aria-hidden');
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dialogRef.updateSize();
      document.querySelector('mat-dialog-container')?.setAttribute('aria-hidden', 'false');
      const dialogElement = document.querySelector('mat-dialog-container');
      if (dialogElement) {
        (dialogElement as HTMLElement).focus();
      }
    }, 200);
  }

  ngOnDestroy(): void {
    const appRoot = document.querySelector('app-root');
    if (appRoot && this.previousAriaHidden !== null) {
      appRoot.setAttribute('aria-hidden', this.previousAriaHidden);
    }
  }

  getMaxQuantity(): number {
    return this.selectedMedicinale ? this.selectedMedicinale.quantita : 1;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (!this.selectedMedicinale) return;
    this.dialogRef.close({
      medicinaleNome: this.selectedMedicinale.nome,
      quantita: this.quantita
    });
  }
}
