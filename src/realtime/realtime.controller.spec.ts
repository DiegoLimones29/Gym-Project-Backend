import { EventEmitter } from 'node:events';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import type { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
import type { RealtimePollResponse } from './realtime.types';

class MockResponse extends EventEmitter {
  writableEnded = false;
}

describe('RealtimeController', () => {
  let controller: RealtimeController;
  let pollMock: jest.Mock;

  beforeEach(async () => {
    pollMock = jest.fn();

    const moduleRef = await Test.createTestingModule({
      controllers: [RealtimeController],
      providers: [
        {
          provide: RealtimeService,
          useValue: { poll: pollMock },
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
      ],
    }).compile();

    controller = moduleRef.get(RealtimeController);
  });

  it('applies AuthGuard on RealtimeController', () => {
    const guards = Reflect.getMetadata('__guards__', RealtimeController) as
      | unknown[]
      | undefined;
    expect(guards).toBeDefined();
    expect(guards).toContain(AuthGuard);
  });

  it('rejects invalid since or timeout query parameters with BadRequestException', async () => {
    const res = new MockResponse();

    await expect(
      controller.poll('abc', undefined, res as unknown as Response),
    ).rejects.toThrow(BadRequestException);

    await expect(
      controller.poll('-1', undefined, res as unknown as Response),
    ).rejects.toThrow(BadRequestException);

    await expect(
      controller.poll('0', 'not-a-number', res as unknown as Response),
    ).rejects.toThrow(BadRequestException);

    await expect(
      controller.poll('0', '-500', res as unknown as Response),
    ).rejects.toThrow(BadRequestException);

    expect(pollMock).not.toHaveBeenCalled();
  });

  it('parses valid query params, delegates AbortSignal, and cleans up close listener', async () => {
    const res = new MockResponse();
    const expected: RealtimePollResponse = {
      cursor: 12,
      events: [],
      reset: false,
    };
    pollMock.mockResolvedValueOnce(expected);

    const result = await controller.poll(
      '12',
      '25000',
      res as unknown as Response,
    );

    expect(result).toEqual(expected);
    expect(pollMock).toHaveBeenCalledTimes(1);
    const callArg = pollMock.mock.calls[0][0] as {
      since?: number;
      timeoutMs?: number;
      signal: AbortSignal;
    };
    expect(callArg.since).toBe(12);
    expect(callArg.timeoutMs).toBe(25000);
    expect(callArg.signal.aborted).toBe(false);
    expect(res.listenerCount('close')).toBe(0);
  });

  it('aborts signal when client disconnects before response finishes', async () => {
    const res = new MockResponse();
    let capturedSignal: AbortSignal | undefined;

    pollMock.mockImplementationOnce(
      ({ signal }: { signal: AbortSignal }) =>
        new Promise<RealtimePollResponse>((resolve) => {
          capturedSignal = signal;
          signal.addEventListener('abort', () => {
            resolve({ cursor: 0, events: [], reset: false });
          });
        }),
    );

    const pending = controller.poll(
      '0',
      '25000',
      res as unknown as Response,
    );

    expect(capturedSignal?.aborted).toBe(false);
    res.emit('close');

    const result = await pending;
    expect(capturedSignal?.aborted).toBe(true);
    expect(result).toEqual({ cursor: 0, events: [], reset: false });
    expect(res.listenerCount('close')).toBe(0);
  });

  it('does not abort signal on close when response has already ended', async () => {
    const res = new MockResponse();
    let capturedSignal: AbortSignal | undefined;
    let resolvePoll!: (value: RealtimePollResponse) => void;

    pollMock.mockImplementationOnce(
      ({ signal }: { signal: AbortSignal }) =>
        new Promise<RealtimePollResponse>((resolve) => {
          capturedSignal = signal;
          resolvePoll = resolve;
        }),
    );

    const pending = controller.poll(
      '0',
      '25000',
      res as unknown as Response,
    );

    res.writableEnded = true;
    res.emit('close');
    expect(capturedSignal?.aborted).toBe(false);

    resolvePoll({ cursor: 1, events: [], reset: false });
    const result = await pending;
    expect(result).toEqual({ cursor: 1, events: [], reset: false });
    expect(res.listenerCount('close')).toBe(0);
  });
});
