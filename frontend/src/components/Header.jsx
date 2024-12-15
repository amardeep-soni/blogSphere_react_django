import { useEffect, useState } from "react";
import apiClient from "./ApiClient";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000/api";
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
  }, [username]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate('/');
  };

  const AuthButton = () => {
    return (
      <div className="flex gap-4 items-center">
        {profile ? (
          <div
            className="relative"
            onMouseEnter={() => { setIsProfileOpen(true); setIsCategoryOpen(false) }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <a className="block w-10 h-10 rounded-full overflow-hidden border-2 border-slate-400 object-cover cursor-pointer">
              <img src={profile.photo} alt="Profile" />
            </a>

            {isProfileOpen && (
              <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-10" onMouseLeave={() => setIsProfileOpen(false)}>
                <li>
                  <Link
                    to={`/author/${username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 flex-col md:flex-row">
          <div className="flex w-full justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="w-48 cursor-pointer"
            >
              <img
                src="/img/logo-landscape.png"
                className="w-48"
                alt="logo"
              />
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <div className="block md:hidden">
                <AuthButton />
              </div>
              <button
                className="w-6 block md:hidden text-gray-700 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <i className="fa fa-times text-2xl"></i> // Close icon
                ) : (
                  <i className="fa fa-bars text-2xl"></i> // Hamburger icon
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <ul
            className={`${isMenuOpen ? "block" : "hidden"} md:flex gap-2 w-full md:w-auto text-lg`}
          >
            <li>
              <Link
                to="#home"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#about"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
              >
                Contact
              </Link>
            </li>

            {/* Category Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => { setIsCategoryOpen(true); setIsProfileOpen(false) }}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <button className="px-4 py-2 hover:text-blue-600 flex items-center w-full">
                Categories
                {isCategoryOpen ? (
                  <i className="ml-1 fa fa-angle-up"></i>
                ) : (
                  <i className="ml-1 fa fa-angle-down"></i>
                )}
              </button>

              {/* Dropdown List */}
              {isCategoryOpen && (
                <ul className="absolute left-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-10" onMouseLeave={() => setIsCategoryOpen(false)}>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        to={`/category/${category}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <div className="hidden md:block">
              <AuthButton />
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
