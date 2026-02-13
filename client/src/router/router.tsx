import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "@/Layouts/Layout";
import AuthLayout from "@/Layouts/AuthLayout";

// Pages
import Home from "@/pages/Home/Home";
import Products from "@/pages/Products/Products";
import Profile from "@/pages/Profile/Profile";
import Signup from "@/pages/Signup/Signup";
import Login from "@/pages/Login/Login";
import NotFound from "@/pages/NotFound/NotFound";

// Store
import useAuthStore from "@/store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const RedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
