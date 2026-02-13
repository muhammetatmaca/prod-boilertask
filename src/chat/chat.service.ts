
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto, UpdateChatDto, CreateMessageDto } from './dto/chat.dto';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class ChatService implements OnModuleInit {
    private hf: HfInference;
    private readonly HF_TOKEN = process.env.HF_TOKEN || "";

    constructor(
        private prisma: PrismaService,
    ) {
        this.hf = new HfInference(this.HF_TOKEN);
    }

    // --- AUTO-TEST ON STARTUP ---
    async onModuleInit() {
        console.log('------------ AI SELF-TEST STARTING ------------');
        try {
            const reply = await this.generateResponse('Merhaba nasılsın?');
            console.log('✅ AI SUCCESS: ', reply);
        } catch (e) {
            console.error('❌ AI FAILED: ', e.message);
        }
        console.log('-----------------------------------------------');
    }

    // --- STANDARD CRUD METHODS (Unchanged) ---
    async create(userId: string, createChatDto: CreateChatDto) {
        const title = createChatDto.title || 'Yeni Sohbet';
        return this.prisma.chat.create({
            data: { title, user_id: userId, messages: { create: [] } },
        });
    }

    async findAll(userId: string) {
        return this.prisma.chat.findMany({
            where: { user_id: userId },
            orderBy: { updated_at: 'desc' },
            include: { messages: { take: 1, orderBy: { created_at: 'desc' } } },
        });
    }

    async findOne(id: string, userId: string) {
        const chat = await this.prisma.chat.findUnique({
            where: { id },
            include: { messages: { orderBy: { created_at: 'asc' } } },
        });
        if (!chat) throw new NotFoundException(`Chat #${id} not found`);
        if (chat.user_id !== userId) throw new ForbiddenException('Access denied');
        return chat;
    }

    async update(id: string, userId: string, updateChatDto: UpdateChatDto) {
        await this.findOne(id, userId);
        return this.prisma.chat.update({ where: { id }, data: updateChatDto });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.chat.delete({ where: { id } });
    }

    async addMessage(chatId: string, userId: string, createMessageDto: CreateMessageDto) {
        const chat = await this.findOne(chatId, userId);

        // 1. User Message
        const userMsg = await this.prisma.message.create({
            data: { chat_id: chatId, role: 'user', content: createMessageDto.content },
        });

        // 2. AI Response
        const aiText = await this.generateResponse(createMessageDto.content);

        // 3. AI Message
        const aiMsg = await this.prisma.message.create({
            data: { chat_id: chatId, role: 'assistant', content: aiText },
        });

        // Update chat updated_at
        await this.prisma.chat.update({ where: { id: chatId }, data: { updated_at: new Date() } });

        return { userMessage: userMsg, aiMessage: aiMsg };
    }


    // --- HUGGING FACE RECOMMENDED MODEL (Fail-Safe) ---
    async generateResponse(content: string): Promise<string> {
        try {
            // Using chatCompletion without specific model lets HF choose best available free model
            // Usually returns a Mistral or Llama variant
            const result = await this.hf.chatCompletion({
                model: "mistralai/Mistral-7B-Instruct-v0.2", // Try forcing Mistral again, as library handles it better
                messages: [
                    { role: "system", content: "Sen Türkçe konuşan yardımsever bir asistansın." },
                    { role: "user", content }
                ],
                max_tokens: 500,
                temperature: 0.7,
            });

            return result.choices[0].message.content.trim();

        } catch (error) {
            console.error('################### HF API ERROR ###################');
            console.error(error);

            // Second Attempt: Failover to very basic model if first fails
            try {
                console.log("Attempting failover to GPT-2...");
                const result = await this.hf.textGeneration({
                    model: 'gpt2',
                    inputs: content,
                });
                return "Yedek Model: " + result.generated_text;
            } catch (e) {
                return `❌ Hifi Hatası: ${error.message}`;
            }
        }
    }
}
