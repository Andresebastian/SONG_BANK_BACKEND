import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolService } from '../rols/rol.service';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(private readonly rolService: RolService) {}

  async onModuleInit() {
    try {
      // Crear roles predefinidos si no existen
      await this.rolService.createPredefinedRoles('system');
      console.log('✅ Roles predefinidos inicializados correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar roles predefinidos:', error);
    }
  }
}
