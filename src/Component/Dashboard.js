import { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom"; 
import AuthContext from "../context/AuthContext";

function Dashboard() {
  
  const { authTokens, user } = useContext(AuthContext);
  const [res, setRes] = useState([])

  const changeStatus = async (task, index) =>{
    let change = null
    if(task.taskStatus){
        change = {
            taskStatus:  false
        }
    }else{
        change = {
            taskStatus: true
        }
    }
    await fetch(`${process.env.REACT_APP_SERVER_URL}/users/task/status/${user.userId}/${task.taskId}`, {
        method: "PUT",
        body: JSON.stringify(change),
        headers:  { Authorization: `Bearer ${authTokens}` ,
                    "Content-Type":"application/json"
      },
      })
      .then((data) => data.json())
      .then((data) => {
        if (data.msg === "Task Completed") {
            swal.fire({
                title: "Task Completed",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }else{
            swal.fire({
                title: "Task incomplete",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
      })
  }

  const navigate = useNavigate();

  useEffect(() => {
    console.log(authTokens)
    if(authTokens){
      fetch(`${process.env.REACT_APP_SERVER_URL}/users/task/all/${user.userId}`, {
        method: "GET",
        headers:  {Authorization:`Bearer ${authTokens}`}
    })
      .then((data)=>data.json())
      .then((data)=>setRes(data))
    }
  }, []);

  var content = null;

  if (res.length > 0) {
    // console.log(res)
    content = res.map((task, index) => (
      <div className="card" key={index}>
        <img src={task.image} className="img" />
        <div className="cont">
          <div className="title">{task.title}</div>
          <div className="sub">{task.details}</div>
          <div className="home-hint">{task.deadline}</div>
          <div className="home-hint">{task.remainder}</div>
          <div className="home-hint">{task.taskStatus}</div>
          <button onClick={(e) => changeStatus(task, index)}>task.taskStatus? <p>Mark incomplete</p>: <p>Mark complete</p></button>
        </div>
      </div>
    ));
  }

  return (
    <div className="books-cont">
      <div className="heading">
        <h2>Profile</h2>
      </div>
      user? <div>
        <p>{user.userName}</p>
        <p>{user.email}</p>
      </div>
      : null
      <div className="alltasks">
        <h3>My tasks</h3>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default Dashboard;