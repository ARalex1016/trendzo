import type React from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "@/Layouts/Layout";

// Pages
import Home from "@/pages/Home/Home";
import Profile from "@/pages/Profile/Profile";
import Products from "@/pages/Products/Products";
import ProductDetails from "@/pages/ProductDetails/ProductDetails";
import Cart from "@/pages/Cart/Cart";
import CheckOut from "@/pages/CheckOut/CheckOut";
import Checkout_Success from "@/pages/CheckOut/Checkout_Success/Checkout_Success";
import MyOrders from "@/pages/MyOrders/MyOrders";
import MyOrderDetails from "@/pages/MyOrderDetails/MyOrderDetails";
import MyReferral from "@/pages/MyReferral/MyReferral";

// Admin
import AllProducts from "@/pages/ProductManagement/AllProducts/AllProducts";
import AddProduct from "@/pages/ProductManagement/AddProduct/AddProduct";

import Signup from "@/pages/Signup/Signup";
import Login from "@/pages/Login/Login";
import NotFound from "@/pages/NotFound/NotFound";

// Config
import { ROUTES } from "@/config/routes";

// Store
import useAuthStore from "@/store/useAuthStore";

// Types
import type { Role } from "@/types/user.types";

type RoleRouteProps = {
  allowedRoles: Role[];
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    (children ?? <Outlet />)
  ) : (
    <Navigate to="/login" replace />
  );
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
    (children ?? <Outlet />)
  );
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuthStore();

  // Safety fallback
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <Layout showFooter />, // Layout with Footer
    children: [
      {
        index: true,
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.PRODUCTS,
        element: <Products />,
      },
      {
        path: ROUTES.PRODUCT_DETAILS(),
        element: <ProductDetails />,
      },
      {
        element: <ProtectedRoute />, // Only for Authenticated Users
        children: [],
      },
    ],
  },
  {
    element: <Layout showFooter={false} />, // Layout without Footer
    children: [
      {
        path: ROUTES.CHECKOUT,
        element: <CheckOut />,
      },
      {
        path: ROUTES.CART,
        element: <Cart />,
      },

      {
        element: <ProtectedRoute />, // Only for Authenticated Users
        children: [
          {
            path: ROUTES.PROFILE,
            element: <Profile />,
          },
          {
            element: <RoleRoute allowedRoles={["customer"]} />,
            children: [
              {
                path: ROUTES.CHECKOUT_SUCCESS(),
                element: <Checkout_Success />,
              },
              {
                path: ROUTES.MYORDERS,
                element: <MyOrders />,
              },
              {
                path: ROUTES.MYORDER_DETAILS(),
                element: <MyOrderDetails />,
              },
              {
                path: ROUTES.MYREFERRAL,
                element: <MyReferral />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: ROUTES.ALL_PRODUCTS,
                element: <AllProducts />,
              },
              {
                path: ROUTES.ADD_PRODUCTS,
                element: <AddProduct />,
              },
            ],
          },
        ],
      },
      {
        element: <RedirectIfAuthenticated />, // Only for Non- Authenticated Users
        children: [
          {
            path: ROUTES.LOGIN,
            element: <Login />,
          },
          {
            path: ROUTES.SIGNUP,
            element: <Signup />,
          },
        ],
      },
      // ✅ ALWAYS LAST
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
