import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProductDetailsCard from "../../components/cards/ProductDetailsCard";
import { useParams } from "react-router";


export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <>
      <PageMeta
        title={`Detalles del Producto ${id} | Sistema de Inventarios`}
        description={`Página de detalles del producto ${id}`}
      />
      <PageBreadcrumb pageTitle={`Detalle de Producto #${id}`} />
      <div className="space-y-6">
        <ComponentCard title={`Product Details #${id}`}>
          <ProductDetailsCard productId={id} />
        </ComponentCard>
      </div>
    </>
  );
}