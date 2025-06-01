import React, { useEffect, useState } from "react";
import "../Signup/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Spinner message="Loading Login Page..." />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${backendUrl}/user/login`, data);

      if (response.status === 200) {
        const { accessToken, refreshToken, userId } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId);

        alert(`${data.username} logged in successfully!`);
        navigate("/blogs");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Check your credentials or try again."
      );
    }

    setData({
      username: "",
      password: "",
    });
    setFormLoading(false);
  }

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {formLoading && (
        <p style={{ color: "blue", marginBottom: "10px" }}>Logging in...</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={data.username}
          name="username"
          placeholder="username"
          type="text"
          required
          disabled={formLoading}
        />

        {/* Password input with FontAwesome eye icon */}
        <div className="password-wrapper" style={{ position: "relative" }}>
          <input
            onChange={handleChange}
            value={data.password}
            name="password"
            placeholder="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={formLoading}
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

        <button type="submit" disabled={formLoading}>
          {formLoading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
