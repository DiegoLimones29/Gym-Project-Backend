import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { WorkerProfileModule } from './worker_profile/worker_profile.module';
import { MembersProfileModule } from './members_profile/members_profile.module';
import { FitnessAssessmentModule } from './fitness_assessment/fitness_assessment.module';
import { MembershipPlanModule } from './membership_plan/membership_plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ExerciseCatalogModule } from './exercise_catalog/exercise_catalog.module';
import { RoutineExerciseModule } from './routine_exercise/routine_exercise.module';
import { WorkoutPlanModule } from './workout_plan/workout_plan.module';
import { FitnessClassModule } from './fitness_class/fitness_class.module';
import { ClassScheduleModule } from './class_schedule/class_schedule.module';
import { ClassBookingModule } from './class_booking/class_booking.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', 
        host: configService.get<string>('DB_HOST'), 
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, 
        synchronize: false, 
        ssl: {
          rejectUnauthorized: false
        }
      })
    }),
    UserModule, RoleModule, WorkerProfileModule, MembersProfileModule, FitnessAssessmentModule, MembershipPlanModule, SubscriptionModule, ExerciseCatalogModule, RoutineExerciseModule, WorkoutPlanModule, FitnessClassModule, ClassScheduleModule, ClassBookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
