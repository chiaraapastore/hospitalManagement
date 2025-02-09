import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../services/patients.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  standalone: true,
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];

  constructor(private patientsService: PatientsService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientsService.getPatients().subscribe(data => {
      this.patients = data;
    });
  }

  assignToDepartment(patientId: number, departmentId: number) {
    this.patientsService.assignPatientToDepartment(patientId, departmentId).subscribe(() => {
      this.loadPatients();
    });
  }
}
