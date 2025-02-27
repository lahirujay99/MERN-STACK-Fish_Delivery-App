const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <button
            onClick={() => setActiveTab("items")}
            className={`w-full text-left p-3 rounded ${
              activeTab === "items"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Manage Items
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-3 rounded ${
              activeTab === "orders"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Manage Orders
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
