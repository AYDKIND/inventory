import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import authpic from "../assets/authpic.png";
import authicon from "../assets/authicon.svg"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggingIn, login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (formData) => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(formData)) login(formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center p-8">
        <div className="max-w-sm w-full">
          <img src={logo} alt="Logo" className="mx-auto mb-4 h-24 object-contain" />
          <h1 className="text-3xl font-semibold mb-2 text-center flex items-end">Welcome <img src={authicon} alt="Auth" className="w-12 h-12" /></h1>
          <p className="text-gray-500 mb-6 text-center">
            Log in with your credentials to access your account.
          </p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-left mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border bg-[#f8f8f8] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 text-left mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border bg-[#f8f8f8] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-600">Remember Me</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-600">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-2/5 justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${authpic})` }}>
        <img src={authpic} alt="Auth" className="w-80 h-auto object-cover" />
      </div>
    </div>
  );
};

export default Login;
