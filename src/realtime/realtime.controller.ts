import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RealtimeService } from './realtime.service';
import type { RealtimePollResponse } from './realtime.types';

@UseGuards(AuthGuard)
@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get('poll')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  async poll(
    @Query('since') sinceRaw: string | undefined,
    @Query('timeout') timeoutRaw: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RealtimePollResponse> {
    const since = this.parseOptionalNonNegativeInt(sinceRaw, 'since');
    const timeoutMs = this.parseOptionalNonNegativeInt(timeoutRaw, 'timeout');

    const abortController = new AbortController();
    const onClose = () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    };
    res.once('close', onClose);

    try {
      return await this.realtimeService.poll({
        since,
        timeoutMs,
        signal: abortController.signal,
      });
    } finally {
      res.off('close', onClose);
    }
  }

  private parseOptionalNonNegativeInt(
    raw: string | undefined,
    paramName: string,
  ): number | undefined {
    if (raw === undefined || raw.trim() === '') {
      return undefined;
    }

    const trimmed = raw.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new BadRequestException(
        `El parámetro "${paramName}" debe ser un entero no negativo`,
      );
    }

    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isSafeInteger(parsed)) {
      throw new BadRequestException(
        `El parámetro "${paramName}" excede el rango permitido`,
      );
    }

    return parsed;
  }
}
