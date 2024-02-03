import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AuthContext from "../context/AuthContext";
import { FormControl,FormLabel, FormControlLabel, RadioGroup, Radio, Button} from  "@mui/material";
const swal = require('sweetalert2')

function Addtask() {
    const { authTokens, user } = useContext(AuthContext);
    const [status, setStatus] = useState('')
    const [title, setTitle] = useState('');
    const[details, setDetails] = useState('');
    const [deadline, setDeadline] = useState('')
    const [remainder, setRemainder] = useState('')
    const navigate= useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault()
      const data = {
        title: title,
        details: details,
        deadline:deadline,
        remainder:remainder,
        status:status
      }
      console.log(data)
       
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/task/new/${user.userId}`,{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    if(response.status === 200){
        navigate(`/dashboard`)
        swal.fire({
            title: " New task created",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    } else {
        console.log(response.status);
        console.log("there was a server issue");
        swal.fire({
            title: "An Error Occured " + response.status,
            icon: "error",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }
}

  return (
    <div>
        <h2 style={{textAlign:'center'}}>Add new task</h2>
        <Box
      component="form"
      onSubmit={(e)=>handleSubmit(e)}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      // noValidate
      // autoComplete="off"
    >
      <div>
        <TextField
          helperText = 'Assign a task title. Title is required'
          id="outlined"
          label="Title"
          onChange={(e)=>setTitle(e.target.value)}
          required
        />
        <TextField
          helperText = 'Describe your task in detail' 
          id="outlined"
          label="DeScription"
          onChange={(e)=>setDetails(e.target.value)}
          required
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
             <StaticDateTimePicker
              label="Deadline"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              required
              sx={{width:"25ch"}}
              renderInput={(params) => <TextField {...params}/>}
              />

            <StaticDateTimePicker
              label="Set Remainder"
              value={remainder}
              onChange={(newValue) => setRemainder(newValue)}
              required
              sx={{width:"25ch"}}
              renderInput={(params) => <TextField {...params}/>}
              />
          </LocalizationProvider>
        <FormControl>
          <FormLabel id='status'>
            Status of the task
          </FormLabel>
          <RadioGroup 
          aria-labelledby='status' 
          name='status'
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          >
              <FormControlLabel control={<Radio/>} label="completed" value = "completed"/>
              <FormControlLabel control={<Radio/>} label="in progress" value = "inprogress"/>
              <FormControlLabel control={<Radio/>} label="not yet started" value = "notyetstarted"/>
          </RadioGroup>
        </FormControl>
      </div>
      <Button type='submit'>Create</Button>
    </Box>
    </div>
  )
}

export default Addtask