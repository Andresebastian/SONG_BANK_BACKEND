import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './schema/song.schema';
import { SongsService } from './song.service';
import { SongsController } from './song.controller';
import { ChordProParserService } from './services/chordpro-parser.service';
import { AuthModule } from '../auth/auth.module';
import { RolModule } from '../rols/rol.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolModule),
  ],
  controllers: [SongsController],
  providers: [SongsService, ChordProParserService],
  exports: [SongsService],
})
export class SongModule {}
