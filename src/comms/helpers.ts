import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Cat, CommsErrorCode, CommsErrorResponse, PouchSize } from '../types';

export const POUCH_PRICES: Record<PouchSize, number> = {
  A: 55.5,
  B: 59.5,
  C: 62.75,
  D: 66.0,
  E: 69.0,
  F: 71.25,
};

export const FREE_GIFT_THRESHOLD = 120;

export function calculateTotalPrice(activeCats: Cat[]): number {
  return activeCats.reduce(
    (total, cat) => total + POUCH_PRICES[cat.pouchSize],
    0,
  );
}

export function formatNames(names: string[]): string {
  if (names.length <= 1) {
    return names[0] ?? '';
  }
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function commsNotFound(
  code: CommsErrorCode,
  message: string,
): NotFoundException {
  const body: CommsErrorResponse = {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    code,
    message,
  };
  return new NotFoundException(body);
}
