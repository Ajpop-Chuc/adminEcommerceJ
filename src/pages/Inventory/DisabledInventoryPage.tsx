import Breadcrumb from '../../components/common/Breadcrumb';
//import DisabledInventoryTable from '../../components/tables/DisabledInventoryTable';
import DisabledInventoryTable from '../../components/tables/BasicTables/DisabledInventoryTable';

export default function DisabledInventoryPage() {
  return (
    <>
      <Breadcrumb
        pageName="Productos Desactivados"
        parent="Inventario"
        parentLink="/TailAdmin/general-inventory"
      />
      <div className="py-4">
        <DisabledInventoryTable />
      </div>
    </>
  );
}