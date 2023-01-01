var login_token; 
// LOG IN
$(document).ready(function () {
	$("#login_form").submit(function (event) {
		event.preventDefault();
		const username = document.getElementById("username").value; // Get the username from the form
		const password = document.getElementById("password").value; // Get the password from the form

		// Make a URL-encoded string for passing POST data:
		const data = { 'username': username, 'password': password };
		fetch("login.php", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' }
		})
			.then(response => response.json())
			.then(function (data) {
				console.log("Raw raw: ", data); 
				// console.log("Data raw from login_ajax:  ", JSON.parse(data).success); 
				
				data = JSON.parse(JSON.stringify(data)); 
				if (data.success) {
					// pass in the token set from login_ajax.php 
					login_token = data.token;
					console.log("Login form successfully submitted. Login_token: ", login_token );
					
				
					$.post("get_cookie.php", {}, function (data) {
						console.log("Data loaded: " + data);
						let jsonData = JSON.parse(data);
						if (jsonData.success === true) {
							console.log("cookie: ", getCookie("isLoggedIn"));
							console.log("username cookie: ", getCookie("username"));
							console.log("get_cookie isLoggin = true");
                            // console.log("get_cookie token: ", getCookie("token")); 
                            // cookie_token = getCookie("token"); 
							updateCalendar();
						}
						else {
							console.log("get_cookie isLoggedin = false");
							updateCalendar();
						}
					});

				}
				else {
					console.log(`Login form was not submitted:  ${data.message}`);
                    updateCalendar();
				}
			})
			.catch(err => console.error(err));
	});
});

