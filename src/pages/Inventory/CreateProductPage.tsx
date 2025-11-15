import CreateProductForm from '../../components/inventory/CreateProductForm';
//import Breadcrumb from '../../components/common/Breadcrumb';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function CreateProductPage() {
  return (
    <>
      <Breadcrumb
        pageName="Agregar Nuevo Producto"
        parent="Inventario"
        parentLink="/TailAdmin/general-inventory"
      />
      <div className="py-4">
        <CreateProductForm />
      </div>
    </>
  );
}