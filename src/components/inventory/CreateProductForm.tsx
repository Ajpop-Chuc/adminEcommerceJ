import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../service/inventoryService';
import { Sucursal, sucursalService } from '../../service/sucursalService';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { FaPlus, FaTrash } from 'react-icons/fa'; // iconos para botones de agregar y eliminar sucursal

// Definir el tipo para un item de stock
interface StockItem {
  sucursal_id_sucursal: string;
  cantidad_disponible: string;
}

export default function CreateProductForm() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // estados para la sucursal
  const [sucursales, setSucursales] = useState<Sucursal[]>([]); // Lista de sucursales

  const [stockItems, setStockItems] = useState<StockItem[]>([
    { sucursal_id_sucursal: '', cantidad_disponible: '' },
  ]); 

  // 2. Carga de las sucursales al montar el componente, por eso se usa useEffect
  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const data = await sucursalService.getSucursales();
        setSucursales(data);
      if (data.length > 0) {
        // seleccionar la primera sucursal por defecto
        setStockItems([{ sucursal_id_sucursal: data[0].id_sucursal.toString(), cantidad_disponible: '' }]);
      }
      } catch (err) {
        console.error('Error al cargar las sucursales:', err);
        setError('No se pudieron cargar las sucursales.');
      }
    };
    loadSucursales();
  }, []);

  // Funciones para manejar el array de stock
  const handleStockChange = (index: number, field: keyof StockItem, value: string) => {
    const newStockItems = [...stockItems];
    newStockItems[index][field] = value;
    setStockItems(newStockItems);
  };

  const addStockItem = () => {
    // Añade una nueva fila vacía
    setStockItems([...stockItems, { sucursal_id_sucursal: '', cantidad_disponible: '' }]);
  };

  const removeStockItem = (index: number) => {
    // No permite eliminar la última fila
    if (stockItems.length <= 1) return; 
    const newStockItems = [...stockItems];
    newStockItems.splice(index, 1);
    setStockItems(newStockItems);
  };

  // Manejo del cambio de archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // 4. Actualiza la validación
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
      formData.append('imagen', selectedFile); // El backend debe esperar un campo 'imagen'
    }
    
    // magia jajaja convertir el array de stick a un string JSON
    formData.append('stock_inicial', JSON.stringify(stockItems));

    try {
      await inventoryService.createProduct(formData);
      alert('Producto creado exitosamente!'); // Notificación de éxito (lo tengo que modificar )
      navigate('/TailAdmin/general-inventory'); // Vuelve a la tabla de inventario
    } catch (err: any) {
      setError(err.data?.message || 'Error al crear el producto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Nombre del Producto</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        {/* Campo descripción */}
        <div>
          <Label>Descripción</Label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 p-3 dark:border-white/10 dark:bg-white/5"
            rows={4}
          />
        </div>

        {/*  campo sucursal */}
        <div>
          <Label>Stock Inicial por Sucursal</Label>
          <div className="space-y-4">
            {stockItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {/* Selector de Sucursal */}
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
                
                {/* Input de Cantidad */}
                <Input 
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad_disponible} 
                  onChange={(e) => handleStockChange(index, 'cantidad_disponible', e.target.value)} 
                  required 
                  min="0"
                  className="w-1/2"
                />

                {/* Botón de Eliminar Fila */}
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => removeStockItem(index)}
                  disabled={stockItems.length <= 1} // No deja borrar la última
                  className="p-3 aspect-square"
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
          </div>

          {/* Botón de Añadir Fila */}
          <Button
            type="button"
            variant="outline"
            onClick={addStockItem}
            className="mt-4 flex items-center gap-2"
          >
            <FaPlus /> Agregar otra sucursal
          </Button>
        </div>

        
        {/* Seccion precio unitario */}
        <div>
          <Label>Precio Unitario (Q)</Label>
          <Input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required step={0.01} />
        </div>

        {/* Imagen del Producto */}
        <div>
          <Label>Imagen del Producto</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}