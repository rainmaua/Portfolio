import React from 'react'
// import {useRef, useState, useEffect} from 'react';
import { useState, useEffect } from 'react';
import {useNavigate } from "react-router-dom";
import {Button, Form, FormGroup, Input} from'reactstrap'
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



  return (
    <div>
      <h3 className='text-center'>Create an account</h3>
      <Form onSubmit={register}>
          <FormGroup>
          <Input type="text"
            required
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Name'
          />
          </FormGroup>
          <FormGroup>
          <Input type="text"
            required
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='User Email'
          />
          </FormGroup>
          <FormGroup>
          <Input type="password"
            required
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            autoComplete="new-password"
          />
          </FormGroup>
          <Button className="btn-lg btn-info btn-block">Sign up</Button>

        
      </Form>
    </div>
  )

}

export default CreateAccount 