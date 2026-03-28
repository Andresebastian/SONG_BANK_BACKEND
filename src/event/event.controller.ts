// event.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth';
import { PermissionType } from '../rols/schema/rol.schema';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(PermissionType.EVENT_CREATE)
  create(@Body() dto: CreateEventDto, @Request() req: RequestWithUser) {
    return this.eventService.create(dto, req.user.userId);
  }

  @Get()
  @Roles(PermissionType.EVENT_VIEW)
  findAllActive() {
    return this.eventService.findAllActive();
  }

  @Get('eventList')
  @Roles(PermissionType.EVENT_VIEW)
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @Roles(PermissionType.EVENT_VIEW)
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Put(':id')
  @Roles(PermissionType.EVENT_EDIT)
  update(@Param('id') id: string, @Body() dto: Partial<CreateEventDto>) {
    return this.eventService.update(id, dto);
  }

  @Delete(':id')
  @Roles(PermissionType.EVENT_DELETE)
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  /** Archivar evento (cambio rápido de estado sin enviar body completo) */
  @Put(':id/archive')
  @Roles(PermissionType.EVENT_EDIT)
  archive(@Param('id') id: string) {
    return this.eventService.update(id, { status: 'archived' });
  }

  /** Enviar notificación push personalizada — solo directores */
  @Post('notifications/send')
  @Roles(PermissionType.EVENT_EDIT)
  sendNotification(@Body() dto: { title: string; body: string }) {
    return this.eventService.sendCustomNotification(dto.title, dto.body);
  }
}
