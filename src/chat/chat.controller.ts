
import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChatDto, CreateMessageDto } from './dto/chat.dto';

// CRITICAL: @Controller('chat') matches FRONTEND URL structure
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // 1. Create New Chat (POST /chat) - Matches Frontend Expectation
    @Post()
    async createChat(@Req() req, @Body() body: { title?: string, message?: string }) {
        // If frontend sends 'message' instead of 'initialMessage', adapt it
        return this.chatService.create(req.user.userId, {
            title: body.title,
            initialMessage: body.message
        });
    }

    // 2. Add Message (POST /chat/message) - Matches Frontend Expectation
    // Frontend sends { chatId: '...', content: '...' } to /chat/message
    @Post('message')
    async addMessage(@Req() req, @Body() body: { chatId: string, content: string }) {
        return this.chatService.addMessage(body.chatId, req.user.userId, { content: body.content });
    }

    // 3. Get All Chats (GET /chat)
    @Get()
    async getUserChats(@Req() req) {
        return this.chatService.findAll(req.user.userId);
    }

    // 4. Get Single Chat (GET /chat/:id)
    @Get(':id')
    async getChatMessages(@Param('id') id: string, @Req() req) {
        return this.chatService.findOne(id, req.user.userId);
    }

    // 5. Delete Chat (DELETE /chat/:id)
    @Delete(':id')
    async deleteChat(@Param('id') id: string, @Req() req) {
        return this.chatService.remove(id, req.user.userId);
    }
}
