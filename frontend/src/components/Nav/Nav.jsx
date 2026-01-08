import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  MdOutlineAccountBalance,
  MdAddCircleOutline ,
} from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoanCalculator from "../LoanCalculator";
import { MdCalculate } from "react-icons/md";



function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);


  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <AiOutlineHome /> },
    { name: "Customers", path: "/users", icon: <AiOutlineUser /> },
    { name: "Settled Customers", path: "/closedFiles", icon: <MdOutlineAccountBalance /> },
    { name: "New Customer", path: "/addUser", icon: <MdAddCircleOutline  /> },
    // { name: "Settings", path: "/settings", icon: <AiOutlineSetting /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };


  return (
    <div className="flex bg-[#f4f7fb] min-h-screen ">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0b1b53] text-white flex flex-col justify-between
        transition-transform duration-300 z-50
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* Logo Section */}
        <div className="flex items-center gap-2 px-8 py-5 border-b border-white/10">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10.5 w-auto rounded-md"
          />
         
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 px-3 mt-6 space-y-1">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-[#9bcaee] text-[#0b1b53] font-semibold shadow-sm"
                  : "hover:bg-white/20 hover:text-[#9bcaee]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-blue-200 bg-[#0b1b53] py-2 rounded-lg font-medium hover:bg-[#224c6c] transition-all duration-300"
          >
            <AiOutlineLogout className="text-lg" /> Log Out
          </button>
        </div>

        {/* Close Icon for Mobile */}
        <IoClose
          className="absolute top-5 right-5 text-2xl cursor-pointer md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-6 py-3 md:px-10 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile) */}
            <FiMenu
              className="text-2xl cursor-pointer md:hidden text-[#0b1b53]"
              onClick={() => setMenuOpen(true)}
            />
            <h1 className="text-xl py-4 font-semibold text-[#0b1b53] hidden md:block">
              Welcome Back ! 👋
            </h1>
            <button
              onClick={() => setShowCalculator(true)}
              className="p-2 rounded-full bg-blue-100 text-[#0b1b53] hover:bg-blue-200"
              title="Loan Calculator"
            >
              <MdCalculate size={25} />
            </button>

          </div>

         
          <div className="flex items-center gap-3">
            
            {/* Name + Role on the left */}
            <div className="flex flex-col items-end"> {/* items-end aligns text to the right, so it sits close to avatar */}
              <span className="font-medium text-[#0b1b53]">{user?.name}</span>
              <span className="text-xs text-green-600">Administrator  </span>
            </div>

            {/* Avatar */}
            <img
              src="/images/profile.webp"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-[#0b1b53]"
            />
          </div>


        </header>

       <main className="flex-1 p-5 md:p-8 overflow-y-auto bg-[#f4f7fb]">
          <Outlet />
        </main>

      
      </div>



      {/* Overlay for Mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {showCalculator && (
        <LoanCalculator onClose={() => setShowCalculator(false)} />
      )}


      
    </div>
  );
}

export default Nav;
