// src/components/cards/ProductTransferCard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sucursal, sucursalService } from '../../service/sucursalService';
import { transferService } from '../../service/transferService';
import Badge from "../ui/badge/Badge";

interface ProductTransferCardProps {
  id_producto: string;
  id_sucursal: string;
  cantidad_disponible: string;
}

export default function ProductTransferCard({ 
  id_producto, 
  id_sucursal, 
  cantidad_disponible 
}: ProductTransferCardProps) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalDestino, setSucursalDestino] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // Cargar sucursales para el destino
  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        setLoading(true);
        const data = await sucursalService.getSucursales();
        
        // ✅ GUARDAR todas las sucursales, no filtrar
        setSucursales(data);
      } catch (err) {
        setError('Error al cargar las sucursales');
        console.error('Error loading branches:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarSucursales();
  }, [id_sucursal]);

  // ✅ Buscar sucursal de origen en TODAS las sucursales
  const sucursalOrigen = sucursales.find(s => s.id_sucursal == id_sucursal);
  
  // ✅ Filtrar solo para el select de destino
  const sucursalesDestino = sucursales.filter(s => s.id_sucursal != id_sucursal);

  const handleTransfer = async () => {
    if (!sucursalDestino || !cantidad) {
      setError('Por favor completa todos los campos');
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError('La cantidad debe ser un número mayor a 0');
      return;
    }

    if (cantidadNum > parseInt(cantidad_disponible)) {
      setError(`No puedes transferir más de ${cantidad_disponible} unidades`);
      return;
    }

    try {
      setTransferLoading(true);
      setError(null);
      
      await transferService.realizarTraslado(
        id_producto,
        id_sucursal,
        sucursalDestino,
        cantidadNum
      );

      setSuccess(`¡Traslado exitoso! Se transfirieron ${cantidadNum} unidades.`);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(-1); // Volver a la página anterior
      }, 2000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al realizar el traslado';
      setError(errorMessage);
      console.error('Transfer error:', err);
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Transferir Producto</h1>
          <p className="text-orange-100 mt-1">ID Producto: {id_producto}</p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información del Producto */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Información del Producto
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 dark:text-blue-400">ID:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">{id_producto}</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Stock Disponible:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100 font-bold">
                  {cantidad_disponible} unidades
                </span>
              </div>
            </div>
          </div>

          {/* Sucursal de Origen */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sucursal de Origen
            </label>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {sucursalOrigen?.nombre || 'Sucursal no encontrada'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {sucursalOrigen?.direccion || 'Sin dirección'}
                  </p>
                </div>
                <Badge color="info">
                  Origen
                </Badge>
              </div>
            </div>
          </div>

          {/* Sucursal de Destino */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sucursal de Destino *
            </label>
            <select
              value={sucursalDestino}
              onChange={(e) => setSucursalDestino(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Selecciona una sucursal destino</option>
              {sucursalesDestino.map((sucursal) => ( // ✅ Usar sucursalesDestino filtradas
                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                  {sucursal.nombre} - {sucursal.direccion}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad a Transferir */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad a Transferir *
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              max={cantidad_disponible}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={`Máximo: ${cantidad_disponible} unidades`}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Máximo disponible: {cantidad_disponible} unidades
            </p>
          </div>

          {/* Mensajes de Error y Éxito */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
              <p className="text-sm mt-1">Redirigiendo en 2 segundos...</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition-colors"
              disabled={transferLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleTransfer}
              disabled={transferLoading || !sucursalDestino || !cantidad}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {transferLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                'Realizar Traslado'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}