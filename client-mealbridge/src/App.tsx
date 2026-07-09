import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import { Header } from "./components/layout/Header";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { RestaurantDashboard } from "./pages/restaurant/RestaurantDashboard";
import { AddFoodDonation } from "./pages/restaurant/AddFoodDonation";
import { MyDonations } from "./pages/restaurant/MyDonations";
import { NgoDashboard } from "./pages/ngo/NgoDashboard";
import { AvailableFood } from "./pages/ngo/AvailableFood";
import { FoodDetailPage } from "./pages/ngo/FoodDetailPage";
import { MyClaims } from "./pages/ngo/MyClaims";
import { PickupStatus } from "./pages/ngo/PickupStatus";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Restaurant Routes */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute allowedRole="restaurant">
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/donate"
            element={
              <ProtectedRoute allowedRole="restaurant">
                <AddFoodDonation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/donations"
            element={
              <ProtectedRoute allowedRole="restaurant">
                <MyDonations />
              </ProtectedRoute>
            }
          />

          {/* NGO Routes */}
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRole="ngo">
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/food"
            element={
              <ProtectedRoute allowedRole="ngo">
                <AvailableFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/food/:id"
            element={
              <ProtectedRoute allowedRole="ngo">
                <FoodDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/claims"
            element={
              <ProtectedRoute allowedRole="ngo">
                <MyClaims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/pickups"
            element={
              <ProtectedRoute allowedRole="ngo">
                <PickupStatus />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
