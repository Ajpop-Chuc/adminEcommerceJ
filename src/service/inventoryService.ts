// src/services/inventoryService.ts
import { apiService } from './api';
import { ProductItem } from './productDetailsService';

export interface InventoryItem {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  estado: boolean;
  cantidad_total: string;
  imagen_url: string | null;
}

export interface NewProductData {
  nombre: string;
  descripcion: string;
  precio_unitario: number;
}

export const inventoryService = {
  // Obtener todo el inventario
  async getProductosCantidades(): Promise<InventoryItem[]> {
    return await apiService.get('/productos/productos_cantidades');
  },

  async createProduct(productData: FormData): Promise<any> {
    // Usamos FormData para poder enviar archivos (la imagen)
    // no se usa apiService.post porque necesitamos enviar FormData sin convertir a JSON, si que se usa request directamente
    return await apiService.request('/productos', {
      method: 'POST',
      body: productData,
    });
  },

  // usa la ruta que solo devuelve el producto
  async getProductoById(id: string): Promise<ProductItem> {
    return await apiService.get(`/productos/${id}`);
  },

  // Funcion para actualizar un producto existente
  async updateProduct(id: string, productData: FormData): Promise<any> {
    return await apiService.request(`/productos/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  // funcion para obtener productos deshabilitados
  async getDisabledProducts(): Promise<InventoryItem[]> {
    return await apiService.get('/productos/desactivados_cantidades');
  },

  // funcion para activar un producto
  async activateProduct(id: string): Promise<any> {
    // Esta ruta SÍ espera JSON, así que usamos el 'post' o 'put' de apiService
    // (Crearemos un 'patch' en apiService para ser correctos)
    return await apiService.patch(`/productos/${id}/status`, { estado: true });
  },

  // funcion para desactivar un producto
  async deactivateProduct(id: string): Promise<any> {
    return await apiService.patch(`/productos/${id}/status`, { estado: false });
  }
};