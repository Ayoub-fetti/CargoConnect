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
import { StorageService } from '../../common/services/storage.service';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { extname } from 'path';

function generateFilename(folder: string, originalName: string): string {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${folder}-${uniqueSuffix}${extname(originalName)}`;
}

@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private storageService: StorageService,
  ) {}

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
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    const filename = generateFilename('avatar', file.originalname);
    const storedPath = await this.storageService.uploadFile(
      'avatars',
      filename,
      file.buffer,
      file.mimetype,
    );

    return this.usersService.updateAvatar(req.user.sub, storedPath);
  }

  @Post('logo')
  @Roles(Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    const filename = generateFilename('logo', file.originalname);
    const storedPath = await this.storageService.uploadFile(
      'logos',
      filename,
      file.buffer,
      file.mimetype,
    );

    return this.usersService.updateLogo(req.user.sub, storedPath);
  }

  @Post('documents')
  @Roles(Role.DRIVER, Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    if (!file) {
      throw new BadRequestException('Document file is required');
    }

    const filename = generateFilename('doc', file.originalname);
    const storedPath = await this.storageService.uploadFile(
      'documents',
      filename,
      file.buffer,
      file.mimetype,
    );

    return this.usersService.uploadDocument(
      req.user.sub,
      file,
      type,
      storedPath,
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
