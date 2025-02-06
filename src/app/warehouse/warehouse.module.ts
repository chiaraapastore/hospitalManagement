import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicinesComponent } from './medicines.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MedicinesComponent],
  imports: [CommonModule, RouterModule]
})
export class WarehouseModule {}
