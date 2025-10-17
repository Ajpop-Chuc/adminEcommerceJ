// src/services/sucursalService.ts
import { apiService } from './api';

export interface Sucursal {
  id_sucursal: string;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: Boolean;
}

export const sucursalService = {
  async getSucursales(): Promise<Sucursal[]> {
    return await apiService.get('/sucursales/');
  },
};