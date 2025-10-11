import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectionService } from './direction.service';
import { DirectionController } from './direction.controller';
import { Direction, DirectionSchema } from './schema/direction.schema';
import { AuthModule } from '../auth/auth.module';
import { RolModule } from '../rols/rol.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Direction.name, schema: DirectionSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolModule),
  ],
  controllers: [DirectionController],
  providers: [DirectionService],
  exports: [DirectionService],
})
export class DirectionModule {}
