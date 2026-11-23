import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LoginDto } from '../auth/dto/login.dto';
import type { CreateRoleDto } from '../role/dto/create-role.dto';
import type { UpdateRoleDto } from '../role/dto/update-role.dto';
import type { CreateUserDto } from '../user/dto/create-user.dto';
import type { UpdateUserDto } from '../user/dto/update-user.dto';
import type { PublicUser } from './users-client.types';

@Injectable()
export class UsersClientService {
  private readonly logger = new Logger(UsersClientService.name);

  constructor(private readonly configService: ConfigService) {}

  private getBaseUrl(): string {
    const raw =
      this.configService.get<string>('USERS_SERVICE_URL')?.trim() ||
      'http://localhost:3001';
    return raw.replace(/\/+$/, '');
  }

  private getInternalApiKey(): string {
    return this.configService.get<string>('INTERNAL_API_KEY')?.trim() || '';
  }

  private getTimeoutMs(): number {
    const raw = Number(
      this.configService.get<string>('USERS_SERVICE_TIMEOUT_MS'),
    );
    return Number.isFinite(raw) && raw > 0 ? raw : 45000;
  }

  private async request<T>(
    path: string,
    options: {
      method?: string;
      body?: unknown;
      authHeader?: string;
      internal?: boolean;
    } = {},
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${path}`;
    const headers: Record<string, string> = {};

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (options.authHeader) {
      headers.Authorization = options.authHeader;
    }
    if (options.internal) {
      headers['x-internal-api-key'] = this.getInternalApiKey();
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body:
          options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(this.getTimeoutMs()),
      });
    } catch (error) {
      this.logger.error(
        `Error conectando con users-service (${options.method ?? 'GET'} ${path}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new ServiceUnavailableException(
        'El microservicio de usuarios no está disponible',
      );
    }

    const rawText = await response.text();
    let parsedBody: unknown = null;
    if (rawText) {
      try {
        parsedBody = JSON.parse(rawText);
      } catch {
        parsedBody = rawText;
      }
    }

    if (!response.ok) {
      throw new HttpException(
        (parsedBody as string | Record<string, any>) || response.statusText,
        response.status,
      );
    }

    return parsedBody as T;
  }

  login(dto: LoginDto) {
    return this.request('/auth/login', {
      method: 'POST',
      body: dto,
    });
  }

  createUser(dto: CreateUserDto, authHeader?: string) {
    return this.request('/users', {
      method: 'POST',
      body: dto,
      authHeader,
    });
  }

  findAllUsers(authHeader?: string) {
    return this.request('/users', {
      method: 'GET',
      authHeader,
    });
  }

  findOneUser(id: string, authHeader?: string) {
    return this.request(`/users/${encodeURIComponent(id)}`, {
      method: 'GET',
      authHeader,
    });
  }

  updateUser(id: string, dto: UpdateUserDto, authHeader?: string) {
    return this.request(`/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: dto,
      authHeader,
    });
  }

  removeUser(id: string, authHeader?: string) {
    return this.request(`/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authHeader,
    });
  }

  findAllRoles() {
    return this.request('/roles', { method: 'GET' });
  }

  findOneRole(id: number) {
    return this.request(`/roles/${id}`, { method: 'GET' });
  }

  createRole(dto: CreateRoleDto, authHeader?: string) {
    return this.request('/roles', {
      method: 'POST',
      body: dto,
      authHeader,
    });
  }

  updateRole(id: number, dto: UpdateRoleDto, authHeader?: string) {
    return this.request(`/roles/${id}`, {
      method: 'PATCH',
      body: dto,
      authHeader,
    });
  }

  removeRole(id: number, authHeader?: string) {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
      authHeader,
    });
  }

  private normalizeIds(ids: (string | null | undefined)[]): string[] {
    return Array.from(
      new Set(
        (ids ?? [])
          .filter((id): id is string => typeof id === 'string')
          .map((id) => id.trim())
          .filter(Boolean),
      ),
    );
  }

  async findUsersByIds(
    ids: (string | null | undefined)[],
  ): Promise<Map<string, PublicUser>> {
    const uniqueIds = this.normalizeIds(ids);
    const usersMap = new Map<string, PublicUser>();

    if (uniqueIds.length === 0) {
      return usersMap;
    }

    try {
      const result = await this.request<{ data?: PublicUser[] }>(
        '/internal/users/batch',
        {
          method: 'POST',
          body: { ids: uniqueIds },
          internal: true,
        },
      );

      for (const user of result?.data ?? []) {
        usersMap.set(user.id, user);
      }
    } catch (error) {
      this.logger.warn(
        `No se pudieron hidratar usuarios desde users-service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return usersMap;
  }

  async assertUsersExist(ids: string[]): Promise<void> {
    const uniqueIds = this.normalizeIds(ids);
    if (uniqueIds.length === 0) {
      return;
    }

    const result = await this.request<{ data?: PublicUser[] }>(
      '/internal/users/batch',
      {
        method: 'POST',
        body: { ids: uniqueIds },
        internal: true,
      },
    );

    const foundIds = new Set((result?.data ?? []).map((user) => user.id));
    for (const id of uniqueIds) {
      if (!foundIds.has(id)) {
        throw new NotFoundException(`Usuario ${id} no encontrado`);
      }
    }
  }
}
