import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const accessToken = localStorage.getItem("accessToken");

      try {
        // Send logout request to backend
        await axios.get(`${backendUrl}/user/logout`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        // Remove tokens and userId
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        // localStorage.removeItem("userId");

        alert("Logout successfully!");
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
        alert("Logout failed. Please try again.");
        navigate("/");
      }
    };

    logout();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
