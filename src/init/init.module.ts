import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { RolModule } from '../rols/rol.module';

@Module({
  imports: [RolModule],
  providers: [InitService],
})
export class InitModule {}
