import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <nav className="fixed w-full top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">
                FishMarket
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:ml-6">
              {/* Conditionally render NavLinks based on user login */}
              {user && <NavLinks />}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full
                               w-5 h-5 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <div className="dropdown-container relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center
             justify-center text-blue-600"
                    >
                      {(user?.username?.[0] || "?").toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">{user.username}</span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg
                                 py-1 ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/signin" className="hover:text-blue-600">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2">
            {/* Conditionally render NavLinks based on user login */}
            {user && <NavLinks mobile />}

            <div className="pt-4 border-t">
              {user ? (
                <>
                  <Link to="/profile" className="block py-2">
                    Profile
                  </Link>
                  <Link to="/orders" className="block py-2">
                    My Orders
                  </Link>
                  <button onClick={logout} className="w-full text-left py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="block py-2">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block py-2 text-blue-600">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false }) => (
  <div className={`${mobile ? "flex flex-col" : "flex space-x-4"}`}>
    <Link to="/items" className={`${mobile ? "py-2" : ""} hover:text-blue-600`}>
      Shop
    </Link>
    <Link to="/about" className={`${mobile ? "py-2" : ""} hover:text-blue-600`}>
      About
    </Link>
    <Link
      to="/contact"
      className={`${mobile ? "py-2" : ""} hover:text-blue-600`}
    >
      Contact
    </Link>
  </div>
);

export default Navbar;