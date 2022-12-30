import { useState } from 'react'
import { Link } from 'react-router-dom';
import {Button, Form, FormGroup, Input} from'reactstrap'

// Login form styling; https://www.youtube.com/watch?v=XHPL-rX9m-Q
function LoginAccount() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function login(event) {
		event.preventDefault()
        console.log("hi")
		const response = await fetch('http://localhost:5000/backend/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
		const data = await response.json()
		if (data.user) {
			// store token 
			localStorage.setItem('jwtToken', data.user)
			alert('Successfully logged in')
            // move to the main page 
			window.location.href = '/'
		} else {
			alert('Your username or password is incorrect')
		}
	}

	return (
		<div>

			<Form className ="login-form" onSubmit={login}>
				<h4 className="text-center">Welcome to <span className='font-weight-bold'>Book Recommendations</span></h4>
				<FormGroup>
				<Input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
                    autoComplete="on"
				/>
				</FormGroup>
				<FormGroup>
				<Input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
                    autoComplete="new-password"
				/>
				<br />
				{/* <input type="submit" value="Login" /> */}
				<Button className="btn-lg btn-dark btn-block">Log in</Button>
				</FormGroup>
				<div className="text-center">
					<Link to="/register" className="nav-link">Register</Link>
				</div>

			</Form> 
		</div>
	)
}

export default LoginAccount


