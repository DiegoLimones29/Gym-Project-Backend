import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InternalApiKeyGuard } from '../common/guards/internal-api-key.guard';
import { PgRealtimeListenerService } from './pg-realtime-listener.service';
import { RealtimeInternalController } from './realtime-internal.controller';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
import { UserCleanupService } from './user-cleanup.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [RealtimeController, RealtimeInternalController],
  providers: [
    RealtimeService,
    PgRealtimeListenerService,
    UserCleanupService,
    InternalApiKeyGuard,
  ],
  exports: [RealtimeService, UserCleanupService],
})
export class RealtimeModule {}
