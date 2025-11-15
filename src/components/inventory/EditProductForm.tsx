import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../service/inventoryService';
import { productService } from '../../service/productDetailsService';
import { Sucursal, sucursalService } from '../../service/sucursalService';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import {IMAGE_BASE_URL} from '../../config/api';
import { FaPlus, FaTrash } from 'react-icons/fa';


interface EditFormProps {
  productId: string;
}

// Define el tipo para un item de stock
interface StockItem {
  sucursal_id_sucursal: string;
  cantidad_disponible: string;
}

export default function EditProductForm({ productId }: EditFormProps) {
  // 1. Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Vista previa de imagen
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //nuenvos estados para el stock
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { sucursal_id_sucursal: '', cantidad_disponible: '' } // Empezamos con una fila
  ]);

  // 2. Cargar datos del producto al montar el componente
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Carga la lista de todas las sucursales (para el dropdown)
        const sucursalesData = await sucursalService.getSucursales();
        setSucursales(sucursalesData);

        // Carga los datos del producto (incluyendo su stock actual)
        const productData = await productService.getProductosbyId(productId);
        
        // Rellena los campos del formulario
        setNombre(productData.nombre);
        setDescripcion(productData.descripcion);
        setPrecio(productData.precio_unitario.toString());
        if (productData.imagen_url) {
          setPreview(`${IMAGE_BASE_URL}/${productData.imagen_url}`);
        }
        
        // Rellena el stock actual del producto
        if (productData.sucursales && productData.sucursales.length > 0) {
          setStockItems(productData.sucursales.map(s => ({
            sucursal_id_sucursal: s.id_sucursal.toString(),
            cantidad_disponible: s.cantidad_disponible.toString()
          })));
        } else {
          // Si no tiene stock, deja la primera fila vacía
          setStockItems([{ sucursal_id_sucursal: sucursalesData[0]?.id_sucursal.toString() || '', cantidad_disponible: '0' }]);
        }

      } catch (err) {
        setError('No se pudieron cargar los datos del producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [productId]);

  // 4. Añade las funciones de manejo de stock (copiadas de CreateProductForm)
  const handleStockChange = (index: number, field: keyof StockItem, value: string) => {
    const newStockItems = [...stockItems];
    newStockItems[index][field] = value;
    setStockItems(newStockItems);
  };

  const addStockItem = () => {
    setStockItems([...stockItems, { sucursal_id_sucursal: '', cantidad_disponible: '' }]);
  };

  const removeStockItem = (index: number) => {
    const newStockItems = [...stockItems];
    newStockItems.splice(index, 1);
    // Si se borran todas, añade una vacía
    if (newStockItems.length === 0) {
      setStockItems([{ sucursal_id_sucursal: '', cantidad_disponible: '' }]);
    } else {
      setStockItems(newStockItems);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const stockValido = stockItems.every(item => item.sucursal_id_sucursal && item.cantidad_disponible && parseFloat(item.cantidad_disponible) >= 0);
    if (!nombre || !descripcion || !precio || !stockValido) {
      setError('Todos los campos, sucursales y cantidades son obligatorios.');
      return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio_unitario', precio);
    
    if (selectedFile) {
      formData.append('imagen', selectedFile);
    }

    // convierte el array de stick a un string JSON
    formData.append('stock_inicial', JSON.stringify(stockItems));

    try {
      // 6. Llama al servicio de ACTUALIZACIÓN
      await inventoryService.updateProduct(productId, formData); 
      alert('¡Producto actualizado exitosamente!');
      navigate('/TailAdmin/general-inventory'); // Vuelve a la tabla
    } catch (err: any) {
      setError(err.data?.message || 'Error al actualizar el producto.');
    } finally {
      setLoading(false);
    }
  };

  // 7. El formulario es igual al de "Crear", pero sin los campos de stock
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ...">
      {loading && <p>Cargando datos...</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* sección nombre */}
        <div>
          <Label>Nombre del Producto</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        {/* sección descripción */}
        <div>
          <Label>Descripción</Label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 p-3 ..."
            rows={4}
          />
        </div>
        {/* sección precio unitario */}
        <div>
          <Label>Precio Unitario (Q)</Label>
          <Input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required step={0.01} />
        </div>
        {/* sección stock dinámico */}
        <div>
          <Label>Stock por Sucursal</Label>
          <div className="space-y-4">
            {stockItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={item.sucursal_id_sucursal}
                  onChange={(e) => handleStockChange(index, 'sucursal_id_sucursal', e.target.value)}
                  required
                  className="w-1/2 rounded-lg border border-gray-200 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <option value="" disabled>Seleccione sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
                
                <Input 
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad_disponible} 
                  onChange={(e) => handleStockChange(index, 'cantidad_disponible', e.target.value)} 
                  required 
                  min="0"
                  className="w-1/2"
                />

                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => removeStockItem(index)}
                  className="p-3 aspect-square"
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addStockItem}
            className="mt-4 flex items-center gap-2"
          >
            <FaPlus /> Agregar otra sucursal
          </Button>
        </div>
        {/* sección imagen */}
        <div>
          <Label>Imagen del Producto (Opcional: subir para reemplazar)</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 ..."
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium">Vista Previa:</p>
              <img src={preview} alt="Vista previa" className="mt-2 h-32 w-32 object-cover rounded-lg" />
            </div>
          )}
        </div>
        
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/TailAdmin/general-inventory')}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}