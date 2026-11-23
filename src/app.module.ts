import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClassBookingModule } from './class_booking/class_booking.module';
import { ClassScheduleModule } from './class_schedule/class_schedule.module';
import { getTypeOrmOptions } from './database/db-config';
import { ExerciseCatalogModule } from './exercise_catalog/exercise_catalog.module';
import { FitnessAssessmentModule } from './fitness_assessment/fitness_assessment.module';
import { FitnessClassModule } from './fitness_class/fitness_class.module';
import { MembersProfileModule } from './members_profile/members_profile.module';
import { MembershipPlanModule } from './membership_plan/membership_plan.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RoleModule } from './role/role.module';
import { RoutineExerciseModule } from './routine_exercise/routine_exercise.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';
import { UsersClientModule } from './users-client/users-client.module';
import { WorkerProfileModule } from './worker_profile/worker_profile.module';
import { WorkoutPlanModule } from './workout_plan/workout_plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmOptions(configService),
    }),
    UsersClientModule,
    RealtimeModule,
    UserModule,
    RoleModule,
    WorkerProfileModule,
    MembersProfileModule,
    FitnessAssessmentModule,
    MembershipPlanModule,
    SubscriptionModule,
    ExerciseCatalogModule,
    RoutineExerciseModule,
    WorkoutPlanModule,
    FitnessClassModule,
    ClassScheduleModule,
    ClassBookingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
