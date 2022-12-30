import { useState } from 'react'
import { Navigate, useNavigate } from "react-router-dom";



function LogoutAccount() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
    const navigate = useNavigate();

	// async function logout() {
		// event.preventDefault()
        console.log("clicked logout")
        // const req = await fetch('http://localhost:5000/backend/main',{
		// 	headers: {
		// 		'x-access-token': localStorage.getItem('jwtToken'),
		// 	},

		// })

        const token = localStorage.getItem('jwtToken')
        if (token) {
            console.log("hi")
            localStorage.removeItem("jwtToken");
            navigate("/login")
        }
        
        // const data = await req.json()
        // console.log("logout data: ", data)
        // if (data.status === 'ok') {
        //     localStorage.removeItem("jwtToken");
        //     navigate("/login")

        // }
        // else {
        //     alert(data.error)
        // }
            
	// }

	// return (
	// 	<div>
	// 		<h1>Log out</h1>
	// 		<form onSubmit={logout}>
	// 			<input type="submit" value="Log out" />
	// 		</form>
	// 	</div>
	// )
}

// export default LogoutAccount