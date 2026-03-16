import type React from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "@/Layouts/Layout";

// Pages
import Home from "@/pages/Home/Home";
import Products from "@/pages/Products/Products";
import ProductDetails from "@/pages/ProductDetails/ProductDetails";
import Cart from "@/pages/Cart/Cart";
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

const RedirectIfAuthenticated = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Navigate to="/products" replace />
  ) : (
    children || <Outlet />
  );
};

const router = createBrowserRouter([
  {
    element: <Layout showFooter />,
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
        path: "/products/:productSlug",
        element: <ProductDetails />,
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
    element: <Layout showFooter={false} />,
    children: [
      {
        path: "/cart",
        element: <Cart />,
      },
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
