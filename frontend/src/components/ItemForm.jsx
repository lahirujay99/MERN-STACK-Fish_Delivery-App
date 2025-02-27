import { useState, useEffect } from "react";
import instance from "../utils/axiosConfig";

const ItemForm = ({ item, onClose, refreshItems }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    category: "",
    image: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        stockQuantity: item.stockQuantity,
        category: item.category,
        image: item.image,
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        await instance.put(`/items/${item._id}`, formData);
      } else {
        await instance.post("/items", formData);
      }
      refreshItems();
      onClose();
    } catch (error) {
      console.error(
        "Error saving item:",
        error.response?.data?.errors ||
          error.response?.data?.message ||
          error.message
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {item ? "Edit Item" : "Add New Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
                rows="3"
              />
            </div>

            {/* Price Field */}
            <div>
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Stock Quantity Field */}
            <div>
              <label>Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Freshwater">Freshwater</option>
                <option value="Saltwater">Saltwater</option>
                <option value="Shellfish">Shellfish</option>
                <option value="Crustaceans">Crustaceans</option>
              </select>
            </div>

            {/* Image URL Field */}
            <div>
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
