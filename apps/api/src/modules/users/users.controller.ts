import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../database/schemas/user.schema';
import { UsersService } from './users.service';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('me')
  updateProfile(
    @Request() req,
    @Body() dto: UpdateDriverProfileDto | UpdateCompanyProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.sub, dto, req.user.role);
  }

  @Post('avatar')
  @Roles(Role.DRIVER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only images allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(req.user.sub, file.path);
  }

  @Post('logo')
  @Roles(Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `logo-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateLogo(req.user.sub, file.path);
  }

  @Post('documents')
  @Roles(Role.DRIVER, Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `doc-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    return this.usersService.uploadDocument(req.user.sub, file, type);
  }

  @Get('documents')
  @Roles(Role.DRIVER, Role.COMPANY)
  getDocuments(@Request() req) {
    return this.usersService.getDocuments(req.user.sub);
  }

  @Delete('documents/:id')
  @Roles(Role.DRIVER, Role.COMPANY)
  deleteDocument(@Request() req, @Param('id') id: string) {
    return this.usersService.deleteDocument(req.user.sub, id);
  }
}
