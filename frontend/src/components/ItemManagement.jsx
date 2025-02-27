import { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import instance from "../utils/axiosConfig";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await instance.get("/items/admin");
      setItems(data);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error(
        "Error deleting item:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Items</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <ItemForm
          item={selectedItem}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          refreshItems={fetchItems}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) &&
              items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">LKR {item.price}</td>
                  <td className="px-6 py-4">{item.stockQuantity} Kg</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemManagement;
