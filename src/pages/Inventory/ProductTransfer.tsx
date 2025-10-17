// src/pages/ProductTransferPage.tsx
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProductTransferCard from "../../components/cards/ProductTransferCard";
import { useParams } from "react-router";

export default function ProductTransferPage() {
  const { id_producto, id_sucursal, cantidad_disponible } = useParams<{ 
    id_producto: string;
    id_sucursal: string;
    cantidad_disponible: string;
  }>();

  // Validar que todos los parámetros estén presentes
  if (!id_producto || !id_sucursal || !cantidad_disponible) {
    return (
      <div className="text-center py-8 text-red-500">
        Faltan parámetros necesarios para la transferencia
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Transferencia de Producto ${id_producto} | Sistema de Inventarios`}
        description={`Página de transferencia de producto ${id_producto}`}
      />
      <PageBreadcrumb pageTitle={`Transferencia de Producto #${id_producto}`} />
      <div className="space-y-6">
        <ComponentCard title={`Transferencia de Producto`}>
          <ProductTransferCard 
            id_producto={id_producto}
            id_sucursal={id_sucursal}
            cantidad_disponible={cantidad_disponible}
          />
        </ComponentCard>
      </div>
    </>
  );
}