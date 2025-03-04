import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import AvaterImg from "../assets/commentor.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";

const navLists = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about-us" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Contact Us", path: "/contact-us" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <header className="bg-white py-6 border">
      <nav className="container mx-auto flex justify-between px-6">
        <a href="/">
          <img src="/logo.png" alt="Website Logo" className="h-12" />
        </a>
        <ul className="sm:flex hidden items-center gap-8">
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={list.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {list.name}
              </NavLink>
            </li>
          ))}
          {user && user?.role === "user" ? (
            <li className="flex gap-3 items-center">
              <img src={AvaterImg} alt="" className="size-8" />
              <button
                onClick={handleLogout}
                className="bg-[#1E73BE] px-4 py-1.5 text-white rounded-sm"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {/* admin */}
          {user && user?.role === "admin" && (
            <li className="flex gap-3 items-center">
              <img src={AvaterImg} alt="" className="size-8" />
              <Link to="/dashboard">
                <button className="bg-[#1E73BE] px-4 py-1.5 text-white rounded-sm">
                  Dashboard
                </button>
              </Link>
            </li>
          )}
        </ul>
        <div className="flex items-center sm:hidden">
          <button
            className="flex items-center px-3 py-4 bg-[#fafafa] rounded text-sm text-gray-500 hover:text-gray-900"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <IoClose className="size-6" />
            ) : (
              <IoMenuSharp className="size-6" />
            )}{" "}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <ul className="fixed top-[108px] left-0 w-full h-auto pb-8 border-b bg-white shadow-sm z-50">
          {navLists.map((list, index) => (
            <li className="mt-5 px-4" key={index}>
              <NavLink
                onClick={() => setIsMenuOpen(false)}
                to={list.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {list.name}
              </NavLink>
            </li>
          ))}
          {user ? (
            <>
              <li className="px-4 mt-5 flex items-center gap-2">
                <img src={AvaterImg} alt="" className="size-8" />
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="px-4 mt-5">
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
