import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminUsers from "./pages/admin/AdminUsers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="app-shell flex min-h-0 min-h-[100dvh] w-full max-w-[100vw] flex-1 flex-col overflow-x-hidden bg-[#0a0a0f]">
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <ErrorBoundary>
              <AdminLayout />
            </ErrorBoundary>
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
