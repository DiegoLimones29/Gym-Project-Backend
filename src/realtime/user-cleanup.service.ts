import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(private readonly dataSource: DataSource) {}

  async cleanupForDeletedUser(userId: string): Promise<void> {
    if (!userId || !this.dataSource.isInitialized) {
      return;
    }

    try {
      await this.dataSource.query(
        'DELETE FROM member_profiles WHERE user_id = $1',
        [userId],
      );
      await this.dataSource.query(
        'DELETE FROM workers_profiles WHERE user_id = $1',
        [userId],
      );
      await this.dataSource.query(
        'DELETE FROM fitness_assessments WHERE member_id = $1',
        [userId],
      );
      await this.dataSource.query(
        'DELETE FROM workout_plans WHERE member_id = $1',
        [userId],
      );
    } catch (error) {
      this.logger.warn(
        `Error limpiando registros asociados al usuario eliminado ${userId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
