import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

const mockApplicationsService = {
  apply: jest.fn(),
  findByDriver: jest.fn(),
  findByMission: jest.fn(),
  approve: jest.fn(),
  reject: jest.fn(),
};

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [{ provide: ApplicationsService, useValue: mockApplicationsService }],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
      .compile();
    controller = module.get<ApplicationsController>(ApplicationsController);
  });

  const driverReq = { user: { sub: 'driver-id' } };
  const companyReq = { user: { sub: 'company-id' } };

  it('should apply to a mission', async () => {
    mockApplicationsService.apply.mockResolvedValue({ _id: 'app1' });
    const result = await controller.apply(driverReq, { missionId: 'm1' });
    expect(mockApplicationsService.apply).toHaveBeenCalledWith('driver-id', { missionId: 'm1' });
    expect(result).toEqual({ _id: 'app1' });
  });

  it('should find my applications', async () => {
    mockApplicationsService.findByDriver.mockResolvedValue([]);
    const result = await controller.findMyApplications(driverReq);
    expect(result).toEqual([]);
  });

  it('should find applications by mission', async () => {
    mockApplicationsService.findByMission.mockResolvedValue([]);
    const result = await controller.findByMission('m1');
    expect(result).toEqual([]);
  });

  it('should approve an application', async () => {
    mockApplicationsService.approve.mockResolvedValue({ status: 'ACCEPTED' });
    const result = await controller.approveApplication('app1', companyReq);
    expect(mockApplicationsService.approve).toHaveBeenCalledWith('app1', 'company-id');
    expect(result).toEqual({ status: 'ACCEPTED' });
  });

  it('should reject an application', async () => {
    mockApplicationsService.reject.mockResolvedValue({ status: 'REJECTED' });
    const result = await controller.rejectApplication('app1', companyReq);
    expect(result).toEqual({ status: 'REJECTED' });
  });
});
