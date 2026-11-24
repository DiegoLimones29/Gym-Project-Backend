import {
  COALESCE_WINDOW_MS,
  MAX_EVENT_HISTORY,
  RealtimeService,
} from './realtime.service';

describe('RealtimeService', () => {
  let service: RealtimeService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new RealtimeService();
  });

  afterEach(() => {
    service.onModuleDestroy();
    jest.useRealTimers();
  });

  it('returns current cursor immediately on initial handshake without since', async () => {
    service.emitDbChange({
      table: 'users',
      action: 'DELETE',
      id: 'user-1',
      timestamp: 1000,
    });

    const response = await service.poll();
    expect(response).toEqual({
      cursor: 1,
      events: [],
      reset: false,
    });
  });

  it('coalesces rapid events per table within 80ms while waking active long-poll waiters', async () => {
    let resolved = false;
    const pollPromise = service.poll({ since: 0, timeoutMs: 25_000 }).then((res) => {
      resolved = true;
      return res;
    });

    service.emitDbChange({
      table: 'subscriptions',
      action: 'INSERT',
      id: 'sub-1',
      timestamp: 1000,
    });
    service.emitDbChange({
      table: 'subscriptions',
      action: 'UPDATE',
      id: 'sub-2',
      timestamp: 1010,
    });
    service.emitDbChange({
      table: 'member_profiles',
      action: 'INSERT',
      id: 'mem-1',
      timestamp: 1020,
    });

    await Promise.resolve();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(COALESCE_WINDOW_MS);

    const firstResult = await pollPromise;
    expect(resolved).toBe(true);
    expect(firstResult).toEqual({
      cursor: 1,
      reset: false,
      events: [
        {
          table: 'subscriptions',
          action: 'UPDATE',
          id: 'sub-2',
          timestamp: 1010,
          seq: 1,
        },
      ],
    });

    const secondResult = await service.poll({
      since: firstResult.cursor,
      timeoutMs: 25_000,
    });
    expect(secondResult).toEqual({
      cursor: 2,
      reset: false,
      events: [
        {
          table: 'member_profiles',
          action: 'INSERT',
          id: 'mem-1',
          timestamp: 1020,
          seq: 2,
        },
      ],
    });
  });

  it('publishes users:DELETE immediately without waiting for coalesce window', async () => {
    const pollPromise = service.poll({ since: 0, timeoutMs: 25_000 });

    service.emitDbChange({
      table: 'users',
      action: 'DELETE',
      id: 'user-42',
      timestamp: 2000,
    });

    const result = await pollPromise;
    expect(result).toEqual({
      cursor: 1,
      reset: false,
      events: [
        {
          table: 'users',
          action: 'DELETE',
          id: 'user-42',
          timestamp: 2000,
          seq: 1,
        },
      ],
    });
  });

  it('returns buffered events immediately when since is behind current cursor', async () => {
    service.emitDbChange({
      table: 'subscriptions',
      action: 'INSERT',
      id: 'sub-1',
      timestamp: 1000,
    });
    jest.advanceTimersByTime(COALESCE_WINDOW_MS);

    service.emitDbChange({
      table: 'class_bookings',
      action: 'INSERT',
      id: 'book-1',
      timestamp: 1100,
    });
    jest.advanceTimersByTime(COALESCE_WINDOW_MS);

    const response = await service.poll({ since: 1, timeoutMs: 25_000 });
    expect(response).toEqual({
      cursor: 2,
      reset: false,
      events: [
        {
          table: 'class_bookings',
          action: 'INSERT',
          id: 'book-1',
          timestamp: 1100,
          seq: 2,
        },
      ],
    });
  });

  it('holds open until timeoutMs and resolves with empty events when no changes occur', async () => {
    let resolved = false;
    const pollPromise = service.poll({ since: 0, timeoutMs: 5_000 }).then((res) => {
      resolved = true;
      return res;
    });

    jest.advanceTimersByTime(4_999);
    await Promise.resolve();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(1);
    const result = await pollPromise;
    expect(resolved).toBe(true);
    expect(result).toEqual({
      cursor: 0,
      events: [],
      reset: false,
    });
  });

  it('returns immediately without waiting when timeoutMs is 0', async () => {
    const result = await service.poll({ since: 0, timeoutMs: 0 });
    expect(result).toEqual({
      cursor: 0,
      events: [],
      reset: false,
    });
  });

  it('sets reset=true when since is ahead of cursor or older than retained history', async () => {
    const aheadResponse = await service.poll({ since: 10, timeoutMs: 25_000 });
    expect(aheadResponse).toEqual({
      cursor: 0,
      events: [],
      reset: true,
    });

    for (let i = 1; i <= MAX_EVENT_HISTORY + 5; i += 1) {
      service.emitDbChange({
        table: 'users',
        action: 'DELETE',
        id: `user-${i}`,
        timestamp: 1000 + i,
      });
    }

    const staleResponse = await service.poll({ since: 1, timeoutMs: 25_000 });
    expect(staleResponse.cursor).toBe(MAX_EVENT_HISTORY + 5);
    expect(staleResponse.reset).toBe(true);
    expect(staleResponse.events).toHaveLength(MAX_EVENT_HISTORY);
    expect(staleResponse.events[0].seq).toBe(6);
  });

  it('resolves and cleans up waiter when AbortSignal aborts', async () => {
    const abortController = new AbortController();
    const pollPromise = service.poll({
      since: 0,
      timeoutMs: 25_000,
      signal: abortController.signal,
    });

    abortController.abort();
    const result = await pollPromise;
    expect(result).toEqual({
      cursor: 0,
      events: [],
      reset: false,
    });
  });

  it('resolves pending waiters when onModuleDestroy is called', async () => {
    const pollPromise = service.poll({ since: 0, timeoutMs: 25_000 });

    service.onModuleDestroy();
    const result = await pollPromise;
    expect(result).toEqual({
      cursor: 0,
      events: [],
      reset: false,
    });
  });
});
