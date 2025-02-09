export interface Notification {
  id: number;
  messaggio: string;
  letta: boolean;
  dataOra: string;
  type: string;
  readNotification?: string;
  senderId: number;
  receiverId: number;
}
