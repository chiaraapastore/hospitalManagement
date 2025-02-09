export interface Medicinale {
  id: number;
  nome: string;
  scadenza: string;
  categoria: string;
  puntoRiordino: number;
  descrizione?: string;
  quantita: number;
  availableQuantity: number;
  departmentId?: number;
  magazineId?: number;
}
