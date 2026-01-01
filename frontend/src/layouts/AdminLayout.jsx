import Sidebar from "../admin/components/Sidebar";
import Topbar from "../admin/components/Topbar";
import AdminRoutes from "../admin/routes";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <AdminRoutes />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
