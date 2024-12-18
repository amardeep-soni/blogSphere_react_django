import { useEffect, useState } from "react";
import apiClient from "./ApiClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { formatCategoryForDisplay } from '../utils/formatters';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const username = localStorage.getItem("username");

  const getCategories = async () => {
    const response = await fetch(BASE_URL + '/category/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const res = await response.json();
      const categoryNames = res.map(c => c.name);
      setCategories(categoryNames);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`/users/${username}/`);
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (username) fetchProfile();
    getCategories();

    // Add event listener for profile updates
    const handleProfileUpdate = (event) => {
      setProfile(event.detail);
    };
    window.addEventListener('profileUpdate', handleProfileUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, [username]);

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

    // Dispatch event to clear profile
    window.dispatchEvent(new CustomEvent('profileUpdate', {
      detail: null
    }));

    toast.success('Logged out successfully!');
    navigate('/blog');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const AuthButton = () => {
    return (
      <div className="flex gap-4 items-center">
        {profile ? (
          <div
            className="relative group"
            onMouseEnter={() => { setIsProfileOpen(true); setIsCategoryOpen(false) }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <a className="block w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
            </a>

            {isProfileOpen && (
              <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-40" onMouseLeave={() => setIsProfileOpen(false)}>
                <li>
                  <Link
                    to={`/dashboard`}
                    className={`block px-4 py-2 transition
                      ${isActive('/dashboard')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
                  >
                    <i className="fas fa-columns mr-2"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/posts`}
                    className={`block px-4 py-2 transition
                      ${isActive('/posts')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
                  >
                    <i className="fas fa-file-alt mr-2"></i> My Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/posts/new`}
                    className={`block px-4 py-2 transition
                      ${isActive('/posts/new')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
                  >
                    <i className="fas fa-plus-circle mr-2"></i> New Post
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/comments`}
                    className={`block px-4 py-2 transition
                      ${isActive('/comments')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
                  >
                    <i className="fas fa-comments mr-2"></i> My Comments
                  </Link>
                </li>
                <li className="border-t border-gray-100">
                  <button
                    onClick={logout}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 w-full text-left"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Login
          </Link>
        )}
      </div>
    );
  };

  const NavLink = ({ to, label, icon }) => (
    <li>
      <Link
        to={to}
        className={`px-4 py-2 flex items-center space-x-1 rounded-lg transition-all duration-300 
          ${isActive(to)
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
      >
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </Link>
    </li>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="w-48 cursor-pointer"
          >
            <img
              src="/img/logo-landscape.png"
              className="h-8 w-auto"
              alt="logo"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <ul className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="Home" icon="fa-home" />
            <NavLink to="/blog" label="Blog" icon="fa-blog" />
            <NavLink to="/about" label="About" icon="fa-info-circle" />
            <NavLink to="/contact" label="Contact" icon="fa-envelope" />

            {/* Category Dropdown */}
            <li
              className="relative group"
              onMouseEnter={() => { setIsCategoryOpen(true); setIsProfileOpen(false) }}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600 flex items-center space-x-1 rounded-lg hover:bg-gray-50 transition-all duration-300">
                <i className="fas fa-th-list"></i>
                <span>Categories</span>
                <i className={`fas fa-chevron-${isCategoryOpen ? 'up' : 'down'} ml-1`}></i>
              </button>

              {isCategoryOpen && (
                <ul className="absolute left-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-40" onMouseLeave={() => setIsCategoryOpen(false)}>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        to={`/category/${category}`}
                        className={`block px-4 py-2 transition
                          ${isActive(`/category/${category}`)
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
                      >
                        {formatCategoryForDisplay(category)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <div className="ml-4">
              <AuthButton />
            </div>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <AuthButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <ul className="space-y-2">
              <MobileNavLink to="/" label="Home" icon="fa-home" />
              <MobileNavLink to="/about" label="About" icon="fa-info-circle" />
              <MobileNavLink to="/contact" label="Contact" icon="fa-envelope" />
              <li>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <i className="fas fa-th-list mr-2"></i>
                    Categories
                  </span>
                  <i className={`fas fa-chevron-${isCategoryOpen ? 'up' : 'down'}`}></i>
                </button>
                {isCategoryOpen && (
                  <ul className="bg-gray-50 py-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link
                          to={`/category/${category}`}
                          className="block px-8 py-2 text-gray-600 hover:text-blue-600"
                        >
                          {formatCategoryForDisplay(category)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

const MobileNavLink = ({ to, label, icon }) => (
  <li>
    <Link
      to={to}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    >
      <i className={`fas ${icon} mr-2`}></i>
      {label}
    </Link>
  </li>
);

export default Header;
