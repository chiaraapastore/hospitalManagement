export interface Paziente {
  id: number;
  nome: string;
  cognome: string;
  eta: number;
  diagnosi: string;
  email: string;
  repartoId?: number;
}
