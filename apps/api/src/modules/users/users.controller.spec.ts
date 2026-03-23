import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

const mockUsersService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateAvatar: jest.fn(),
  updateLogo: jest.fn(),
  uploadDocument: jest.fn(),
  getDocuments: jest.fn(),
  deleteDocument: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<UsersController>(UsersController);
  });

  const req = { user: { sub: 'user-id', role: 'DRIVER' } };

  it('should get profile', async () => {
    mockUsersService.getProfile.mockResolvedValue({ email: 'a@a.com' });
    const result = await controller.getProfile(req);
    expect(mockUsersService.getProfile).toHaveBeenCalledWith('user-id');
    expect(result).toEqual({ email: 'a@a.com' });
  });

  it('should update profile', async () => {
    mockUsersService.updateProfile.mockResolvedValue({ fullName: 'Updated' });
    const result = await controller.updateProfile(req, {
      fullName: 'Updated',
    } as any);
    expect(result).toEqual({ fullName: 'Updated' });
  });

  it('should upload avatar', async () => {
    mockUsersService.updateAvatar.mockResolvedValue({
      avatar: 'path/to/avatar.png',
    });
    const result = await controller.uploadAvatar(req, {
      path: 'path/to/avatar.png',
    } as any);
    expect(result).toEqual({ avatar: 'path/to/avatar.png' });
  });

  it('should get documents', async () => {
    mockUsersService.getDocuments.mockResolvedValue([]);
    const result = await controller.getDocuments(req);
    expect(result).toEqual([]);
  });

  it('should delete document', async () => {
    mockUsersService.deleteDocument.mockResolvedValue({ message: 'deleted' });
    const result = await controller.deleteDocument(req, 'doc-id');
    expect(mockUsersService.deleteDocument).toHaveBeenCalledWith(
      'user-id',
      'doc-id',
    );
    expect(result).toEqual({ message: 'deleted' });
  });
});
