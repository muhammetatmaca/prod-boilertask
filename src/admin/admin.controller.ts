import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get system metrics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'System metrics and recent audit logs',
  })
  async getMetrics() {
    return this.authService.getAdminMetrics();
  }
}
