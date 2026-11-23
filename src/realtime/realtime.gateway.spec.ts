import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { RealtimeGateway } from './realtime.gateway';

describe('RealtimeGateway', () => {
  let gateway: RealtimeGateway;
  let jwtService: { verifyAsync: jest.Mock };
  let serverEmitMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jwtService = {
      verifyAsync: jest.fn(),
    };
    serverEmitMock = jest.fn();
    gateway = new RealtimeGateway(jwtService as unknown as JwtService);
    gateway.server = { emit: serverEmitMock } as unknown as Server;
  });

  afterEach(() => {
    gateway.onModuleDestroy();
    jest.useRealTimers();
  });

  it('rejects socket without token during handshake', async () => {
    const client = {
      id: 'sock-1',
      handshake: { auth: {}, headers: {} },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('auth_error', {
      message: 'Token no proporcionado',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('rejects socket with invalid JWT and accepts valid JWT', async () => {
    jwtService.verifyAsync.mockRejectedValueOnce(new Error('invalid'));
    const badClient = {
      id: 'sock-bad',
      handshake: { auth: { token: 'bad' }, headers: {} },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    await gateway.handleConnection(badClient);
    expect(badClient.disconnect).toHaveBeenCalledWith(true);

    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-1',
      email: 'admin@gym.com',
      role: 'admin',
    });
    const goodClient = {
      id: 'sock-good',
      handshake: { auth: { token: 'valid' }, headers: {} },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    await gateway.handleConnection(goodClient);
    expect(goodClient.disconnect).not.toHaveBeenCalled();
    expect(goodClient.data.user).toEqual({
      sub: 'user-1',
      email: 'admin@gym.com',
      role: 'admin',
    });
  });

  it('coalesces rapid events per table within 80ms while keeping separate tables distinct', () => {
    gateway.emitDbChange({
      table: 'subscriptions',
      action: 'INSERT',
      id: 'sub-1',
      timestamp: 1000,
    });
    gateway.emitDbChange({
      table: 'subscriptions',
      action: 'UPDATE',
      id: 'sub-2',
      timestamp: 1010,
    });
    gateway.emitDbChange({
      table: 'member_profiles',
      action: 'INSERT',
      id: 'mem-1',
      timestamp: 1020,
    });

    expect(serverEmitMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(80);

    expect(serverEmitMock).toHaveBeenCalledTimes(2);
    expect(serverEmitMock).toHaveBeenCalledWith('db:change', {
      table: 'subscriptions',
      action: 'UPDATE',
      id: 'sub-2',
      timestamp: 1010,
    });
    expect(serverEmitMock).toHaveBeenCalledWith('db:change', {
      table: 'member_profiles',
      action: 'INSERT',
      id: 'mem-1',
      timestamp: 1020,
    });
  });
});
