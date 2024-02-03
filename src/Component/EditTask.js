import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import TextField from "@mui/material/TextField";
import "./Dashboard.css";
import { Navigate, json, useNavigate } from "react-router-dom";
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
const swal = require("sweetalert2");

function EditTask({ task }) {
  const { authTokens, user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [remainder, setRemainder] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setDetails(task.details);
    setStatus(task.taskStatus);
    setTitle(task.title);
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    const edited = {
      title: title,
      details: details,
      deadline: deadline,
      remainder: remainder,
      taskStatus: status,
    };
    console.log(edited);
    if (!title || !details || !deadline || !remainder || !status) {
      swal.fire({
        title: "Kindly check all the fields are filled",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/task/edit/${user.userId}/${task._id}`,
        {
          method: "PUT",
          body: JSON.stringify(edited),
          headers: {
            Authorization: `Bearer ${authTokens}`,
            "Content-Type": "application/json",
          },
        });
      if (response.status === 200) {
        swal.fire({
          title: "Task edited",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: "Editing failed",
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      navigate("/dashboard");
    }
  };
  return (
    <div className="editing">
      <h2>EditTask</h2>
      <Box
        className="editbox"
        component="form"
        onSubmit={(e) => handleEdit(e)}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "400px" },
        }}
        // noValidate
        // autoComplete="off"
      >
        <div>
          <TextField
            helperText="Assign a task title. Title is required"
            id="outlined"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
            name="title"
            value={title}
          />
          <TextField
            helperText="Describe your task in detail"
            id="outlined"
            label="Description"
            onChange={(e) => setDetails(e.target.value)}
            required
            name="details"
            value={details}
          />
          <div className="rowedit">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl>
                <FormLabel id="deadline">Set Deadline *</FormLabel>
                <StaticDateTimePicker
                  aria-labelledby="deadline"
                  label="Deadline"
                  value={deadline}
                  name="deadline"
                  onChange={(newValue) => setDeadline(newValue)}
                  required
                  sx={{ width: "25ch" }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <div>Deadline : {task.deadline}</div>
                <div>
                  current set deadline:
                  {deadline ? (
                    <div>
                      <p>{deadline.$d.toLocaleDateString()},{deadline.$d.toLocaleTimeString()}</p>
                    </div>
                  ) : (
                    "not yet set"
                  )}
                </div>
              </FormControl>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl>
                <FormLabel id="remainder">Set remainder *</FormLabel>
                <StaticDateTimePicker
                  aria-labelledby="remainder"
                  label="Set Remainder"
                  value={remainder}
                  name="remainder"
                  onChange={(newValue) => setRemainder(newValue)}
                  required
                  sx={{ width: "25ch" }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <div>Remainder : {task.remainder}</div>
                <div>
                  current set remainder:
                  {remainder ? (
                    <div>
                      <p>{remainder.$d.toLocaleDateString()},{remainder.$d.toLocaleTimeString()}</p>
                    </div>
                  ) : (
                    "not yet set"
                  )}
                </div>
              </FormControl>
            </LocalizationProvider>
          </div>
          <FormControl>
            <FormLabel id="status">Status of the task *</FormLabel>
            <RadioGroup
              aria-labelledby="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <FormControlLabel
                control={<Radio />}
                label="completed"
                value="completed"
              />
              <FormControlLabel
                control={<Radio />}
                label="in progress"
                value="inprogress"
              />
              <FormControlLabel
                control={<Radio />}
                label="not yet started"
                value="notyetstarted"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="rowedit">
          <Button onClick={() => navigate("/dashboard")}>Cancel</Button>
          <Button type="submit">Ok</Button>
        </div>
      </Box>
    </div>
  );
}

export default EditTask;
