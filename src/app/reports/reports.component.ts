import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  medicineReport: any[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportsService.getMedicineConsumptionReport().subscribe(data => {
      this.medicineReport = data;
    });
  }
}
