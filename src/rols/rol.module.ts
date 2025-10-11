import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { Rol, RolSchema } from './schema/rol.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rol.name, schema: RolSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolService],
})
export class RolModule {}
