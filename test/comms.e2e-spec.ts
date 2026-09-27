import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { fixtureUsersService } from './fixtures/users';

describe('GET /comms/your-next-delivery/:userId', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(fixtureUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 with the next-delivery comms', async () => {
    const res = await request(app.getHttpServer())
      .get('/comms/your-next-delivery/multi-cat-user')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toEqual({
      title: 'Your next delivery for Tom and Kit',
      message:
        "Hey Alice! In two days' time, we'll be charging you for your next order for Tom and Kit's fresh food.",
      totalPrice: 134,
      freeGift: true,
    });
  });

  it('returns 404 USER_NOT_FOUND for an unknown user', async () => {
    const res = await request(app.getHttpServer())
      .get('/comms/your-next-delivery/does-not-exist')
      .expect(404);

    expect(res.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      code: 'USER_NOT_FOUND',
      message: 'User does-not-exist not found',
    });
  });

  it('returns 404 NO_ACTIVE_SUBSCRIPTIONS when no cats are active', async () => {
    const res = await request(app.getHttpServer())
      .get('/comms/your-next-delivery/inactive-cats-user')
      .expect(404);

    expect(res.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      code: 'NO_ACTIVE_SUBSCRIPTIONS',
      message: 'User inactive-cats-user has no active subscriptions',
    });
  });
});
