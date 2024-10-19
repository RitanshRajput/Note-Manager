import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: false, password: false });

    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch("https://ritz-note-manager.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json(); // Assume your API returns a token
        localStorage.setItem("token", token); // Store the token
        navigate("/notes");
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("User Does Not exist Try Registering!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-smokeWhite p-8 rounded shadow-md w-11/12 sm:w-1/3 md:w-1/3 lg:w-1/3"
      >
        <h2 className="text-2xl text-neonOceanBlue mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-black">
            Email: {errors.email && <span className="text-red-500">* required</span>}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded text-black ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-black">
            Password: {errors.password && <span className="text-red-500">* required</span>}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border text-black rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-neonOceanBlue text-smokeWhite py-2 px-4 rounded">
            Login
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <Link to="/register" className="text-neonOceanBlue">
            Register!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
