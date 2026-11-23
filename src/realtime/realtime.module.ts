import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InternalApiKeyGuard } from '../common/guards/internal-api-key.guard';
import { PgRealtimeListenerService } from './pg-realtime-listener.service';
import { RealtimeInternalController } from './realtime-internal.controller';
import { RealtimeGateway } from './realtime.gateway';
import { UserCleanupService } from './user-cleanup.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [RealtimeInternalController],
  providers: [
    RealtimeGateway,
    PgRealtimeListenerService,
    UserCleanupService,
    InternalApiKeyGuard,
  ],
  exports: [RealtimeGateway, UserCleanupService],
})
export class RealtimeModule {}
