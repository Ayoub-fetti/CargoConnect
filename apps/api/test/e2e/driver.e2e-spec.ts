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

describe('Driver Workflow (e2e)', () => {
  let app: INestApplication;
  let driverToken: string;
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

    const userModel: Model<User> = moduleRef.get(getModelToken(User.name), { strict: false });
    const subService = moduleRef.get(SubscriptionsService, { strict: false });

    const driverRes = await request(app.getHttpServer())
      .post('/auth/register/driver')
      .send({
        email: 'driver@test.com',
        password: 'Driver1234!',
        fullName: 'Test Driver',
        phone: '0600000000',
      });
    expect(driverRes.status).toBe(201);
    await userModel.updateOne({ email: 'driver@test.com' }, { isVerified: true });

    const companyRes = await request(app.getHttpServer())
      .post('/auth/register/company')
      .send({
        email: 'company@test.com',
        password: 'Company1234!',
        companyName: 'Driver Test Corp',
      });
    expect(companyRes.status).toBe(201);
    await userModel.updateOne({ email: 'company@test.com' }, { isVerified: true });
    const company = await userModel.findOne({ email: 'company@test.com' });
    expect(company).not.toBeNull();

    await subService.getOrCreateSubscription(company!._id.toString());

    const companyLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'company@test.com', password: 'Company1234!' });
    expect(companyLogin.status).toBe(201);

    const missionRes = await request(app.getHttpServer())
      .post('/missions')
      .set('Authorization', `Bearer ${companyLogin.body.access_token}`)
      .send({
        title: 'Driver Mission',
        description: 'Test mission for driver',
        origin: 'Fes',
        destination: 'Marrakech',
        cargoType: 'Food',
        weight: 200,
        price: 800,
        departureDate: new Date(Date.now() + 86400000).toISOString(),
      });
    expect(missionRes.status).toBe(201);
    missionId = missionRes.body._id;

    const driverLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'driver@test.com', password: 'Driver1234!' });
    expect(driverLogin.status).toBe(201);
    driverToken = driverLogin.body.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await stopTestDb();
  });

  it('GET /missions - driver browses open missions', async () => {
    const res = await request(app.getHttpServer())
      .get('/missions')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /applications - driver applies to a mission', async () => {
    const res = await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ missionId, message: 'I am available' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('GET /applications/my-applications - driver sees own applications', async () => {
    const res = await request(app.getHttpServer())
      .get('/applications/my-applications')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /applications - driver cannot apply twice', async () => {
    const res = await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ missionId, message: 'Duplicate' });
    expect(res.status).toBe(400);
  });
});
