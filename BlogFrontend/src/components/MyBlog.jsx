import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Blog/Blog.css";
import Spinner from "../Spinner/Spinner";

const MyBlog = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const blogsPerPage = 5; // Number of blogs per page

  const accessToken = localStorage.getItem("accessToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/blog/myblogs`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const myBlogs = response.data.myBlogs;
      setData(myBlogs);
      setError("");

      if (myBlogs.length > 0 && myBlogs[0].author?.username) {
        setUsername(myBlogs[0].author.username);
      }
    } catch (error) {
      setError("No blogs found! Create your blogs.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Spinner />;
  }

  // Pagination calculations
  const totalPages = Math.ceil(data.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = [...data].reverse().slice(indexOfFirstBlog, indexOfLastBlog);

  async function handleEdit(id, title, content) {
    const newTitle = prompt("Enter your title", title);
    if (!newTitle) return;
    const newContent = prompt("Enter your content", content);
    if (!newContent) return;

    try {
      const response = await axios.patch(
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
      if (response.status === 200) {
        alert("Blog updated successfully!");
        fetchBlogs();
      }
    } catch (error) {
      alert("Error updating the blog!");
    }
  }

  async function handleDelete(id) {
    const deleteBlog = confirm("Are you sure you want to delete this blog?");
    if (!deleteBlog) return;

    try {
      const response = await axios.delete(`${backendUrl}/blog/delete/${id}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        alert("Blog Deleted!");
        fetchBlogs();
      }
    } catch (error) {
      alert("Error deleting the blog!");
    }
  }

  return (
    <>
      {/* Right corner username */}
      <div style={{ textAlign: "right", margin: "10px 20px" }}>
        {username && <p>Profile: Hi {username}</p>}
      </div>

      <div className="container">
        <h2>My Blogs</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog, index) => (
            <div key={blog._id}>
              <h3>
                📝 {index + 1 + (currentPage - 1) * blogsPerPage}: Title: {blog.title}
              </h3>
              <p>Content: {blog.content}</p>
              <h4>Author: {blog.author?.username || "Unknown"}</h4>
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
              <div style={{ display: "flex", gap: "60px" }}>
                <button
                  onClick={() => handleEdit(blog._id, blog.title, blog.content)}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs to show.</p>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
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
        )}
      </div>
    </>
  );
};

export default MyBlog;
