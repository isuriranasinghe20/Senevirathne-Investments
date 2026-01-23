import api from '../../utils/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const history = useNavigate();

  const [user, setUser] = useState({
    identifier: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendRequest();

      if (response.user) {
        login(response.user);
        alert("Login Successful");
        history("/dashboard");
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendRequest = async () => {
    return await api.post("/log", {
      identifier: user.identifier,
      password: user.password,
    }).then(res => res.data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-[#0a1628] via-[#08248a] to-[#150928]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000"></div>
        </div>
        
        {/* Subtle diagonal lines pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 37px
          )`
        }}></div>
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0b1b53]/50 to-[#0a1628]"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="2" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundSize: '100px 100px'
        }}></div>
      </div>


      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center relative z-10 p-4 lg:p-8">
        <div className="w-full max-w-4xl">
          
          {/* Unified Glassmorphic Container */}
          <div className="relative animate-[fadeIn_0.8s_ease-out]">
            {/* Container glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="grid lg:grid-cols-2">
                
                {/* Left Column - Branding */}
                <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                      backgroundImage: 'url("/images/loginbg.png")',
                    }}
                  ></div>

                  
                  {/* Overlay for better text contrast */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#0b1b53]/50 via-[#1a2b6d]/30 to-transparent"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="relative z-10 text-center space-y-8 animate-[fadeIn_1s_ease-out]">
                    {/* Logo with Enhanced Animation */}
                    <div className="flex justify-center mb-8 relative group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-72 h-72 bg-linear-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse"></div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                        <img 
                          src="/fav.png" 
                          alt="Senevirathne Investments Logo" 
                          className="h-36 w-38 relative z-10 drop-shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                        />
                      </div>
                    </div>

                    {/* Brand Text */}
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-white tracking-tight animate-[slideRight_0.8s_ease-out]">
                        Senevirathne
                      </h1>
                      <p className="text-2xl font-light text-blue-200 tracking-widest animate-[slideRight_0.8s_ease-out_0.2s_both]">
                        INVESTMENTS
                      </p>
                    </div>

                    {/* Decorative Icons */}
                    <div className="flex justify-center space-x-6 pt-2 animate-[slideUp_0.8s_ease-out_0.4s_both]">
                      {/* Security Icon */}
                      <div className="group cursor-pointer">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-xs text-blue-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Secure</p>
                      </div>

                      {/* Analytics Icon */}
                      <div className="group cursor-pointer">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-blue-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Analytics</p>
                      </div>

                      {/* Growth Icon */}
                      <div className="group cursor-pointer">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <p className="text-xs text-blue-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Growth</p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-blue-200/80 text-base font-light max-w-xs mx-auto pt-1 animate-[fadeIn_1s_ease-out_0.6s_both] leading-relaxed">
                      Empowering your financial future with intelligent investment solutions
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/30 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                </div>

                {/* Right Column - Login Form */}
                <div className="flex items-center justify-center p-8 lg:p-12">
                  <div className="w-full max-w-md animate-[slideLeft_0.8s_ease-out]">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                      <img 
                        src="/fav.png" 
                        alt="Senevirathne Investments Logo" 
                        className="h-24 w-24 drop-shadow-2xl"
                      />
                    </div>

                    {/* Form Content */}
                    <div className="mb-8">
                      <h2 className="text-2xl sm:text-2xl font-bold text-white mb-2">
                        Admin Login
                      </h2>
                      <p className="text-blue-200 text-sm sm:text-base">
                        Please sign in to access your dashboard
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Username/Email Input */}
                      <div className="transform transition-all duration-300 hover:translate-x-1">
                        <label 
                          htmlFor="identifier" 
                          className="block text-sm font-semibold text-white mb-2 tracking-wide"
                        >
                          Username or Email
                        </label>
                        <div className="relative">
                          <input
                            id="identifier"
                            type="text"
                            name="identifier"
                            value={user.identifier}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/50 font-medium hover:bg-white/25 focus:bg-white/30"
                            placeholder="Enter your username or email"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="transform transition-all duration-300 hover:translate-x-1">
                        <label 
                          htmlFor="password" 
                          className="block text-sm font-semibold text-white mb-2 tracking-wide"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-white/50 font-medium hover:bg-white/25 focus:bg-white/30"
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full bg-linear-to-r from-[#0b1b53] to-[#0d2166] text-white py-4 px-4 rounded-xl font-bold text-lg hover:from-[#0d2166] hover:to-[#0f2779] focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        
                        <span className="relative z-10">
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loging in...
                            </span>
                          ) : (
                            'Login'
                          )}
                        </span>
                      </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                      <p className="text-blue-200/80 text-sm">
                        © {new Date().getFullYear()} Senevirathne Investments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Login;