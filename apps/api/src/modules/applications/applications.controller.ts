import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../database/schemas/user.schema';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.DRIVER)
  apply(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(req.user.sub, dto);
  }

  @Get('my-applications')
  @Roles(Role.DRIVER)
  findMyApplications(@Request() req) {
    return this.applicationsService.findByDriver(req.user.sub);
  }

  @Get('mission/:missionId')
  @Roles(Role.COMPANY)
  findByMission(@Param('missionId') missionId: string) {
    return this.applicationsService.findByMission(missionId);
  }

  @Patch(':id/approve')
  @Roles(Role.COMPANY)
  approveApplication(@Param('id') id: string, @Request() req) {
    return this.applicationsService.approve(id, req.user.sub);
  }

  @Patch(':id/reject')
  @Roles(Role.COMPANY)
  rejectApplication(@Param('id') id: string, @Request() req) {
    return this.applicationsService.reject(id, req.user.sub);
  }
}
