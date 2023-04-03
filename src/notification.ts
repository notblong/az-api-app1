export interface INotification {
  type: string;
  uuid: string;
  status: NotificationStatus
}

export enum NotificationStatus {
  notStart = 'notStart',
  processing = 'processing',
  done = 'done',
}