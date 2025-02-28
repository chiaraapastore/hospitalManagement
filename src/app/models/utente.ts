export interface Department {
  id: number;
  name: string;
  capoReparto: Utente
}

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
  reparto?: Department;
}
