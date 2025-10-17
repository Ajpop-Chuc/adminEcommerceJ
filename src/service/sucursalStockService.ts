import { apiService } from './api';

export interface sucursalStockItem {
  id_sucursal: number; 
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
  productos: productoItem[];
}

export interface productoItem {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: string;
  estado: boolean;
  cantidad_disponible: number;
  id_sucursal_producto: number;
}

export const sucursalStockService = {
  // Obtener todo el inventario
  async getProductosCantidades(): Promise<sucursalStockItem[]> {
    return await apiService.get('/sucursal-productos/producto_sucursales');
  } 
};