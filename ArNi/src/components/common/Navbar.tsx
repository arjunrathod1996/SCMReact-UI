import React, { useEffect, useRef, useState } from "react";
import UserService from "../service/UserService";
import { User } from "../../store";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaBriefcase, 
  FaStore,
  FaUserTie
} from "react-icons/fa";

// 1. Define Props Interface
interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

// 2. Define internal state types
interface SimpleUserInfo {
  email: string;
  phoneNumber: string;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 3. States with explicit types
  const [profileInfo, setProfileInfo] = useState<User | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [subDropdownOpen, setSubDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>(location.pathname);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState<boolean>(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [merchantDropdownOpen, setMerchantDropdownOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<SimpleUserInfo>({ email: "", phoneNumber: "" });

  // 4. Typing for Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isLoggedIn) {
    UserService.getCurrentUser()
      .then((userData: User | null) => {
        if (userData) {
          // TS now recognizes .phoneNumber because we updated the interface!
          setUserInfo({
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
          });
          setProfileInfo(userData);
          setUser(userData );
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }
}, [isLoggedIn]);

  const handleLogout = (): void => {
    onLogout();
    setDropdownVisible(false);
    UserService.logout();
    localStorage.removeItem("token");
    setUserInfo({ email: "", phoneNumber: "" });
    setProfileInfo(null);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
        setBusinessDropdownOpen(false);
        setLocationDropdownOpen(false);
        setMerchantDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleBusinessDropdown = (): void => {
    setBusinessDropdownOpen(!businessDropdownOpen);
    setLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = (): void => {
    setLocationDropdownOpen(!locationDropdownOpen);
    setBusinessDropdownOpen(false);
  };

  useEffect(() => {
    const path = location.pathname;
    setBusinessDropdownOpen(
      path.startsWith("/dashboard/business") || 
      path.startsWith("/dashboard/merchant") || 
      path.startsWith("/dashboard/role")
    );
    setLocationDropdownOpen(
      path.startsWith("/dashboard/country") || 
      path.startsWith("/dashboard/region")
    );
    setActiveRoute(path);
    setSubDropdownOpen(path.startsWith("/products"));
  }, [location]);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Updated Helper function to match your JSON structure
  const getRoleName = (u: User | null): string => {
    if (!u || !u.role) return "";
    
    // Access the name property inside the role object
    return u.role.name; 
  };
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 shadow-md z-50 transition-transform">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-2xl font-semibold whitespace-nowrap dark:text-white uppercase text-gray-300">
              Logo
            </span>
          </NavLink>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="flex items-center">
              {!isLoggedIn && (
                <>
                  <NavLink
                    className="py-2 px-3 rounded mx-2 text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition duration-300"
                    to="/home"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive ? "#2563eb" : "",
                    })}
                  >
                    <FaHome className="inline mr-2" /> Home
                  </NavLink>
                  <NavLink
                    className="py-2 px-3 rounded mx-2 text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 transition duration-300"
                    to="/login"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive ? "#2563eb" : "",
                    })}
                  >
                    <FaSignInAlt className="inline mr-2" /> Login
                  </NavLink>
                </>
              )}
            </div>

            {isLoggedIn && (
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition duration-300"
                  id="user-menu-button"
                  aria-expanded={dropdownVisible}
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                  ref={buttonRef}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://via.placeholder.com/32"
                    alt="user profile"
                  />
                </button>

                {dropdownVisible && (
                  <div
                    className="absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                    id="user-dropdown"
                    ref={dropdownRef}
                  >
                    <div className="px-4 py-3">
                      {userInfo.email && (
                        <span className="block text-sm text-gray-900 dark:text-white">
                          {userInfo.email}
                        </span>
                      )}
                      {userInfo.phoneNumber && (
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          {userInfo.phoneNumber}
                        </span>
                      )}
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <NavLink
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition duration-300"
                        >
                          <FaTachometerAlt className="inline mr-2" /> Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition duration-300"
                        >
                          <FaCog className="inline mr-2" /> Settings
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer transition duration-300"
                        >
                          <FaSignOutAlt className="inline mr-2" /> Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {isLoggedIn && (
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition duration-300"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25zM2.75 10a.75.75 0 00-.75.75v.5a.75.75 0 00.75.75h14.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75H2.75z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {isLoggedIn && userInfo.email && (
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 ${
                      isActive ? "bg-blue-100 dark:bg-blue-800" : ""
                    }`
                  }
                >
                  <FaTachometerAlt className="w-4 h-6" />
                  <span className="ml-3">Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/customer"
                  className={({ isActive }) => 
                    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 ${
                      isActive ? "bg-blue-100 dark:bg-blue-800" : ""
                    }`
                  }
                >
                  <FaUserTie className="w-4 h-6" />
                  <span className="ml-3">Customer</span>
                </NavLink>
              </li>

              {getRoleName(user) === "ROLE_ADMIN" && (
                <li>
                  <button
                    onClick={toggleBusinessDropdown}
                    className="flex items-center w-full p-2 text-gray-900 transition duration-300 rounded-lg group dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaBriefcase className="w-4 h-6" />
                    <span className="flex-1 ml-3 text-left whitespace-nowrap">Business Role</span>
                    <svg className={`w-6 h-6 transition-transform ${businessDropdownOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.84l3.71-3.61a.75.75 0 111.04 1.08l-4.25 4.13a.75.75 0 01-1.04 0l-4.25-4.13a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {businessDropdownOpen && (
                    <ul className="py-2 space-y-2 pl-4">
                      <li>
                        <NavLink to="/dashboard/business" className={({ isActive }) => `flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 ${isActive ? "bg-blue-50" : ""}`}>
                          <FaBriefcase className="mr-3" /> Business
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/dashboard/merchant" className={({ isActive }) => `flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 ${isActive ? "bg-blue-50" : ""}`}>
                          <FaStore className="mr-3" /> Merchant
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              {/* ... Other sidebar items following the same pattern */}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};

export default Navbar;