import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa'; 
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { InventoryItem, inventoryService } from '../../../service/inventoryService';
import { Link } from 'react-router-dom';
import Input from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


export default function DisabledInventoryTable() {
  const [allInventory, setAllInventory] = useState<InventoryItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, []);

  // useffect que se ejecuta cuando cambia el search term
  useEffect(() => {
    if (searchTerm === '') {
      setInventory(allInventory); // Si no hay búsqueda, muestra todo
    } else {
      // Filtra la lista maestra
      const filtered = allInventory.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInventory(filtered); // Muestra solo los resultados filtrados
    }
  }, [searchTerm, allInventory]); // Se re-ejecuta si la búsqueda o la lista maestra cambian

  const loadInventory = async () => {
    try {
      setLoading(true);
      // 1. Llama a la nueva función del servicio
      const data = await inventoryService.getDisabledProducts(); 
      setAllInventory(data); // Guarda la lista maestra
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el inventario desactivado');
      console.error('Error loading disabled inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para manejar la ACTIVACIÓN
  const handleActivate = async (id: number) => {
  const result = await Swal.fire({
    title: "¿Reactivar producto?",
    text: "¿Estás seguro de que deseas reactivar este producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, reactivar",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      await inventoryService.activateProduct(id.toString());

      await Swal.fire({
        title: "¡Producto activado!",
        text: "El producto se ha reactivado con éxito.",
        icon: "success",
        confirmButtonText: "OK"
      });

      loadInventory();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al reactivar el producto.",
        icon: "error"
      });
      console.error(error);
    }
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
    <>
      {/* Botón para Agregar Producto */}
      <div className="flex justify-between items-center mb-4">
        {/* Lado Izquierdo: El Buscador */}
        <div className="w-full md:w-1/2">
          <Input
            type="text"
            placeholder="Buscar por nombre de producto..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Contenedor para alinear los botones */}
        <div className="flex gap-3">
          
          {/* Boton para regresar al inventario" */}
          <Button type="button" variant="primary" onClick={() => navigate('/TailAdmin/general-inventory')}>
            Regresar
          </Button>
        </div>
      </div>
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
                    <Badge size="sm" color="error">
                      Inactivo
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center space-x-3">
                      {/* 3. Botón de ACTIVAR */}
                      <button 
                        onClick={() => handleActivate(item.id_producto)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                        title="Reactivar Producto"
                      >
                        <FaCheck />
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
    </>
  );
}