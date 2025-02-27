import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import ItemManagement from "../components/ItemManagement";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("items");

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8">
        {activeTab === "items" && <ItemManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;
