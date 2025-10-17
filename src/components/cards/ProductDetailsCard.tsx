// src/components/cards/ProductDetailsCard.tsx
import { useState, useEffect } from 'react';
import { ProductItem, productService } from '../../service/productDetailsService';
import Badge from "../ui/badge/Badge";

interface ProductDetailsCardProps {
  productId?: string;
}

export default function ProductDetailsCard({ productId }: ProductDetailsCardProps) {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetProductId = productId || "1";

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductosbyId(targetProductId);
        
        console.log('Datos recibidos de la API:', data); // 👈 DEBUG IMPORTANTE
        
        const safeProduct = {
          ...data,
          sucursales: data.sucursales || []
        };
        
        setProduct(safeProduct);
      } catch (err) {
        setError('Error al cargar los detalles del producto');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [targetProductId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontró el producto
      </div>
    );
  }

  const sucursales = product.sucursales || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{product.nombre}</h1>
              <p className="text-blue-100 mt-1">ID: {product.id_producto}</p>
            </div>
            <Badge
              color={product.estado ? "success" : "error"}
            >
              {product.estado ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda */}
            <div className="lg:col-span-1">
              {/* Imagen */}
                <img 
                // src={product.imagen_url} //
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNiPm3mUfNgg_S0TE_LLonb_Hcemsibyej3w&s'
                alt={product.nombre}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                    // Fallback si la imagen no carga
                    e.currentTarget.style.display = 'none';
                }}
                />
              {/* Información de Precio */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Precio Unitario</span>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    Q {product.precio_unitario }
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="lg:col-span-2">
              {/* Descripción */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.descripcion || 'Sin descripción disponible'}
                </p>
              </div>

              {/* Sucursales - CON MANEJO SEGURO */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Disponibilidad en Sucursales
                  <span className="ml-2 text-sm text-gray-500">
                    ({sucursales.length} sucursales)
                  </span>
                </h3>

                {sucursales.length > 0 ? (
                  <div className="space-y-4">
                    {sucursales.map((sucursal) => (
                      <div
                        key={sucursal.id_sucursal_producto || sucursal.id_sucursal}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {sucursal.nombre || 'Sucursal sin nombre'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {sucursal.direccion || 'Sin dirección'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              📞 {sucursal.telefono || 'Sin teléfono'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {sucursal.cantidad_disponible || 0} unidades
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {sucursal.id_sucursal_producto || sucursal.id_sucursal}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No disponible en ninguna sucursal
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Product ID: {product.id_producto}</span>
            <span>Estado: {product.estado ? 'Activo' : 'Inactivo'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}