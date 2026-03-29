import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  UseGuards,
  Query,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../database/schemas/user.schema';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Get('status')
  getStatus(@Req() req: any) {
    return this.service.getStatus(req.user.sub.toString());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Post('checkout')
  createCheckout(@Req() req: any, @Body() dto: CreateCheckoutDto) {
    return this.service.createCheckoutSession(
      req.user.sub.toString(),
      dto,
      req.user.email,
    );
  }
  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const rawBody = req.rawBody ?? (req.body as Buffer);
    return this.service.handleWebhook(rawBody, sig);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/bills')
  listBills(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.listAllBills(+page, +limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Post('cancel')
  cancelSubscription(@Req() req: any) {
    return this.service.cancelSubscription(req.user.sub.toString());
  }
}
