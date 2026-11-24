import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type {
  DbChangeEvent,
  RealtimePollResponse,
  SequencedDbChangeEvent,
} from './realtime.types';

export const COALESCE_WINDOW_MS = 80;
export const MAX_EVENT_HISTORY = 500;
export const DEFAULT_POLL_TIMEOUT_MS = 25_000;
export const MIN_POLL_TIMEOUT_MS = 1_000;
export const MAX_POLL_TIMEOUT_MS = 30_000;

interface PollWaiter {
  since: number;
  resolve: (response: RealtimePollResponse) => void;
  timer: NodeJS.Timeout;
  cleanupAbort?: () => void;
}

export interface PollOptions {
  since?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private currentSeq = 0;
  private readonly history: SequencedDbChangeEvent[] = [];
  private readonly pendingByTable = new Map<
    string,
    { event: DbChangeEvent; timer: NodeJS.Timeout }
  >();
  private readonly waiters = new Set<PollWaiter>();

  getCurrentCursor(): number {
    return this.currentSeq;
  }

  emitDbChange(event: DbChangeEvent): void {
    // Emit user deletions immediately so active sessions for a deleted user never lose the exact deleted id.
    if (event.table === 'users' && event.action === 'DELETE') {
      this.publishEvent(event);
      return;
    }

    const existing = this.pendingByTable.get(event.table);
    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
      const current = this.pendingByTable.get(event.table);
      this.pendingByTable.delete(event.table);
      if (current) {
        this.publishEvent(current.event);
      }
    }, COALESCE_WINDOW_MS);

    this.pendingByTable.set(event.table, { event, timer });
  }

  poll(options: PollOptions = {}): Promise<RealtimePollResponse> {
    if (options.since === undefined) {
      return Promise.resolve({
        cursor: this.currentSeq,
        events: [],
        reset: false,
      });
    }

    const immediate = this.buildResponseSince(options.since);
    if (
      immediate.reset ||
      immediate.events.length > 0 ||
      options.timeoutMs === 0 ||
      options.signal?.aborted
    ) {
      return Promise.resolve(immediate);
    }

    const effectiveTimeoutMs =
      options.timeoutMs === undefined
        ? DEFAULT_POLL_TIMEOUT_MS
        : Math.min(
            Math.max(options.timeoutMs, MIN_POLL_TIMEOUT_MS),
            MAX_POLL_TIMEOUT_MS,
          );

    const since = options.since;

    return new Promise<RealtimePollResponse>((resolve) => {
      const waiter: PollWaiter = {
        since,
        resolve,
        timer: setTimeout(() => {
          this.resolveWaiter(waiter, {
            cursor: this.currentSeq,
            events: [],
            reset: false,
          });
        }, effectiveTimeoutMs),
      };

      if (options.signal) {
        const onAbort = () => {
          this.resolveWaiter(waiter, {
            cursor: this.currentSeq,
            events: [],
            reset: false,
          });
        };
        options.signal.addEventListener('abort', onAbort, { once: true });
        waiter.cleanupAbort = () => {
          options.signal?.removeEventListener('abort', onAbort);
        };
      }

      this.waiters.add(waiter);
    });
  }

  onModuleDestroy(): void {
    for (const entry of this.pendingByTable.values()) {
      clearTimeout(entry.timer);
    }
    this.pendingByTable.clear();

    for (const waiter of Array.from(this.waiters)) {
      this.resolveWaiter(waiter, {
        cursor: this.currentSeq,
        events: [],
        reset: false,
      });
    }
  }

  private publishEvent(event: DbChangeEvent): void {
    this.currentSeq += 1;
    const sequenced: SequencedDbChangeEvent = {
      ...event,
      seq: this.currentSeq,
    };

    this.history.push(sequenced);
    if (this.history.length > MAX_EVENT_HISTORY) {
      this.history.splice(0, this.history.length - MAX_EVENT_HISTORY);
    }

    for (const waiter of Array.from(this.waiters)) {
      this.resolveWaiter(waiter, this.buildResponseSince(waiter.since));
    }
  }

  private buildResponseSince(since: number): RealtimePollResponse {
    const cursor = this.currentSeq;

    if (since > cursor) {
      return { cursor, events: [], reset: true };
    }

    if (since === cursor) {
      return { cursor, events: [], reset: false };
    }

    const oldestSeq =
      this.history.length > 0 ? this.history[0].seq : cursor + 1;
    const reset = since < oldestSeq - 1;
    const events = this.history.filter((event) => event.seq > since);

    return { cursor, events, reset };
  }

  private resolveWaiter(
    waiter: PollWaiter,
    response: RealtimePollResponse,
  ): void {
    if (!this.waiters.delete(waiter)) {
      return;
    }
    clearTimeout(waiter.timer);
    waiter.cleanupAbort?.();
    waiter.resolve(response);
  }
}
