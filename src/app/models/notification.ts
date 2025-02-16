export interface Notification {
  id: number;
  messaggio: string;
  letta: boolean;
  dataOra: string;
  type: string;
  readNotification?: string;
  destinatario: string;
  recipient: string;
  senderId: number;
  receiverId: number;
}
