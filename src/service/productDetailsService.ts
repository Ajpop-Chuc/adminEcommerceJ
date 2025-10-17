// src/services/productService.ts
import { apiService } from './api';

export interface ProductItem {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  estado: boolean;
  sucursales: sucursalItem[];
}

export interface sucursalItem {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  telefono: string;
  cantidad_disponible: number;
  id_sucursal_producto: number;
}

export const productService = {
  // Obtener el producto por ID
  async getProductosbyId(id: string): Promise<ProductItem> {
    return await apiService.get(`/sucursal-productos/sucursal-productos/${id}`);
  } 
};