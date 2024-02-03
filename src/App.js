import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import Dashboard from "./Component/Dashboard";
import Home from "./Component/Home";
import Login from "./Component/Login";
import Navbar from "./Component/Navbar";
import Registerpage from "./Component/Registerpage";
import { useContext } from "react";
import {jwtDecode} from "jwt-decode";
import "./App.css";
import Addtask from "./Component/Addtask";
import EditTask from "./Component/EditTask";

function App() {
  let token = localStorage.getItem("Authorization");
  let user = null;
  const [task, setTask] = useState('')
  useEffect(() => {
    if (token) {
      user = jwtDecode(localStorage.getItem("Authorization"));
      console.log(user);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
          <Navbar />
          <Routes>
            <>
              <Route element={<Home />} path="/" />
              <Route element={<Login />} path="/login" />
              <Route element={<Registerpage />} path="/register" />
              <Route element={<Dashboard setTask={setTask}/>} path="/dashboard" />
              <Route element={<Addtask />} path="/newtask" />
              <Route element={<EditTask task={task}/>} path={`edittask/${task._id}`} />
              <Route
                exact
                path="/"
                render={() =>
                  user ? <Navigate to="/dashboard" /> : <Route element={<Home />} path="/" />
                }
              />
            </>
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
