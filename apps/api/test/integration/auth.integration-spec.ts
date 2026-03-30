import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { startTestDb, stopTestDb } from '../helpers/db.helper';
import { User } from '../../src/database/schemas/user.schema';
import { EmailService } from '../../src/modules/email/email.service';

describe('Auth Integration', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    await startTestDb();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendVerificationEmail: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userModel = moduleRef.get(getModelToken(User.name), { strict: false });
  }, 30000);

  afterAll(async () => {
    await app.close();
    await stopTestDb();
  });

  it('registers a driver account', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register/driver')
      .send({
        email: 'integration.driver@test.com',
        password: 'Driver1234!',
        fullName: 'Integration Driver',
        phone: '0600000009',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      'message',
      'Registration successful. Please check your email to verify your account.',
    );
  });

  it('logs in a verified driver account', async () => {
    await userModel.updateOne(
      { email: 'integration.driver@test.com' },
      { isVerified: true },
    );

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'integration.driver@test.com',
        password: 'Driver1234!',
      });

    expect(loginRes.status).toBe(201);
    expect(loginRes.body).toHaveProperty('access_token');
  });
});
