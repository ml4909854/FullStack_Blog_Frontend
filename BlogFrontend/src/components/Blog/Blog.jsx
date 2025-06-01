import React, { useEffect, useState } from "react";
import Spinner from "../../Spinner/Spinner";
import axios from "axios";
import "./Blog.css";

const Blog = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const blogsPerPage = 10;// Number of blogs per page

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${backendUrl}/blog`);
      const blogs = response.data.blog;

      if (!blogs || blogs.length === 0) {
        setError("No blogs found! Please create some blogs.");
      } else {
        setData(blogs);
        setError("");
      }
    } catch (error) {
      console.error(error);
      setError("No blogs found! Please create some blogs");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) return <Spinner />;
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>{error}</div>
    );

  // Calculate indexes for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = [...data]
    .reverse()
    .slice(indexOfFirstBlog, indexOfLastBlog); // blogs for current page

  // Total pages for pagination buttons
  const totalPages = Math.ceil(data.length / blogsPerPage);

  const handleEdit = async (id, title, content) => {
    const newTitle = prompt("Enter new blog title:", title);
    if (!newTitle) return;

    const newContent = prompt("Enter new blog content:", content);
    if (!newContent) return;

    try {
      await axios.patch(
        `${backendUrl}/blog/update/${id}`,
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Blog updated!");
      fetchTodos();
    } catch (error) {
      console.error(error);
      alert("Blog update failed.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/blog/delete/${id}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Blog deleted!");
      fetchTodos();
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="container">
      <h1>Read Blog For Good Experience!</h1>
      {currentBlogs.map((blog, index) => (
        <div key={blog._id} className="blog-card">
          <h3>
            📝 {index + 1 + (currentPage - 1) * blogsPerPage}. {blog.title}
          </h3>
          <p>
            <strong>Author:</strong> {blog.author?.username || "Unknown Author"}
          </p>
          <p>{blog.content}</p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(blog.createdAt).toLocaleString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <button onClick={() => handleEdit(blog._id, blog.title, blog.content)}>
              Edit
            </button>
            <button onClick={() => handleDelete(blog._id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Pagination Buttons */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: currentPage === i + 1 ? "#007bff" : "#eee",
              color: currentPage === i + 1 ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
