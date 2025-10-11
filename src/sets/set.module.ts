import { Module, forwardRef } from '@nestjs/common';
import { SetsService } from './set.service';
import { SetsController } from './set.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Set, SetSchema } from './schema/set.schema';
import { AuthModule } from '../auth/auth.module';
import { RolModule } from '../rols/rol.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Set.name, schema: SetSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolModule),
  ],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetModule {}
