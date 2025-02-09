export interface Utente {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  countNotification: number;
  keycloakId: string;
  repartoId?: number;
}
