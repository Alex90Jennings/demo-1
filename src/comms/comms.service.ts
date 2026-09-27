import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NextDeliveryComms } from '../types';
import {
  calculateTotalPrice,
  commsNotFound,
  FREE_GIFT_THRESHOLD,
  formatNames,
} from './helpers';

@Injectable()
export class CommsService {
  constructor(private readonly usersService: UsersService) {}

  getNextDelivery(userId: string): NextDeliveryComms {
    const user = this.usersService.findById(userId);
    if (!user) {
      throw commsNotFound('USER_NOT_FOUND', `User ${userId} not found`);
    }

    const activeCats = user.cats.filter((cat) => cat.subscriptionActive);
    if (activeCats.length === 0) {
      throw commsNotFound(
        'NO_ACTIVE_SUBSCRIPTIONS',
        `User ${userId} has no active subscriptions`,
      );
    }

    const catNames = formatNames(activeCats.map((cat) => cat.name));
    const totalPrice = calculateTotalPrice(activeCats);

    return {
      title: `Your next delivery for ${catNames}`,
      message: `Hey ${user.firstName}! In two days' time, we'll be charging you for your next order for ${catNames}'s fresh food.`,
      totalPrice,
      freeGift: totalPrice > FREE_GIFT_THRESHOLD,
    };
  }
}
