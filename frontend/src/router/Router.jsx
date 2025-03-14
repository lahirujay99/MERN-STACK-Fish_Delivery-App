import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";
import SignInPage from "../pages/SignInPage";
import FishItemsPage from "../pages/FishItemsPage";
import CartPage from "../pages/CartPage";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import AdminDashboard from "../pages/AdminDashboard";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import ProfilePage from "../pages/ProfilePage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/items" element={<FishItemsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default Router;
