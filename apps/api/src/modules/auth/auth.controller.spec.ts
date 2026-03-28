import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  registerCompany: jest.fn(),
  registerDriver: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should register a company', async () => {
    mockAuthService.registerCompany.mockResolvedValue({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
    const result = await controller.registerCompany({
      email: 'test@test.com',
      password: '123456',
      companyName: 'Test',
    } as any);
    expect(result).toEqual({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  });

  it('should register a driver', async () => {
    mockAuthService.registerDriver.mockResolvedValue({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
    const result = await controller.registerDriver({
      email: 'd@d.com',
      password: '123',
      fullName: 'Driver',
    } as any);
    expect(result).toEqual({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  });

  it('should login', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const result = await controller.login({
      email: 'a@a.com',
      password: '123',
    });
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should refresh token', async () => {
    mockAuthService.refreshToken.mockResolvedValue({
      access_token: 'new_token',
    });
    const result = await controller.refresh({ refreshToken: 'old' });
    expect(result).toEqual({ access_token: 'new_token' });
  });

  it('should logout', async () => {
    mockAuthService.logout.mockResolvedValue({
      message: 'Logged out successfully',
    });
    const result = await controller.logout({ user: { userId: 'uid' } });
    expect(result).toEqual({ message: 'Logged out successfully' });
  });

  it('should verify email', async () => {
    mockAuthService.verifyEmail.mockResolvedValue({
      message: 'Email verified successfully',
    });
    const result = await controller.verifyEmail({ token: 'tok' });
    expect(result).toEqual({ message: 'Email verified successfully' });
  });

  it('should send forgot password email', async () => {
    mockAuthService.forgotPassword.mockResolvedValue({
      message: 'If email exists, reset link has been sent',
    });
    const result = await controller.forgotPassword({ email: 'a@a.com' });
    expect(result).toEqual({
      message: 'If email exists, reset link has been sent',
    });
  });

  it('should reset password', async () => {
    mockAuthService.resetPassword.mockResolvedValue({
      message: 'Password reset successfully',
    });
    const result = await controller.resetPassword({
      token: 'tok',
      newPassword: 'newpass',
    });
    expect(result).toEqual({ message: 'Password reset successfully' });
  });
});
