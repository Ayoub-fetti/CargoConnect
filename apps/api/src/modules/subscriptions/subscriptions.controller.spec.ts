import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

const mockSubscriptionsService = {
  getStatus: jest.fn(),
  createCheckoutSession: jest.fn(),
  handleWebhook: jest.fn(),
  listAllBills: jest.fn(),
};

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  const req = { user: { sub: 'company-id', email: 'co@co.com' } };

  it('should get subscription status', async () => {
    mockSubscriptionsService.getStatus.mockResolvedValue({ status: 'trial' });
    const result = await controller.getStatus(req);
    expect(mockSubscriptionsService.getStatus).toHaveBeenCalledWith(
      'company-id',
    );
    expect(result).toEqual({ status: 'trial' });
  });

  it('should create checkout session', async () => {
    mockSubscriptionsService.createCheckoutSession.mockResolvedValue({
      url: 'https://stripe.com',
    });
    const result = await controller.createCheckout(req, {
      plan: 'MONTHLY',
    } as any);
    expect(result).toEqual({ url: 'https://stripe.com' });
  });

  it('should handle webhook', async () => {
    mockSubscriptionsService.handleWebhook.mockResolvedValue({
      received: true,
    });
    const result = await controller.handleWebhook(
      { rawBody: Buffer.from('') } as any,
      'sig',
    );
    expect(result).toEqual({ received: true });
  });

  it('should list bills', async () => {
    mockSubscriptionsService.listAllBills.mockResolvedValue([]);
    const result = await controller.listBills();
    expect(result).toEqual([]);
  });
});
