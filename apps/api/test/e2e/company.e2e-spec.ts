import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { startTestDb, stopTestDb } from '../helpers/db.helper';
import { User } from '../../src/database/schemas/user.schema';
import { EmailService } from '../../src/modules/email/email.service';
import { SubscriptionsService } from '../../src/modules/subscriptions/subscriptions.service';

describe('Company Workflow (e2e)', () => {
  let app: INestApplication;
  let companyToken: string;
  let missionId: string;

  beforeAll(async () => {
    await startTestDb();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({ sendVerificationEmail: jest.fn(), sendPasswordResetEmail: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register/company')
      .send({
        email: 'company@test.com',
        password: 'Company1234!',
        companyName: 'Test Corp',
      });
    expect(registerRes.status).toBe(201);

    const userModel: Model<User> = moduleRef.get(getModelToken(User.name), { strict: false });
    const subService = moduleRef.get(SubscriptionsService, { strict: false });

    await userModel.updateOne({ email: 'company@test.com' }, { isVerified: true });
    const company = await userModel.findOne({ email: 'company@test.com' });
    expect(company).not.toBeNull();

    await subService.getOrCreateSubscription(company!._id.toString());

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'company@test.com', password: 'Company1234!' });
    expect(loginRes.status).toBe(201);
    companyToken = loginRes.body.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await stopTestDb();
  });

  it('POST /missions - company creates a mission', async () => {
    const res = await request(app.getHttpServer())
      .post('/missions')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Deliver goods',
        description: 'Transport from A to B',
        origin: 'Casablanca',
        destination: 'Rabat',
        cargoType: 'Electronics',
        weight: 500,
        price: 1500,
        departureDate: new Date(Date.now() + 86400000).toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    missionId = res.body._id;
  });

  it('GET /missions/my-missions - company sees own missions', async () => {
    const res = await request(app.getHttpServer())
      .get('/missions/my-missions')
      .set('Authorization', `Bearer ${companyToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PATCH /missions/:id - company updates a mission', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/missions/${missionId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send({ title: 'Updated title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
  });

  it('GET /applications/mission/:id - company views applications', async () => {
    const res = await request(app.getHttpServer())
      .get(`/applications/mission/${missionId}`)
      .set('Authorization', `Bearer ${companyToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /missions/:id - company deletes a mission', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/missions/${missionId}`)
      .set('Authorization', `Bearer ${companyToken}`);
    expect(res.status).toBe(200);
  });
});
