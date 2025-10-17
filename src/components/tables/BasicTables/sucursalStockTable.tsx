import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaEdit, FaExchangeAlt } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { sucursalStockItem, sucursalStockService } from '../../../service/sucursalStockService';

interface SucursalStockTableProps {
  id_sucursal?: string;
}

export default function SucursalStockTable({ id_sucursal }: SucursalStockTableProps) {
  const [sucursalStock, setSucursalStock] = useState<sucursalStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(id_sucursal!=""){
    loadInventory();
    }
  }, [id_sucursal]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await sucursalStockService.getProductosCantidades();
      setSucursalStock(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el inventario');
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  }; 

  // CONVERTIR id_sucursal (string) a number para comparar
  const idSucursalNumber = id_sucursal ? parseInt(id_sucursal, 10) : null;

  const filteredStock = idSucursalNumber 
    ? sucursalStock.filter(item => item.id_sucursal === idSucursalNumber)
    : sucursalStock;

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
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  ID Producto
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Nombre
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Descripción
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Precio Unitario
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Existencias
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Estado
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-dark text-start text-theme-s dark:text-white/90">
                  Acciones 
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredStock.length > 0 ? (
                filteredStock.map((sucursal, sucursalIndex) => (
                  sucursal.productos.map((producto, productIndex) => (
                    <TableRow key={`${sucursal.id_sucursal}-${producto.id_producto}-${productIndex}`}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {producto.id_producto}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {producto.nombre}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {producto.descripcion}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        Q {parseFloat(producto.precio_unitario).toFixed(2)} {/* Convertir a número para formato */}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {producto.cantidad_disponible}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge
                          size="sm"
                          color={producto.estado ? "info" : "error"}
                        >
                          {producto.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center space-x-3">
                          <Link
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                            to="/TailAdmin/"
                          >
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Editar" >
                                <FaEdit />
                            </button>
                          </Link>                       

                          <Link
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                            to={`/TailAdmin/product-transfer/${producto.id_producto}/${id_sucursal}/${producto.cantidad_disponible}`}
                          >
                            <button className="p-2 text-green-800 hover:bg-green-100 rounded-lg transition-colors" title="Trasladar" >
                                <FaExchangeAlt />
                            </button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500">
                    {id_sucursal 
                      ? `No hay productos disponibles en la sucursal seleccionada` 
                      : 'No hay productos disponibles'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}