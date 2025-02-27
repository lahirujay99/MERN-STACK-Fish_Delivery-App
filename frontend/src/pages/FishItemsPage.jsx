import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axiosConfig";
import FishItemCard from "../components/FishItemCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useCart } from "../context/CartContext"; // Import useCart

const FishItemsPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { setCartItems } = useCart(); // Use setCartItems from CartContext

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const params = {
          page: currentPage,
          search: searchQuery,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        };

        const itemsResponse = await instance.get("/items", {
          params: {
            ...params,
            page: params.page.toString(),
          },
        });
        setItems(itemsResponse.data.items || []);
        setTotalPages(itemsResponse.data.totalPages || 1);

        if (categories.length === 0) {
          const categoriesResponse = await instance.get("/items/categories");
          setCategories(["all", ...categoriesResponse.data]);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Fish items endpoint not found");
        } else {
          setError(err.response?.data?.message || "Error fetching fish items");
        }
        console.error("Error fetching fish items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, currentPage]);

  const handleAddToCart = async (itemId) => {
    try {
      await instance.post("/cart/add", { itemId, quantity: 1 });

      // After successfully adding item, fetch the updated cart
      const cartResponse = await instance.get("/cart");
      setCartItems(cartResponse.data.items); // Update CartContext with the latest cart items

      // Show success toast (you can implement this)
      console.log("Item added to cart successfully");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/signin");
      }
      // Show error toast (you can implement this)
      console.error("Error adding item to cart:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Fresh Fish Market</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search fish items..."
            className="flex-1 p-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <FishItemCard
            key={item._id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No fish items found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default FishItemsPage;
