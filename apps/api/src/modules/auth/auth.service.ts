import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User } from '../../database/schemas/user.schema';
import { HashingUtil } from '../../utils/hashing';
import { EmailService } from '../email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
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
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email already registered');

    const hashedPassword = await HashingUtil.hash(dto.password);
    const verificationToken = HashingUtil.generateToken();

    const company = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      role: Role.COMPANY,
      companyName: dto.companyName,
      legalInfo: dto.legalInfo,
      description: dto.description,
      location: dto.location,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    } as any);

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

    const driver = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      role: Role.DRIVER,
      fullName: dto.fullName,
      phone: dto.phone,
      licenseTypes: dto.licenseTypes || [],
      zone: dto.zone || [],
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    } as any);

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
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
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
