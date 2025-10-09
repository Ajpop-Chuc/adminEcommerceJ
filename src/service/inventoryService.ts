// src/services/inventoryService.ts
import { apiService } from './api';

export interface InventoryItem {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  estado: boolean;
  cantidad_total: string;
}

export const inventoryService = {
  // Obtener todo el inventario
  async getProductosCantidades(): Promise<InventoryItem[]> {
    return apiService.get('/productos/productos_cantidades');
  }
};