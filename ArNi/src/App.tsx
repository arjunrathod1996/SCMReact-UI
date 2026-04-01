import React, { useCallback, useEffect, useState, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { IntlProvider } from "react-intl"; 
import "flowbite";

// Services & Context
import { authAPI } from "./api";
import { useAuthStore } from "./store";

// Static Components
import Navbar from "./components/common/Navbar";
import LoginPage from "./components/auth/LoginPage";
import RegistrationPage from "./components/auth/RegistrationPage";
import Home from "./components/auth/beforeLogin/Home";
import ProfilePage from "./components/userspage/ProfilePage";
import UserManagementPage from "./components/userspage/UserManagementPage";
import PrivateRoute from "./components/auth/PrivateRoute";

// Table Components
import BusinessTable from "./components/Tables/BusinessTable";
import CountryPage from "./components/Tables/CountryPage";
import RegionPage from "./components/Tables/RegionPage";
import MerchantPage from "./components/Tables/MerchantPage";
import RolePage from "./components/Tables/RolePage";
import MyApp from "./components/myApp/MyApp";
import CustomerPage from "./components/Tables/CustomerPage";

// PNP Pages
import Report from "./pages/Admin/Report/Report";

// Locales
import enMessages from "./locales/en.json";
import esMessages from "./locales/es.json";
import BusinessPage from "./components/userspage/BusinessPage";

const messages: Record<string, any> = {
  en: enMessages,
  es: esMessages,
};

interface RedirectIfLoggedInProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const RedirectIfLoggedIn: React.FC<RedirectIfLoggedInProps> = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [locale] = useState<string>("en"); 
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();
  
  const { user, isAuthenticated, logout, setUser } = useAuthStore();

  // Helper to map API user data to Store format (DRY - Don't Repeat Yourself)
  const mapAndSetUser = useCallback((fetchedUser: any) => {
    setUser({
      ...fetchedUser,
      id: fetchedUser.id ?? 0,
      roles: Array.isArray(fetchedUser.roles) 
        ? fetchedUser.roles 
        : [fetchedUser.role?.name || "USER"]
    });
  }, [setUser]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    logout(); 
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token && !isAuthenticated) {
        try {
          const fetchedUser = await authAPI.getCurrentUser();
          if (fetchedUser) {
            mapAndSetUser(fetchedUser);
          }
        } catch {
          console.error("Session invalid, logging out...");
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, setUser, handleLogout, mapAndSetUser]);

  const handleLogin = async (token: string) => {
    localStorage.setItem("token", token);

    try {
      const fetchedUser = await authAPI.getCurrentUser();
      if (fetchedUser) {
        mapAndSetUser(fetchedUser);
      }
    } catch (error) {
      console.error("Sync user failed:", error);
      localStorage.removeItem("token");
    }
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="App min-h-screen bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Navbar isLoggedIn={isAuthenticated} onLogout={handleLogout} />
            
            <div className="content pt-16">
              <Suspense fallback={<div className="flex justify-center mt-20">Loading...</div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route
                    path="/login"
                    element={
                      <RedirectIfLoggedIn isAuthenticated={isAuthenticated}>
                        <LoginPage onLogin={handleLogin} />
                      </RedirectIfLoggedIn>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <RedirectIfLoggedIn isAuthenticated={isAuthenticated}>
                        <Home />
                      </RedirectIfLoggedIn>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute
                        element={<ProfilePage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/business"
                    element={
                      <PrivateRoute
                        element={<BusinessPage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/merchant"
                    element={
                      <PrivateRoute
                        element={<MerchantPage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/role"
                    element={
                      <PrivateRoute
                        element={<RolePage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/my_app"
                    element={
                      <PrivateRoute
                        element={<MyApp user={user} />}
                        allowedRoles={["ROLE_CUSTOMER"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/customer"
                    element={
                      <PrivateRoute
                        element={<CustomerPage user={user} />}
                        allowedRoles={["ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ADMIN"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/country"
                    element={
                      <PrivateRoute
                        element={<CountryPage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/dashboard/region"
                    element={
                      <PrivateRoute
                        element={<RegionPage user={user} />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/pnp/admin"
                    element={
                      <PrivateRoute
                        element={<Report user={user} name1="ArNi" />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT", "ROLE_MERCHANT_STAFF", "ROLE_MERCHANT_ADMIN", "ROLE_ASSOCIATE"]}
                        user={user}
                      />
                    }
                  />

                  <Route
                    path="/register"
                    element={
                      <PrivateRoute
                        element={<RegistrationPage />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT_ADMIN"]}
                        user={user}
                      />
                    }
                  />
                  
                  <Route
                    path="/admin/user-management"
                    element={
                      <PrivateRoute
                        element={<UserManagementPage />}
                        allowedRoles={["ROLE_ADMIN", "ROLE_MERCHANT_ADMIN"]}
                        user={user}
                      />
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </Suspense>
            </div>
          </>
        )}
      </div>
    </IntlProvider>
  );
}

export default App;