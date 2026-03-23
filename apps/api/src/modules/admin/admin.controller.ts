import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../database/schemas/user.schema';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  listUsers(
    @Query('role') role?: Role,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.listUsers(role, +page, +limit);
  }

  @Patch('users/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('subscriptions')
  listSubscriptions(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.listSubscriptions(+page, +limit);
  }
}
