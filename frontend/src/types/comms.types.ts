export interface NextDeliveryComms {
  title: string;
  message: string;
  totalPrice: number;
  freeGift: boolean;
}

export type CommsErrorCode = 'USER_NOT_FOUND' | 'NO_ACTIVE_SUBSCRIPTIONS';

export interface CommsErrorResponse {
  statusCode: number;
  error: string;
  code: CommsErrorCode;
  message: string;
}
