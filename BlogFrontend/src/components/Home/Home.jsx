import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Spinner from "../../Spinner/Spinner";

const Home = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if(pageLoading){
    return <Spinner/>
  }

  return (
    <div className="home-image-wrapper">
      <img
        className="home-image"
        src="https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600"
        alt="Blog Cover"
      />
      <div className="home-overlay">
        <h1 className="home-title">
          Hi! Bloggers, Welcome To <br /> Blog Official!
        </h1>
        <button
          className="create-blog-button"
          onClick={() => navigate("/createBlog")}
        >
          Create a Blog
        </button>
      </div>
    </div>
  );
};

export default Home;
