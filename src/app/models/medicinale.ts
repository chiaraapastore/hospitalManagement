import {Utente} from './utente';

export interface Medicinale {
  id: number;
  nome: string;
  scadenza: string;
  categoria: string;
  puntoRiordino: number;
  descrizione?: string;
  quantita: number;
  availableQuantity: number;
  department?: Department;
  magazine?: Magazine;
}

export interface Department {
  id: number;
  nome: string;
  capoReparto: Utente;
}

export interface Magazine {
  id: number;
  nome: string;
}
