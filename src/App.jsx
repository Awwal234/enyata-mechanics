import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";
import { useAuthStore } from "./store/auth";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Meters from "./pages/Meters.jsx";
import MeterDetail from "./pages/MeterDetail.jsx";
import Payments from "./pages/Payments.jsx";
import Settings from "./pages/Settings.jsx";
import AdminQA from "./pages/AdminQA.jsx";
import Landing from "./pages/Landing.jsx";

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.getMe(),
    enabled: Boolean(token),
    onSuccess: (data) => {
      if (data?.data) {
        setAuth(token, data.data);
      }
    },
  });

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/meters"
        element={
          <ProtectedRoute>
            <Meters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/meters/:meterNumber"
        element={
          <ProtectedRoute>
            <MeterDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/admin"
        element={
          <ProtectedRoute>
            <AdminQA />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
