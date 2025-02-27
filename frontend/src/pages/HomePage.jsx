import { Link } from "react-router-dom";

const HomePage = () => {
  // Mock data for featured fish items
  const featuredItems = [
    {
      id: 1,
      name: "Fresh Salmon",
      price: 24.99,
      image:
        "https://img.freepik.com/free-photo/close-up-photo-fish-life-underwater-oceanarium_613910-21521.jpg?semt=ais_hybrid",
      stock: 10,
    },
    {
      id: 2,
      name: "Tuna Steak",
      price: 29.99,
      image:
        "https://img.freepik.com/free-photo/close-up-photo-fish-life-underwater-oceanarium_613910-21521.jpg?semt=ais_hybrid",
      stock: 5,
    },
    {
      id: 3,
      name: "Rainbow Trout",
      price: 19.99,
      image:
        "https://img.freepik.com/free-photo/close-up-photo-fish-life-underwater-oceanarium_613910-21521.jpg?semt=ais_hybrid",
      stock: 0,
    },
    {
      id: 4,
      name: "Sea Bass",
      price: 34.99,
      image:
        "https://img.freepik.com/free-photo/close-up-photo-fish-life-underwater-oceanarium_613910-21521.jpg?semt=ais_hybrid",
      stock: 8,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh Fish Delivered Daily
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Premium quality seafood straight from the ocean to your doorstep
          </p>
          <Link
            to="/items"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🐟</div>
              <h3 className="text-xl font-bold mb-4">Freshness Guaranteed</h3>
              <p className="text-gray-600">
                Direct from local fishermen to your table within 24 hours
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Next-day delivery available in all metropolitan areas
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                Sustainably sourced and carefully selected seafood
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mb-4">
                    LKR {item.price}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${
                        item.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.stock > 0
                        ? `${item.stock} in stock`
                        : "Out of stock"}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        item.stock > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={item.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/items"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
