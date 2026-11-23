import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { InternalApiKeyGuard } from '../common/guards/internal-api-key.guard';
import { RealtimeGateway } from './realtime.gateway';
import type { DbChangeAction } from './realtime.types';
import { UserCleanupService } from './user-cleanup.service';

export class DbChangeDto {
  @IsString()
  table: string;

  @IsIn(['INSERT', 'UPDATE', 'DELETE'])
  action: DbChangeAction;

  @IsString()
  id: string;

  @IsNumber()
  timestamp: number;

  @IsOptional()
  @IsString()
  source?: string;
}

@UseGuards(InternalApiKeyGuard)
@Controller('internal/realtime')
export class RealtimeInternalController {
  constructor(
    private readonly realtimeGateway: RealtimeGateway,
    private readonly userCleanupService: UserCleanupService,
  ) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('db-change')
  async handleDbChange(@Body() dto: DbChangeDto) {
    if (dto.table === 'users' && dto.action === 'DELETE' && dto.id) {
      await this.userCleanupService.cleanupForDeletedUser(dto.id);
    }

    this.realtimeGateway.emitDbChange(dto);
    return { received: true };
  }
}
