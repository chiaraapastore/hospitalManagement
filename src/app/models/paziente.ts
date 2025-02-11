export interface Paziente {
  id?: number;
  nome: string;
  cognome: string;
  eta: number;
  diagnosi: string;
  email: string;
  reparto?: Department;
}

export interface Department {
  id?: number;
  nome: string;
}
