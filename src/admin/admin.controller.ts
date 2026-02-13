<<<<<<< HEAD
import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
=======
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
<<<<<<< HEAD
import { AuthService } from '../auth/auth.service';
=======
import { AuthService, AdminMetrics } from '../auth/auth.service';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class AdminController {
<<<<<<< HEAD
    constructor(private readonly authService: AuthService) { }

    @Get('metrics')
    @ApiOperation({ summary: 'Get system metrics (Admin only)' })
    @ApiResponse({ status: 200, description: 'System metrics and recent audit logs' })
    async getMetrics(): Promise<any> {
        return this.authService.getAdminMetrics();
    }
=======
  constructor(private readonly authService: AuthService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get system metrics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'System metrics and recent audit logs',
  })
  async getMetrics(): Promise<AdminMetrics> {
    return this.authService.getAdminMetrics();
  }
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
