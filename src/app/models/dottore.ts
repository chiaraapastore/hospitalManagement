export interface Dottore {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specializzazione: string;
  coordinatore: boolean;
  ferie: boolean;
  turno?: string;
  repartoId: number;
  matricola: string;
  showTurno?: boolean;
  showFerie?: boolean;
  showReparto?: boolean;
  showTurnoTable?: boolean;
  isCapoReparto: boolean;
}
