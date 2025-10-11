import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { DirectionService } from './direction.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from '../rols/schema/rol.schema';

@Controller('directions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post()
  @Roles(PermissionType.DIRECTION_CREATE)
  create(@Body() createDirectionDto: CreateDirectionDto, @Request() req) {
    return this.directionService.create(createDirectionDto, req.user.userId);
  }

  @Get()
  @Roles(PermissionType.DIRECTION_VIEW)
  findAll(@Query('directorId') directorId?: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (directorId) {
      return this.directionService.findByDirector(directorId);
    }
    if (startDate && endDate) {
      return this.directionService.findByDateRange(startDate, endDate);
    }
    return this.directionService.findAll();
  }

  @Get(':id')
  @Roles(PermissionType.DIRECTION_VIEW)
  findOne(@Param('id') id: string) {
    return this.directionService.findOne(id);
  }

  @Patch(':id')
  @Roles(PermissionType.DIRECTION_EDIT)
  update(@Param('id') id: string, @Body() updateDirectionDto: UpdateDirectionDto, @Request() req) {
    return this.directionService.update(id, updateDirectionDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(PermissionType.DIRECTION_DELETE)
  remove(@Param('id') id: string) {
    return this.directionService.remove(id);
  }
}
