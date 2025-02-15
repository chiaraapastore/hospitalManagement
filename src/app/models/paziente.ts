export interface Paziente {
  id: number;
  nome: string;
  cognome: string;
  eta: number;
  diagnosi: string;
  email: string;
  reparto?: Department;
  dimesso:boolean;
  dataRicovero: string | Date;
}

export interface Department {
  id?: number;
  nome: string;
}
