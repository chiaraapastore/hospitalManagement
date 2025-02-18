import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StatisticheService} from '../services/statistiche.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-dati-statistiche',
  templateUrl: './dati-statistiche.component.html',
  styleUrl: './dati-statistiche.component.css'
})
export class DatiStatisticheComponent implements OnInit {
  consumiNelTempo: any[] = [];
  riordiniStockout: any[] = [];
  distribuzionePerReparto: any[] = [];

  constructor(private http: HttpClient, private statisticheService: StatisticheService, private location: Location) {}

  ngOnInit() {
    this.statisticheService.getConsumiNelTempo().subscribe(data => {
      this.consumiNelTempo = [data];
    });

    this.statisticheService.getRiordiniStockout().subscribe(data => {
      this.riordiniStockout = [data.riordini, data.stockout];
    });

      this.statisticheService.getDistribuzionePerReparto().subscribe(data => {
        console.log("📊 Dati ricevuti dal backend:", data);

        if (Array.isArray(data) && data.length > 0) {
          this.distribuzionePerReparto = data.map(item => ({
            name: item.reparto,
            value: Number(item.consumo)
          }));
        } else {
          console.error("Nessun dato valido ricevuto per il grafico a torta!", data);
          this.distribuzionePerReparto = [];
        }

        console.log("Dati trasformati per ngx-charts:", this.distribuzionePerReparto);
      });
    }

  goBack() {
    this.location.back();
  }

}
