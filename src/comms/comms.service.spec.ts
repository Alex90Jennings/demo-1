import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { fixtureUsersService } from '../../test/fixtures/users';
import { CommsErrorResponse } from '../types';
import { UsersService } from '../users/users.service';
import { CommsService } from './comms.service';
import { formatNames } from './helpers';

function errorResponse(fn: () => unknown): CommsErrorResponse {
  try {
    fn();
  } catch (err) {
    expect(err).toBeInstanceOf(NotFoundException);
    return (err as NotFoundException).getResponse() as CommsErrorResponse;
  }
  throw new Error('Expected function to throw');
}

describe('CommsService', () => {
  let service: CommsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommsService,
        { provide: UsersService, useValue: fixtureUsersService },
      ],
    }).compile();

    service = moduleRef.get(CommsService);
  });

  it('builds the comms from active cats only', () => {
    expect(service.getNextDelivery('multi-cat-user')).toEqual({
      title: 'Your next delivery for Tom and Kit',
      message:
        "Hey Alice! In two days' time, we'll be charging you for your next order for Tom and Kit's fresh food.",
      totalPrice: 134,
      freeGift: true,
    });
  });

  it('gives no free gift at or below the threshold', () => {
    const result = service.getNextDelivery('single-cat-user');
    expect(result.totalPrice).toBe(69);
    expect(result.freeGift).toBe(false);
  });

  it('throws USER_NOT_FOUND for an unknown user', () => {
    expect(
      errorResponse(() => service.getNextDelivery('does-not-exist')),
    ).toMatchObject({ statusCode: 404, code: 'USER_NOT_FOUND' });
  });

  it('throws NO_ACTIVE_SUBSCRIPTIONS when no cats are active', () => {
    expect(
      errorResponse(() => service.getNextDelivery('inactive-cats-user')),
    ).toMatchObject({ statusCode: 404, code: 'NO_ACTIVE_SUBSCRIPTIONS' });
  });
});

describe('formatNames', () => {
  it.each([
    [[], ''],
    [['A'], 'A'],
    [['A', 'B'], 'A and B'],
    [['A', 'B', 'C'], 'A, B and C'],
    [['A', 'B', 'C', 'D'], 'A, B, C and D'],
  ])('formats %j as "%s"', (names, expected) => {
    expect(formatNames(names)).toBe(expected);
  });
});
