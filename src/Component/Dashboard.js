import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import TextField from "@mui/material/TextField";
import "./Dashboard.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import EditTask from "./EditTask";
const swal = require("sweetalert2");

function Dashboard({ setTask }) {
  const { authTokens, user } = useContext(AuthContext);
  const [tsk, setTsk] = useState();
  const [loading, setLoading] = useState(false);

  const handleEditButton = async (task, e) => {
    // e.preventDefault();
    console.log(task);
    await setTask(task);
    navigate(`/edittask/${task._id}`);
  };

  const handleDelete = async (task, e) => {
    console.log(task);
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/task/delete/${user.userId}/${task._id}`,
        {
          method: "DELETE",
          headers:  {Authorization:`Bearer ${authTokens}`}
        }
      );
      if(resp.status === 200){
        swal.fire({
          title: "Task Deleted",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }else{
        swal.fire({
          title: "Error in deleting, please try again later",
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const changeStatus = async (task, index) => {
  //   let change = null;
  //   if (task.taskStatus) {
  //     change = {
  //       taskStatus: false,
  //     };
  //   } else {
  //     change = {
  //       taskStatus: true,
  //     };
  //   }
  //   await fetch(
  //     `${process.env.REACT_APP_SERVER_URL}/task/status/${user.userId}/${task.taskId}`,
  //     {
  //       method: "PUT",
  //       body: JSON.stringify(change),
  //       headers: {
  //         Authorization: `Bearer ${authTokens}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((data) => data.json())
  //     .then((data) => {
  //       if (data.msg === true) {
  //         swal.fire({
  //           title: "Task Completed",
  //           icon: "success",
  //           toast: true,
  //           timer: 6000,
  //           position: "top-right",
  //           timerProgressBar: true,
  //           showConfirmButton: false,
  //         });
  //       } else {
  //         swal.fire({
  //           title: "Task incomplete",
  //           icon: "error",
  //           toast: true,
  //           timer: 6000,
  //           position: "top-right",
  //           timerProgressBar: true,
  //           showConfirmButton: false,
  //         });
  //       }
  //     });
  // };

  const navigate = useNavigate();
  const fetchdata = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/task/all/${user.userId}`,
        {
          method: "GET",
          // headers:  {Authorization:`Bearer ${authTokens}`}
        }
      );
      const jsonresp = await resp.json();
      await setTsk(jsonresp.data);
      console.log(tsk);
    } catch (error) {
      console.log(error);
    }
    setLoading(true);
    console.log(tsk);
  };

  useEffect(() => {
    console.log(authTokens);
    if (authTokens) {
      fetchdata();
    }
  }, []);

  // if (tsk && tsk.length > 0) {
  //   console.log(tsk.length);
  //   content = tsk.map((task, index) => (
  //     <div className="card" key={index}>
  //       <div className="cont">
  //         <div className="title">{task.title}</div>
  //         <div className="sub">{task.details}</div>
  //       </div>
  //     </div>
  //   ));
  // }

  return (
    <div className="books-cont">
      <div className="heading">
        {user? <h2>{user.userName}'s Profile</h2>: null}
      </div>
      <div className="alltasks">
        <div style={{display:"flex", flexDirection: "row",  justifyContent: "space-evenly"}}>
          <h3>My tasks</h3>
          <Button variant='outlined' onClick={() => navigate("/newtask")}> + New </Button>
        </div>
        <div className="tasks">
          {loading
            ? tsk.map((task, index) => (
                <div className="card" key={index}>
                  <div className="cont">
                    <div className="title">{task.title}</div>
                    <div className="sub">{task.details}</div>
                    <div className="sub">
                      <strong>Deadline :</strong> {task.deadline}
                    </div>
                    <div className="sub">
                      <strong>Remainder :</strong> {task.remainder}
                    </div>
                    <div
                      className="sub"
                      style={
                        task.taskStatus === "completed"
                          ? { color: "green" }
                          : null
                      }
                    >
                      Status : {task.taskStatus ? task.taskStatus : "No status"}
                    </div>
                    <Button
                      size="small"
                      onClick={(e) => handleEditButton(task, e)}
                    >
                      Edit
                    </Button>
                    <Button size="small" onClick={(e) => handleDelete(task, e)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
