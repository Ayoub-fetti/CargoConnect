import { Test, TestingModule } from '@nestjs/testing';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';

const mockMissionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByCompany: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('MissionsController', () => {
  let controller: MissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionsController],
      providers: [{ provide: MissionsService, useValue: mockMissionsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(SubscriptionGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<MissionsController>(MissionsController);
  });

  const req = { user: { sub: 'company-id' } };

  it('should create a mission', async () => {
    mockMissionsService.create.mockResolvedValue({ _id: '1' });
    const result = await controller.create(req, { title: 'Test' } as any);
    expect(mockMissionsService.create).toHaveBeenCalledWith('company-id', {
      title: 'Test',
    });
    expect(result).toEqual({ _id: '1' });
  });

  it('should find all missions', async () => {
    mockMissionsService.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('should find my missions', async () => {
    mockMissionsService.findByCompany.mockResolvedValue([]);
    const result = await controller.findMyMissions(req);
    expect(mockMissionsService.findByCompany).toHaveBeenCalledWith(
      'company-id',
    );
    expect(result).toEqual([]);
  });

  it('should find one mission', async () => {
    mockMissionsService.findOne.mockResolvedValue({ _id: '1' });
    const result = await controller.findOne('1');
    expect(result).toEqual({ _id: '1' });
  });

  it('should update a mission', async () => {
    mockMissionsService.update.mockResolvedValue({
      _id: '1',
      title: 'Updated',
    });
    const result = await controller.update(req, '1', {
      title: 'Updated',
    } as any);
    expect(result).toEqual({ _id: '1', title: 'Updated' });
  });

  it('should delete a mission', async () => {
    mockMissionsService.delete.mockResolvedValue({
      message: 'Mission deleted successfully',
    });
    const result = await controller.delete(req, '1');
    expect(result).toEqual({ message: 'Mission deleted successfully' });
  });
});
