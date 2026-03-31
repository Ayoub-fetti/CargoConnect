import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Validates JWT tokens using Passport-JWT startegy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
