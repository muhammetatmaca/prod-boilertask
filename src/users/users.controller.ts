import {
    Controller,
    Get,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Tüm kullanıcıları listeler (Sadece Admin)' })
    @ApiResponse({ status: 200, description: 'Kullanıcı listesi getirildi' })
    @ApiResponse({ status: 403, description: 'Yetki yetersiz' })
    async getUsers() {
        return this.usersService.users({});
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'ID ile kullanıcı bilgilerini getirir (Sadece Admin)' })
    @ApiResponse({ status: 200, description: 'Kullanıcı bulundu' })
    @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
    async getUserById(@Param('id') id: string) {
        return this.usersService.user({ id });
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Kullanıcıyı sistemden siler (Sadece Admin)' })
    @ApiResponse({ status: 200, description: 'Kullanıcı silindi' })
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser({ id });
    }
}
