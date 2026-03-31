import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import DefaultLayout from "./components/Layout/DefaultLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import ShopOwnerLayout from "./components/Layout/ShopOwnerLayout.jsx";

import HomePage from "./pages/user_homepage/HomePage";

import Login from "./pages/Login/Login";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage.jsx";

import ShopDashboard from "./pages/Shop/Dashboard.jsx";
import ShopOrders from "./pages/Shop/Order.jsx";
import ShopProducts from "./pages/Shop/Product.jsx";

import AccountManagement from './pages/admin/AccountManagement';
import ReportManagement from './pages/admin/ReportManagement';

import CheckoutPage from "./pages/payment_order/CheckoutPage.jsx";
import PaymentPage from "./pages/payment_order/PaymentPage.jsx";
import ShoppingBagPage from "./pages/payment_order/ShoppingBagPage.jsx";
import OrderSuccessPage from "./pages/payment_order/OrderSuccessPage.jsx";
import OrderHistoryPage from "./pages/payment_order/OrderHistoryPage.jsx";
import OrderDetailPage from "./pages/payment_order/OrderDetailPage.jsx";

import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import ScrollToTop from "./components/ScrollToTop.jsx";





export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* TRANG PUBLIC: 
            Ai cũng có thể vào HomePage
          */}
          <Route
            path="/"
            element={
              <DefaultLayout>
                <HomePage />
              </DefaultLayout>
            }
          />

          <Route
            path="/category/:categoryName"
            element={
              <DefaultLayout>
                <ProductPage />
              </DefaultLayout>
            }
          />

          <Route 
            path="/search"
            element={
              <DefaultLayout>
                <ProductPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <DefaultLayout>
                <ProductDetailPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/order-success"
            element={
              <DefaultLayout>
                <OrderSuccessPage />
              </DefaultLayout>
            }
          />
          {/* TRANG GUEST: 
            Chỉ người chưa đăng nhập mới vào được.
            Nếu đã đăng nhập, GuestRoute sẽ chuyển hướng họ đi.
          */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <AuthLayout>
                  <RegisterPage />
                </AuthLayout>
              </GuestRoute>
            }
          />
          

          {/* TRANG PROTECTED: 
            Yêu cầu phải đăng nhập.
            Nếu chưa đăng nhập, ProtectedRoute sẽ chuyển về /login.
          */}

          {/* Admin */}
          <Route
            path="/admin/accounts"
            element={
              <ProtectedRoute>
                  <AccountManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                  <ReportManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Shop */}
          <Route
            path="/shop/dashboard"
            element={
              <ProtectedRoute>
                  <ShopDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop/product"
            element={
              <ProtectedRoute>
                  <ShopProducts />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/shop/order"
            element={
              <ProtectedRoute>
                  <ShopOrders />
              </ProtectedRoute>
            }
          />
          { /*Payment_Order*/}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopping-bag"
            element={
              <ProtectedRoute>
                <ShoppingBagPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                  <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-detail/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />


          {/* TRANG CHUYỂN HƯỚNG: 
            Trang trung gian để RoleRedirect quyết định xem
            người dùng nên đi về đâu (Homepage, Admin, hay Shop).
          */}
          <Route
            path="/role-redirect"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />
          
          {/* Trang 404 - Chuyển về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
