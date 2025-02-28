import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Medicinale} from '../models/medicinale';
import {MedicinaleService} from '../services/medicinale.service';
import {ToastrService} from 'ngx-toastr';
import {NotificationService} from '../services/notification.service';
import {Location} from '@angular/common';
import {DoctorService} from '../services/doctor.service';
import {AuthenticationService} from '../auth/authenticationService';
import {Department} from '../models/utente';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent implements OnInit {

  medicinali: Medicinale[] = [];
  filteredMedicinali: Medicinale[] = [];
  categorie: string[] = ['Tutti', 'Farmaci scaduti'];
  selectedCategory: string = 'Tutti';
  searchKeyword: string = '';
  selectedSort: string = 'default';
  sizeMedicinale: string = '';
  page: number = 1;
  pageSize: number = 5;
  tableSize: number[] = [5, 10, 20];
  @Inject(PLATFORM_ID) private platformId: Object
  ;

  constructor(private auth:AuthenticationService, private medicinaleService: MedicinaleService,private doctorService: DoctorService, private toastr: ToastrService,private location: Location, private notificationService: NotificationService, @Inject(PLATFORM_ID) platformId: Object
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

  async farmaciScaduti(): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    const username = user?.username || 'Email non disponibile';
    this.doctorService.getRepartoByEmailDottore(username).subscribe({
      next: (reparto) => {
        const capoReparto = reparto.capoReparto.id;

        const farmaciScaduti = this.medicinali.filter(m => this.isExpired(m.scadenza));


        if (farmaciScaduti.length === 0) {
          this.toastr.info("Nessun farmaco scaduto da segnalare", "Info");
          return;
        }

        farmaciScaduti.forEach(farmaco => {
          this.doctorService.scadenzaFarmaco(capoReparto, farmaco.id).subscribe({
            next: () => {
              this.toastr.success(`Segnalazione inviata per ${farmaco.nome}`, "Successo");
            },
            error: (err) => {
              this.toastr.error(`Errore nella segnalazione di ${farmaco.nome}: ${err.message}`, "Errore");
            }
          });
        });
      }
    });
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


}
