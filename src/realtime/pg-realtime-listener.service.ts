import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
import { getPgClientConfig } from '../database/db-config';
import { RealtimeService } from './realtime.service';
import type { DbChangeEvent } from './realtime.types';

const WATCHED_TABLES = [
  'member_profiles',
  'workers_profiles',
  'membership_plans',
  'subscriptions',
  'fitness_classes',
  'class_schedules',
  'class_bookings',
  'exercise_catalog',
  'workout_plans',
  'routine_exercises',
  'fitness_assessments',
] as const;

const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

@Injectable()
export class PgRealtimeListenerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PgRealtimeListenerService.name);
  private pgClient: Client | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempt = 0;
  private shuttingDown = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.ensureTriggers();
    } catch (error) {
      this.logger.warn(
        `No se pudieron instalar triggers LISTEN/NOTIFY al iniciar: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    await this.connectListener();
  }

  async onModuleDestroy(): Promise<void> {
    this.shuttingDown = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    await this.closeClient();
  }

  private getSchema(): string {
    const raw = this.configService.get<string>('DB_SCHEMA')?.trim() || 'public';
    return SAFE_IDENTIFIER.test(raw) ? raw : 'public';
  }

  private async ensureTriggers(): Promise<void> {
    if (!this.dataSource.isInitialized) return;
    const schema = this.getSchema();

    await this.dataSource.query(`
      CREATE OR REPLACE FUNCTION "${schema}".notify_db_change() RETURNS trigger AS $$
      DECLARE
        record_id text;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          record_id := COALESCE(to_jsonb(OLD)->>'id', '');
        ELSE
          record_id := COALESCE(to_jsonb(NEW)->>'id', '');
        END IF;

        PERFORM pg_notify(
          'db_changes',
          json_build_object(
            'table', TG_TABLE_NAME,
            'action', TG_OP,
            'id', record_id,
            'timestamp', floor(extract(epoch from clock_timestamp()) * 1000)::bigint
          )::text
        );
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    for (const table of WATCHED_TABLES) {
      await this.dataSource.query(`
        DO $$
        BEGIN
          IF to_regclass('${schema}.${table}') IS NOT NULL THEN
            DROP TRIGGER IF EXISTS trg_notify_db_change ON "${schema}"."${table}";
            CREATE TRIGGER trg_notify_db_change
              AFTER INSERT OR UPDATE OR DELETE ON "${schema}"."${table}"
              FOR EACH ROW EXECUTE FUNCTION "${schema}".notify_db_change();
          END IF;
        END $$;
      `);
    }

    this.logger.log(
      `Triggers LISTEN/NOTIFY verificados en schema "${schema}" para ${WATCHED_TABLES.length} tablas`,
    );
  }

  private async connectListener(): Promise<void> {
    if (this.shuttingDown) return;

    await this.closeClient();

    const client = new Client(getPgClientConfig(this.configService));
    this.pgClient = client;

    client.on('error', (err) => {
      if (this.shuttingDown) return;
      this.logger.warn(`Error en listener PostgreSQL: ${err.message}`);
      this.scheduleReconnect();
    });

    client.on('end', () => {
      if (this.shuttingDown) return;
      this.logger.warn('Conexión de listener PostgreSQL cerrada');
      this.scheduleReconnect();
    });

    client.on('notification', (msg) => {
      if (msg.channel !== 'db_changes' || !msg.payload) return;
      try {
        const payload = JSON.parse(msg.payload) as DbChangeEvent;
        this.realtimeService.emitDbChange({
          ...payload,
          source: 'gym-db',
        });
      } catch {
        this.logger.warn(`Payload NOTIFY inválido: ${msg.payload}`);
      }
    });

    try {
      await client.connect();
      await client.query('LISTEN db_changes');
      this.reconnectAttempt = 0;
      this.logger.log('Escuchando canal PostgreSQL "db_changes" en gym_db');
    } catch (error) {
      this.logger.warn(
        `No se pudo conectar listener PostgreSQL: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      await this.closeClient();
      this.scheduleReconnect();
    }
  }

  private async closeClient(): Promise<void> {
    if (!this.pgClient) return;
    const client = this.pgClient;
    this.pgClient = null;
    client.removeAllListeners();
    client.on('error', () => {});
    try {
      await client.end();
    } catch {
      // ignore close errors
    }
  }

  private scheduleReconnect(): void {
    if (this.shuttingDown || this.reconnectTimer) return;
    const delayMs = Math.min(1000 * 2 ** this.reconnectAttempt, 30000);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connectListener();
    }, delayMs);
  }
}
