import React, { useEffect, useState } from 'react'
import { redirect } from "react-router-dom";
import jwt from 'jsonwebtoken'
import {Button } from 'reactstrap'
// localStorage allows users to save data as key-value pairs in the browser
// it does not clear data when the browser closes. 
const Contact = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    

    async function sendEmail(event) {
        event.preventDefault()

        const req = await fetch('http://localhost:5000/backend/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('jwtToken'),
            },
            body: JSON.stringify({
                name,
                email,
                title,
                description,
            }),
        })

        const data = await req.json()
        console.log("contact data: ", data)
        if (data.status === 'ok') {
            alert(data.message)
        } else {
            alert(data.error)
        }
    }




    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        console.log("token: ", token)
        if (token) {
            const user = jwt.decode(token)
            console.log(user)
            // if somethings goes wrong with user, redirect to login page. 
            if (!user) {
                localStorage.removeItem('jwtToken')
                return redirect("/login")
            }
            // if user exists 
            else {
                
            }
        }
    }, [])


    return (
        <div>
            <div className="writing-section">
                <span className="page-title" id="page_title">Contact</span>
            </div>
            <div className="contact-container">
                <form className="contact-form" onSubmit={sendEmail}>
                    <h3>GET IN TOUCH</h3>
                    <input type="text"
                        required
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Your Name'
                        autoComplete="new-password"
                    />
                    <input type="text"
                        required
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Email Address'
                        autoComplete="new-password"
                    />
                    <input type="text"
                        required
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='Subject'
                    />
                    <textarea 
                        id="message" 
                        rows="4" 
                        value={description}
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="How can we help you?"
                    ></textarea>

                    <Button className="contact-submit-btn" >
                        Submit Message
                    </Button>
                </form>
            </div>
        </div>
    )



}

export default Contact