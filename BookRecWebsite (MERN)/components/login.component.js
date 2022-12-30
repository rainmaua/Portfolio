import { useState } from 'react'

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
			<h1>Login</h1>
			<form onSubmit={login}>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
                    autoComplete="on"
				/>
				<br />
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
                    autoComplete="new-password"
				/>
				<br />
				<input type="submit" value="Login" />
			</form>
		</div>
	)
}

export default LoginAccount