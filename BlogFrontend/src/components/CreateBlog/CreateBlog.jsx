import React, { useEffect, useState } from "react";
import "../Signup/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";

const CreateBlog = () => {
  const [data, setData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Spinner message="Loading Create Blog Page..." />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found. Please login again.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/blog/create`, data, {
        headers: {
          authorization: `Bearer ${accessToken}`, // Capital A
        },
      });

      if (response.status === 201) {
        alert(`"${data.title}" blog created successfully!`);
        navigate("/blogs");
      }
    } catch (err) {
      setError("Blog creation failed. Please try again.");
    }

    setData({
      title: "",
      content: "",
    });
    setFormLoading(false);
  };

  return (
    <div className="container">
      <h1>Create Some Blog!</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {formLoading && (
        <p style={{ color: "blue", marginBottom: "10px" }}>Creating blog...</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={data.title}
          name="title"
          id="title"
          placeholder="Title"
          type="text"
          required
          disabled={formLoading}
        />

        <textarea
          onChange={handleChange}
          value={data.content}
          name="content"
          id="content"
          placeholder="Content"
          minLength={10}
          required
          disabled={formLoading}
        />

        <button type="submit" disabled={formLoading}>
          {formLoading ? "Please wait..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
