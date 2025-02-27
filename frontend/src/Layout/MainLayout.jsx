import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Router from "../router/Router";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mt-14">
        <Router />
      </div>
      {user?.role !== "admin" && <Footer />}
    </div>
  );
}
