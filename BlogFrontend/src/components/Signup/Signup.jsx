import React, { useState, useEffect } from "react";
import "./Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!data.username.trim()) {
    setError("Username cannot be empty or just spaces.");
    setLoading(false);
    return;
  }

  if (!/^[A-Z]/.test(data.username)) {
    setError("Username must start with a capital letter.");
    setLoading(false);
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  if (!passwordRegex.test(data.password)) {
    setError(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${backendUrl}/user/register`, data);
    if (response.status === 201) {
      alert("You registered successfully!");
      setData({ username: "", password: "", role: "" });
      navigate("/login");
    }
  } catch (err) {
    const backendMessage = err?.response?.data?.message;
    setError(backendMessage || "Registration failed! Try again later.");
    console.error("Registration Error:", err);
  }

  setLoading(false);
};

  if (pageLoading) return <Spinner />;

  return (
    <div className="container">
      <h1>Signup</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "blue" }}>Please wait... Registering</p>}
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          value={data.username}
          name="username"
          placeholder="username"
          required
          disabled={loading}
        />
        <br />

        {/* Password field with FontAwesome eye toggle */}
        <div className="password-wrapper" style={{ position: "relative" }}>
          <input
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            value={data.password}
            name="password"
            placeholder="password"
            required
            minLength={8}
            disabled={loading}
            style={{ paddingRight: "40px" }}
          />
          <span
            className="eye-icon"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#333",
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <br />
        <select
          onChange={handleChange}
          value={data.role}
          name="role"
          required
          disabled={loading}
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="author">author</option>
          <option value="reader">reader</option>
          <option value="admin">admin</option>
        </select>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
