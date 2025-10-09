import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaInfoCircle, FaEllipsisH } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

import { InventoryItem, inventoryService } from '../../../service/inventoryService';

export default function GeneralInventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getProductosCantidades();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el inventario');
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando inventario...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button 
          onClick={loadInventory}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Nombre
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Descripción
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Precio Unitario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Existencias Totales
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90"
                >
                  Acciones 
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {inventory.map((item) => (
                <TableRow key={item.id_producto}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {item.id_producto}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.nombre}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.descripcion}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Q {item.precio_unitario}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.cantidad_total}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        item.estado === true
                          ? "success"
                          : "error"
                      }
                    >
                      {item.estado === true ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                 <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center space-x-3">
                        <button 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                        >
                        <FaEdit />
                        </button>
                        <button 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                        >
                        <FaTrash />
                        </button>
                        <button 
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Detalles"
                        >
                        <FaEye />
                        </button>
                        <button 
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Más opciones"
                        >
                        <FaEllipsisH />
                        </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
