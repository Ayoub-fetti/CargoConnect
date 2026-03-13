import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User } from '../../database/schemas/user.schema';
import { HashingUtil } from '../../utils/hashing';
import { EmailService } from '../email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email already registered');

    const hashedPassword = await HashingUtil.hash(dto.password);
    const verificationToken = HashingUtil.generateToken();

    const CompanyModel = this.userModel.discriminators?.['COMPANY'];
    if (!CompanyModel) throw new Error('Company discriminator not found');

    await CompanyModel.create({
      email: dto.email,
      password: hashedPassword,
      companyName: dto.companyName,
      legalInfo: dto.legalInfo,
      description: dto.description,
      location: dto.location,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmail(dto.email, verificationToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async registerDriver(dto: RegisterDriverDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email already registered');

    const hashedPassword = await HashingUtil.hash(dto.password);
    const verificationToken = HashingUtil.generateToken();

    const DriverModel = this.userModel.discriminators?.['DRIVER'];
    if (!DriverModel) throw new Error('Driver discriminator not found');

    await DriverModel.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
      licenseTypes: dto.licenseTypes || [],
      zone: dto.zone || [],
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmail(dto.email, verificationToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await HashingUtil.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified)
      throw new UnauthorizedException('Please verify your email first');
    if (!user.isActive)
      throw new UnauthorizedException('Account is deactivated');

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get('jwt.refreshSecret') ||
        'refresh-secret-change-me',
      expiresIn: this.configService.get('jwt.refreshExpiresIn') || '30d',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await HashingUtil.hash(refreshToken),
      refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userModel
        .findById(payload.sub)
        .select('+refreshToken');
      if (!user || !user.isActive || !user.refreshToken)
        throw new UnauthorizedException();

      const isValid = await HashingUtil.compare(
        dto.refreshToken,
        user.refreshToken,
      );
      if (
        !isValid ||
        !user.refreshTokenExpires ||
        user.refreshTokenExpires < new Date()
      )
        throw new UnauthorizedException();

      const newPayload = { sub: user._id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);

      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpires: null,
    });
    return { message: 'Logged out successfully' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userModel.findOne({
      emailVerificationToken: dto.token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user)
      throw new BadRequestException('Invalid or expired verification token');

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) return { message: 'If email exists, reset link has been sent' };

    const resetToken = HashingUtil.generateToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If email exists, reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      passwordResetToken: dto.token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    user.password = await HashingUtil.hash(dto.newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }
}
