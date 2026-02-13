
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    initialMessage?: string;
}

export class UpdateChatDto {
    @IsString()
    @IsOptional()
    title?: string;
}

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}
