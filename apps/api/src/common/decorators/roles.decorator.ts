import { SetMetadata } from '@nestjs/common';
import { Role } from '../../database/schemas/user.schema';

// Marks endpoints requiring specific roles
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
