import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Department, Magazine, Medicinale} from '../models/medicinale';
import {MedicinaleService} from '../services/medicinale.service';
import {ToastrService} from 'ngx-toastr';
import {NotificationService} from '../services/notification.service';
import {Location} from '@angular/common';
import {HeadOfDepartmentService} from '../services/head-of-department.service';


@Component({
  selector: 'app-warehouse-head-of-department',
  templateUrl: './warehouse-head-of-department.component.html',
  styleUrl: './warehouse-head-of-department.component.css'
})
export class WarehouseHeadOfDepartmentComponent implements OnInit{

  medicinali: Medicinale[] = [];
  filteredMedicinali: Medicinale[] = [];
  showStockModal: boolean = false;
  magazine = { id: 1, stockDisponibile: 0, capienzaMassima: 0 };
  categorie: string[] = ['Tutti', 'Farmaci scaduti'];
  selectedCategory: string = 'Tutti';
  selectedRepartoId!: number;
  searchKeyword: string = '';
  selectedSort: string = 'default';
  showAddForm = false;
  sizeMedicinale: string = '';
  page: number = 1;
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];
  newMedicinale: Medicinale = {
    puntoRiordino: 0,
    id: 0,
    nome: '',
    availableQuantity: 0,
    scadenza: '',
    categoria: '',
    quantita: 1,
    descrizione: ''
  };

  @Inject(PLATFORM_ID) private platformId: Object
  ;

  constructor(private medicinaleService: MedicinaleService, private headOfDepartmentService: HeadOfDepartmentService, private toastr: ToastrService,private location: Location, private notificationService: NotificationService, @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    this.loadMedicinali();
  }

  loadMedicinali(): void {
    this.medicinaleService.getMedicinaliDisponibili().subscribe({
      next: (response: any) => {
        if (!Array.isArray(response)) {
          console.error("Errore: la risposta non è un array", response);
          return;
        }

        this.medicinali = response.map((m: any) => ({
          id: m.id,
          nome: m.nome,
          quantita: m.quantita,
          scadenza: m.scadenza || '',
          categoria: m.categoria || 'Sconosciuto',
          puntoRiordino: m.puntoRiordino ?? 0,
          availableQuantity: m.availableQuantity ?? m.quantita
        }));
        this.applyFilters();
      },
      error: (err) => {
        console.error("Errore nel caricamento dei medicinali:", err);
      }
    });
  }

  toggleForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  applyFilters(): void {
    this.filteredMedicinali = this.medicinali.filter(m => {
      const matchCategory = this.selectedCategory === 'Tutti' ||
        (this.selectedCategory === 'Farmaci scaduti' && this.isExpired(m.scadenza)) ||
        (m.categoria === this.selectedCategory);
      const matchSearch = this.searchKeyword === '' || m.nome.toLowerCase().includes(this.searchKeyword.toLowerCase());
      return matchCategory && matchSearch;
    });
    if (this.selectedSort === 'scadenzaAsc') {
      this.filteredMedicinali.sort((a, b) => new Date(a.scadenza).getTime() - new Date(b.scadenza).getTime());
    } else if (this.selectedSort === 'scadenzaDesc') {
      this.filteredMedicinali.sort((a, b) => new Date(b.scadenza).getTime() - new Date(a.scadenza).getTime());
    }
    this.page = 1;
  }

  getMedicinaliForPage(): Medicinale[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredMedicinali.slice(startIndex, endIndex);
  }


  aggiungiFarmaco(): void {
    if (!this.newMedicinale.nome || this.newMedicinale.quantita <=0) {
      this.toastr.error('Inserisci un nome valido e una quantità maggiore di 0.', 'Errore');
      return;
    }

    const farmacoDaAggiungere = {
      nome: this.newMedicinale.nome,
      quantita: this.newMedicinale.quantita,
      scadenza: this.newMedicinale.scadenza || '',
      categoria: this.newMedicinale.categoria || 'Generico',
      repartoId: this.selectedRepartoId
    };

    this.headOfDepartmentService.aggiungiFarmaco(farmacoDaAggiungere).subscribe({
      next: () => {
        this.toastr.success('Farmaco aggiunto con successo!', 'Successo');
        this.loadMedicinali();
      },
      error: (err: any) => console.error('Errore nell\'aggiunta del farmaco', err)
    });
  }


  goBack(): void {
    this.location.back();
  }

  searchMedicinali(): void {
    this.applyFilters();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }


  isExpired(scadenza: string): boolean {
    return new Date(scadenza) < new Date();
  }

  countByCategory(category: string): number {
    if (category === 'Tutti') {
      return this.medicinali.length;
    }
    if (category === 'Farmaci scaduti') {
      return this.medicinali.filter(m => this.isExpired(m.scadenza)).length;
    }
    return this.medicinali.filter(m => m.categoria === category).length;
  }

  notifyExpiredMedicines(): void {
    let expiredMedicines = this.medicinali.filter(m => this.isExpired(m.scadenza));

    if (expiredMedicines.length === 0) {
      this.toastr.info('Nessun farmaco scaduto da segnalare.');
      return;
    }

    let report = 'Segnalazione Farmaci Scaduti\n\n';
    expiredMedicines.forEach(m => {
      report += `- ${m.nome} (Scaduto il ${m.scadenza})\n`;
    });

    this.notificationService.sendNotification({
      destinatario: 'admin',
      messaggio: report
    }).subscribe(() => {
      this.toastr.success('Notifica inviata all\'admin.');
    }, (error: any) => {
      console.error('Errore nell\'invio della notifica:', error);
      this.toastr.error('Errore durante l\'invio della segnalazione.');
    });
  }



  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  goToNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMedicinali.length / this.pageSize) || 1;
  }


  editMedicinale(medicinale: Medicinale) {
    this.newMedicinale = { ...medicinale };
  }

  updateMedicinaleQuantity(medicinale: Medicinale): void {
    this.medicinaleService.updateAvailableQuantity(medicinale.id, medicinale.availableQuantity).subscribe({
      next: (updatedMedicinale) => {
        console.log("Risposta ricevuta dal server:", updatedMedicinale);

        if (!updatedMedicinale) {
          console.error("Errore: risposta vuota dal backend");
          return;
        }

        let index = this.medicinali.findIndex(m => m.id === medicinale.id);
        if (index !== -1) {
          this.medicinali[index].availableQuantity = updatedMedicinale.availableQuantity;
        }

        this.toastr.success('Quantità disponibile aggiornata con successo');

        this.loadMedicinali();
      },
      error: (err) => {
        console.error("Errore durante l'aggiornamento della quantità disponibile:", err);
        this.toastr.error("Errore durante l'aggiornamento.", "Errore");
      }
    });
  }


  deleteMedicinale(medicinale: Medicinale): void {
    if (!medicinale.id) {
      console.error("Errore: ID farmaco non valido.");
      return;
    }

    if (this.isExpired(medicinale.scadenza)) {
      console.log(`Eliminazione automatica: ${medicinale.nome} è scaduto.`);
    } else {
      if (!confirm(`Sei sicuro di voler eliminare il farmaco ${medicinale.nome}?`)) {
        return;
      }
    }

    this.medicinaleService.deleteMedicinale(medicinale.id).subscribe({
      next: () => {
        this.toastr.success(`Farmaco ${medicinale.nome} eliminato con successo.`);
        this.loadMedicinali();
      },
      error: (err: any) => {
        console.error("Errore durante l'eliminazione del farmaco:", err);
        this.toastr.error("Errore durante l'eliminazione del farmaco.", "Errore");
      }
    });
  }

  openStockUpdateModal(): void {
    this.showStockModal = true;
  }

  updateStockAndSendReport(): void {
    console.log("Bottone premuto: aggiornamento stock e invio report in corso...");

    this.medicinaleService.updateStockAndSendReport(this.magazine).subscribe({
      next: () => {
        this.toastr.success("Stock aggiornato e report inviato all'admin!");
        console.log("Richiesta completata con successo!");
      },
      error: (err) => {
        console.error("Errore nell'aggiornamento dello stock e nell'invio del report:", err);
        this.toastr.error("Errore durante l'aggiornamento dello stock.");
      }
    });
  }



}
