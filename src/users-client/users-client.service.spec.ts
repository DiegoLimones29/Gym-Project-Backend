import {
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersClientService } from './users-client.service';

describe('UsersClientService', () => {
  let service: UsersClientService;
  const originalFetch = global.fetch;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;

    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'USERS_SERVICE_URL') return 'http://users-service:3001/';
        if (key === 'INTERNAL_API_KEY') return 'internal-key-123';
        return undefined;
      }),
    } as unknown as ConfigService;

    service = new UsersClientService(configService);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('deduplicates IDs and returns a map in findUsersByIds', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          data: [
            {
              id: 'u-1',
              firstName: 'Ana',
              lastName: 'Gómez',
              email: 'ana@gym.com',
              roleId: 1,
            },
          ],
        }),
    });

    const result = await service.findUsersByIds(['u-1', ' u-1 ', null, undefined]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://users-service:3001/internal/users/batch',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-internal-api-key': 'internal-key-123',
        }),
        body: JSON.stringify({ ids: ['u-1'] }),
      }),
    );
    expect(result.get('u-1')?.email).toBe('ana@gym.com');
  });

  it('returns empty map gracefully if users-service fails during hydration', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));

    const result = await service.findUsersByIds(['u-1']);
    expect(result.size).toBe(0);
  });

  it('assertUsersExist passes when all IDs exist and throws NotFoundException when missing', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ data: [{ id: 'u-1' }] }),
    });
    await expect(service.assertUsersExist(['u-1'])).resolves.toBeUndefined();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ data: [{ id: 'u-1' }] }),
    });
    await expect(
      service.assertUsersExist(['u-1', 'u-missing']),
    ).rejects.toThrow(NotFoundException);
  });

  it('assertUsersExist throws ServiceUnavailableException when service is unreachable', async () => {
    fetchMock.mockRejectedValue(new Error('network error'));

    await expect(service.assertUsersExist(['u-1'])).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('forwards HTTP error status and body from users-service', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      statusText: 'Conflict',
      text: async () => JSON.stringify({ message: 'Correo duplicado' }),
    });

    await expect(
      service.createUser(
        {
          email: 'dup@gym.com',
          password: 'secret',
          firstName: 'Test',
          lastName: 'User',
          roleId: 1,
        },
        'Bearer abc',
      ),
    ).rejects.toMatchObject({
      status: 409,
    });

    try {
      await service.login({ email: 'a@b.com', password: '123' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(409);
    }
  });
});
