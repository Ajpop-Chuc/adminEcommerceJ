import { apiService } from "./api";

// Interfaz para el tipo de dato de Rol
export interface Rol {
  id_rol: number;
  nombre: string;
  estado: boolean;
  descripcion: string;
}   
export const rolesService = {
  // Obtener todos los roles
  async getRoles(): Promise<Rol[]> {
    return apiService.get('/auth/roles');
    }
};