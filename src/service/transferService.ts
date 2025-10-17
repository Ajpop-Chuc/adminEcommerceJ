import { apiService } from './api';

export interface TransferResponse {
  message: string;
  detalles: {
    producto_id: string;
    desde_sucursal: string;
    hacia_sucursal: string;
    cantidad_trasladada: number;
  };
}

export const transferService = {
  async realizarTraslado(
    id_producto: string, 
    id_origen: string, 
    id_destino: string, 
    cantidad: number
  ): Promise<TransferResponse> {
    return await apiService.put(
      `/sucursal-productos/trasladarProductos/${id_producto}/${id_origen}/${id_destino}/${cantidad}`,
      {}
    );
  }
};