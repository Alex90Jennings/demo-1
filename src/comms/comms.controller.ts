import { Controller, Get, Param } from '@nestjs/common';
import { CommsService } from './comms.service';
import { NextDeliveryComms } from '../types';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('your-next-delivery/:userId')
  getNextDelivery(@Param('userId') userId: string): NextDeliveryComms {
    return this.commsService.getNextDelivery(userId);
  }
}
