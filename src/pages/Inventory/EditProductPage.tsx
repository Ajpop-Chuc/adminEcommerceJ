import EditProductForm from '../../components/inventory/EditProductForm';
//import Breadcrumb from '../../components/common/Breadcrumb';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useParams } from 'react-router-dom';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>(); // 1. Obtiene el ID del producto de la URL

  if (!id) {
    return <div>Producto no especificado.</div>;
  }

  return (
    <>
      <Breadcrumb
        pageName="Editar Producto"
        parent="Inventario"
        parentLink="/TailAdmin/general-inventory"
      />
      <div className="py-4">
        {/* 2. Pasa el ID al formulario */}
        <EditProductForm productId={id} />
      </div>
    </>
  );
}