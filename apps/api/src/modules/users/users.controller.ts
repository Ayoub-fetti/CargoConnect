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
  BadRequestException,
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
import { basename, extname, join } from 'path';
import { mkdirSync } from 'fs';

const API_ROOT = join(__dirname, '..', '..', '..');
const UPLOADS_ROOT = join(API_ROOT, 'uploads');

function getUploadDestination(folder: string) {
  const destination = join(UPLOADS_ROOT, folder);
  mkdirSync(destination, { recursive: true });
  return destination;
}

function toStoredUploadPath(folder: string, filename: string) {
  return join('uploads', folder, filename).replace(/\\/g, '/');
}

function resolveUploadedFilename(file: Express.Multer.File) {
  if (file.filename) {
    return file.filename;
  }

  if (file.path) {
    return basename(file.path);
  }

  throw new BadRequestException('Uploaded file name is missing');
}

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
        destination: (req, file, cb) => {
          cb(null, getUploadDestination('avatars'));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only images allowed') as any,
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    return this.usersService.updateAvatar(
      req.user.sub,
      toStoredUploadPath('avatars', resolveUploadedFilename(file)),
    );
  }

  @Post('logo')
  @Roles(Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, getUploadDestination('logos'));
        },
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
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    return this.usersService.updateLogo(
      req.user.sub,
      toStoredUploadPath('logos', resolveUploadedFilename(file)),
    );
  }

  @Post('documents')
  @Roles(Role.DRIVER, Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, getUploadDestination('documents'));
        },
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
    if (!file) {
      throw new BadRequestException('Document file is required');
    }

    return this.usersService.uploadDocument(
      req.user.sub,
      file,
      type,
      toStoredUploadPath('documents', resolveUploadedFilename(file)),
    );
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
  @Get('drivers/:id')
  @Roles(Role.COMPANY, Role.ADMIN)
  getDriverProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Get('drivers/:id/documents')
  @Roles(Role.COMPANY, Role.ADMIN)
  getDriverDocuments(@Param('id') id: string) {
    return this.usersService.getDocuments(id);
  }
}
