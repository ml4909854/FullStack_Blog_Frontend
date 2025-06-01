import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Layout.css";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Update login state on location change
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, [location]);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // 👉 Refresh token login logic
  const handleLoginClick = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const res = await axios.post(`${backendUrl}/generateToken`, {
          token: refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        const userId = localStorage.getItem("userId");

        if (userId) {
          alert("Welcome back!");
          setIsLoggedIn(true);
          navigate("/blogs");
          return;
        }
      } catch (error) {
        // Clear on failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
      }
    }

    navigate("/login");
  };

  return (
    <div className="layout">
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Home
          </NavLink>
          <NavLink to="/blogs" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Blogs
          </NavLink>
          <NavLink to="/createBlog" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Create Blog
          </NavLink>

          {!isLoggedIn ? (
            <>
              <span id="login-nav" style={{cursor:"pointer" , display:"block"}}
                onClick={() => {
                  setMenuOpen(false);
                  handleLoginClick();
                }}
                className="nav-span"
              >
                Login
              </span>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/myblogs" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
                MyBlog
              </NavLink>
              <NavLink to="/logout" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? "active-link" : "")}>
                Logout
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
