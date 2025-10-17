import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import SucursalStockTable from "../../components/tables/BasicTables/sucursalStockTable";
import { Sucursal, sucursalService } from '../../service/sucursalService';
import { useEffect, useState } from 'react';

export default function BasicTables() {
  
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const data = await sucursalService.getSucursales();
        setSucursales(data);
      } catch (error) {
        console.error('Error cargando sucursales:', error);
      }
    };

    cargarSucursales();
  }, []);


  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Inventario Por Sucursal" />
      
      <div className="space-y-6">
        <ComponentCard title="Branch Inventory">
            
            {/* Filtro simple */}
                <div className="flex items-center gap-4">
                <select
                    value={sucursalSeleccionada}
                    onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    className="px-10 py- border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="" disabled>Seleccione una sucursal</option>
                    {sucursales.map((sucursal) => (
                    <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                        {sucursal.nombre}
                    </option>
                    ))}
                </select>
                
                <span className="text-sm text-gray-500">
                    {sucursales.length} sucursales disponibles
                </span>
                </div>

          <SucursalStockTable id_sucursal={sucursalSeleccionada}/>
        </ComponentCard>
      </div>
    </>
  );
}
