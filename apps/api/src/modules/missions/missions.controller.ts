import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../database/schemas/user.schema';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionStatus } from './schemas/mission.schema';

@Controller('missions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Post()
  @Roles(Role.COMPANY)
  create(@Request() req, @Body() dto: CreateMissionDto) {
    return this.missionsService.create(req.user.sub, dto);
  }

  @Get()
  @Roles(Role.DRIVER, Role.COMPANY)
  findAll(@Query('status') status?: MissionStatus) {
    return this.missionsService.findAll({ status });
  }

  @Get('my-missions')
  @Roles(Role.COMPANY)
  findMyMissions(@Request() req) {
    return this.missionsService.findByCompany(req.user.sub);
  }

  @Get(':id')
  @Roles(Role.DRIVER, Role.COMPANY)
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COMPANY)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateMissionDto,
  ) {
    return this.missionsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @Roles(Role.COMPANY)
  delete(@Request() req, @Param('id') id: string) {
    return this.missionsService.delete(id, req.user.sub);
  }
}
