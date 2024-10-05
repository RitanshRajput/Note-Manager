import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: false, email: false, password: false });

    // Validate fields
    if (!name || !email || !password) {
      setErrors({
        name: !name,
        email: !email,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        console.log(response.json());
        navigate("/login");
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-smokeWhite p-8 rounded shadow-md w-11/12 sm:w-1/3 md:w-1/3 lg:w-1/3"
      >
        <h2 className="text-2xl text-neonOceanBlue mb-6">Register</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-black">
            Name:{" "}
            {errors.name && <span className="text-red-500">* required</span>}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded text-black ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-black">
            Email:{" "}
            {errors.email && <span className="text-red-500">* required</span>}
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
            Password:{" "}
            {errors.password && (
              <span className="text-red-500">* required</span>
            )}
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
        <button
          type="submit"
          className="bg-neonOceanBlue text-smokeWhite py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
