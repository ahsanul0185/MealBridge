import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastProvider";
import { Header } from "./components/layout/Header";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { RestaurantDashboard } from "./pages/restaurant/RestaurantDashboard";
import { AddFoodDonation } from "./pages/restaurant/AddFoodDonation";
import { EditFoodDonation } from "./pages/restaurant/EditFoodDonation";
import { MyDonations } from "./pages/restaurant/MyDonations";
import { NgoDashboard } from "./pages/ngo/NgoDashboard";
import { AvailableFood } from "./pages/ngo/AvailableFood";
import { FoodDetailPage } from "./pages/ngo/FoodDetailPage";
import { MyClaims } from "./pages/ngo/MyClaims";
import { PickupStatus } from "./pages/ngo/PickupStatus";

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/restaurant/") || location.pathname.startsWith("/ngo/");

  return (
    <>
      {!isDashboardPage && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Restaurant Routes - nested under DashboardLayout */}
        <Route
          path="/restaurant"
          element={
            <ProtectedRoute allowedRole="restaurant">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RestaurantDashboard />} />
          <Route path="donate" element={<AddFoodDonation />} />
          <Route path="edit/:id" element={<EditFoodDonation />} />
          <Route path="donations" element={<MyDonations />} />
        </Route>

        {/* NGO Routes - nested under DashboardLayout */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute allowedRole="ngo">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<NgoDashboard />} />
          <Route path="food" element={<AvailableFood />} />
          <Route path="food/:id" element={<FoodDetailPage />} />
          <Route path="claims" element={<MyClaims />} />
          <Route path="pickups/:id" element={<PickupStatus />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
