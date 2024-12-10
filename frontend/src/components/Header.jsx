import { useEffect, useState } from "react";
import apiClient from "./ApiClient";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  // const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfleOpen, setIsProfleOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = ["Technology", "Health", "Education", "Sports", "Finance"];

  const [profile, setProfile] = useState(null);
  const username = localStorage.getItem("username");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`/users/${username}/`);
        const data = response.data; // User profile data
        console.log(data);

        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

    window.location.href = '/'
  };

  const AuthButton = () => {
    return (
      <div className="flex gap-2 items-center">
        {profile ? (
          <div
            className="relative"
            onMouseEnter={() => { setIsProfleOpen(true); setIsCategoryOpen(false) }}
            onClick={() => setIsProfleOpen(!isProfleOpen)}
          >
            <a className="block w-10 h-10 rounded-full overflow-hidden border-2 border-slate-400 object-cover cursor-pointer">
              <img src={profile.photo} alt="" />
            </a>

            {isProfleOpen && (
              <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-10" onMouseLeave={() => setIsProfleOpen(false)} onClick={() => { setIsProfleOpen(false); setIsMenuOpen(false) }}>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={logout}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="px-8 py-2 bg-blue-600 text-white rounded-full hover:opacity-80"
          >
            Login
          </a>
        )}
      </div>
    )
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 flex-col md:flex-row">
          <div className="flex w-full justify-between">
            {/* Logo */}
            <img src="/img/logo-landscape.png" className="w-48" alt="logo" />
            {/* Mobile Menu Toggle */}
            <div className="flex gap-4 items-center">
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
            className={`${isMenuOpen ? "block" : "hidden"
              } md:flex gap-2 w-full md:w-auto text-lg`}
          >
            <li>
              <a
                href="#home"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block px-4 py-2 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                Contact
              </a>
            </li>

            {/* Category Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => { setIsCategoryOpen(true); setIsProfleOpen(false) }}
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
                <ul className="absolute left-0 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 z-10" onMouseLeave={() => setIsCategoryOpen(false)} onClick={() => { setIsCategoryOpen(false); setIsMenuOpen(false) }}>
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a
                        href={`#${category.toLowerCase()}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                      >
                        {category}
                      </a>
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
