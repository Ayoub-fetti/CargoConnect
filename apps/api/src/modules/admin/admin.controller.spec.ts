import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

const mockAdminService = {
  listUsers: jest.fn(),
  toggleUserStatus: jest.fn(),
  getStats: jest.fn(),
  listSubscriptions: jest.fn(),
};

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<AdminController>(AdminController);
  });

  it('should list users', async () => {
    mockAdminService.listUsers.mockResolvedValue({ users: [], total: 0 });
    const result = await controller.listUsers();
    expect(result).toEqual({ users: [], total: 0 });
  });

  it('should toggle user status', async () => {
    mockAdminService.toggleUserStatus.mockResolvedValue({
      id: 'u1',
      isActive: false,
    });
    const result = await controller.toggleStatus('u1');
    expect(result).toEqual({ id: 'u1', isActive: false });
  });

  it('should get stats', async () => {
    mockAdminService.getStats.mockResolvedValue({ users: {}, missions: {} });
    const result = await controller.getStats();
    expect(result).toEqual({ users: {}, missions: {} });
  });

  it('should list subscriptions', async () => {
    mockAdminService.listSubscriptions.mockResolvedValue({
      subscriptions: [],
      total: 0,
    });
    const result = await controller.listSubscriptions();
    expect(result).toEqual({ subscriptions: [], total: 0 });
  });
});
