import { Logger, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { JwtPayload } from '../auth/guards/auth.guard';
import type { DbChangeEvent } from './realtime.types';

const COALESCE_WINDOW_MS = 80;

function corsOriginValidator(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
): void {
  const raw = process.env.CORS_ORIGIN;
  if (!raw || raw.trim() === '*') {
    callback(null, true);
    return;
  }

  const allowedOrigins = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error('Origin not allowed by CORS'), false);
}

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: corsOriginValidator,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  private readonly logger = new Logger(RealtimeGateway.name);
  private readonly pendingByTable = new Map<
    string,
    { event: DbChangeEvent; timer: NodeJS.Timeout }
  >();

  @WebSocketServer()
  server?: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      client.emit('auth_error', { message: 'Token no proporcionado' });
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      client.data.user = payload;
    } catch {
      client.emit('auth_error', { message: 'Token inválido o expirado' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Cliente desconectado: ${client.id}`);
  }

  onModuleDestroy(): void {
    for (const entry of this.pendingByTable.values()) {
      clearTimeout(entry.timer);
    }
    this.pendingByTable.clear();
  }

  emitDbChange(event: DbChangeEvent): void {
    if (!this.server) {
      return;
    }

    // Emit user deletions immediately so active sessions for a deleted user never lose the exact deleted id.
    if (event.table === 'users' && event.action === 'DELETE') {
      this.server.emit('db:change', event);
      return;
    }

    const existing = this.pendingByTable.get(event.table);
    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
      const current = this.pendingByTable.get(event.table);
      this.pendingByTable.delete(event.table);
      if (current && this.server) {
        this.server.emit('db:change', current.event);
      }
    }, COALESCE_WINDOW_MS);

    this.pendingByTable.set(event.table, { event, timer });
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken.trim();
    }

    const authHeader = client.handshake.headers?.authorization;
    if (typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token?.trim()) {
        return token.trim();
      }
    }

    return null;
  }
}
