import { Component, OnInit } from '@angular/core';
import { WarehouseService, Medicine } from '../services/warehouse.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  standalone: true,
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  medicines: Medicine[] = [];

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.warehouseService.getMedicines().subscribe(data => {
      this.medicines = data;
    });
  }

  updateStock(medicineId: number, quantity: number) {
    this.warehouseService.updateStock(medicineId, quantity).subscribe(() => {
      this.loadMedicines();
    });
  }
}
