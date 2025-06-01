import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./components/Logout";
import MyBlog from "./components/MyBlog";
import Home from "./components/Home/Home";
import Blog from "./components/Blog/Blog";
import CreateBlog from "./components/CreateBlog/CreateBlog";
import Signup from "./components/Signup/Signup";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="/blogs" element={<Blog/>}/>
            
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/myblogs" element={<MyBlog/>}/>

            <Route path="/createBlog" element={
              <PrivateRoute>
                <CreateBlog/>
              </PrivateRoute>
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
