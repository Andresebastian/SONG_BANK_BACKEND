// event.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/event.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from '../auth/auth.module';
import { RolModule } from '../rols/rol.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolModule),
    forwardRef(() => UsersModule),
  ],
  exports: [EventService],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
