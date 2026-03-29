import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { startTestDb, stopTestDb } from '../helpers/db.helper';
import { User } from '../../src/database/schemas/user.schema';
import { EmailService } from '../../src/modules/email/email.service';
import { SubscriptionsService } from '../../src/modules/subscriptions/subscriptions.service';

describe('Admin Workflow (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

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
      .overrideProvider(SubscriptionsService)
      .useValue({
        getOrCreateSubscription: jest.fn().mockResolvedValue({}),
        getStatus: jest.fn().mockResolvedValue({}),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const userModel: Model<User> = moduleRef.get(getModelToken(User.name), {
      strict: false,
    });
    await userModel.collection.insertOne({
      email: 'admin@test.com',
      password: await bcrypt.hash('Admin1234!', 10),
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin1234!' });
    adminToken = res.body.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await stopTestDb();
  });

  it('GET /admin/stats - returns stats', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('missions');
  });

  it('GET /admin/users - returns user list', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('PATCH /admin/users/:id/toggle-status - toggles user status', async () => {
    await request(app.getHttpServer()).post('/auth/register/driver').send({
      email: 'driver.toggle@test.com',
      password: 'Driver1234!',
      fullName: 'Toggle Driver',
      phone: '0600000001',
    });

    const usersRes = await request(app.getHttpServer())
      .get('/admin/users?role=DRIVER')
      .set('Authorization', `Bearer ${adminToken}`);
    const driver = usersRes.body.users[0];

    const res = await request(app.getHttpServer())
      .patch(`/admin/users/${driver._id}/toggle-status`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('isActive');
  });

  it('GET /admin/users - rejects non-admin', async () => {
    const res = await request(app.getHttpServer()).get('/admin/users');
    expect(res.status).toBe(401);
  });
});
