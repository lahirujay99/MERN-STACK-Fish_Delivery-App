const FishItemCard = ({ item, onAddToCart }) => {
  const isOutOfStock = item.stockQuantity <= 0;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            LKR {item.price?.toFixed(2)}
          </span>
          <span
            className={`text-sm ${
              isOutOfStock ? "text-red-500" : "text-green-500"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `${item.stockQuantity} in stock`}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(item._id)}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded ${
            isOutOfStock
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default FishItemCard;
