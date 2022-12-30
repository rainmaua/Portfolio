import React from 'react'
// import {useRef, useState, useEffect} from 'react';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

// import axios from 'axios';

function CreateAccount() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
  }, [])


  async function register(e) {
    e.preventDefault()

    const res = await fetch('http://localhost:5000/backend/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
    const data = await res.json()
    console.log(data)
    if (data.status === 'ok') {
      navigate("/login")
    }
    else {
      alert(data.error)
    }

  




  }


  // const onSubmit = (e) => {
  //   e.preventDefault();



  //   // setEmail(email)
  //   // send http post request to backend end point 'http://localhost:5000/user/add'  
  //   axios.post('http://localhost:5000/users/add', email)
  //     .then(res => console.log(res.data));
  //   // clear form 
  //   setEmail('')
  //   setPassword('')
  // }


  return (
    <div>
      <h3>Create an account</h3>
      <form onSubmit={register}>
        <div className="form-group">
          <input type="text"
            required
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
          />
          <input type="text"
            required
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='User Email'
          />
          <input type="password"
            required
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Sign up" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )

}

export default CreateAccount 