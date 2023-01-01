// SIGN UP
$(document).ready(function () {
	$("#signup_form").submit(function (event) {
		event.preventDefault();
		const username = document.getElementById("new_username").value; // Get the username from the form
		const password = document.getElementById("new_password").value; // Get the password from the form

		// Make a URL-encoded string for passing POST data:
		const data = { 'username': username, 'password': password };
		fetch("signup_check.php", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' }
		})
			.then(response => response.json())
			.then(function (data) {
				if (data.success) {
					console.log("Sign up form is successfully submitted");
					alert("Thank you for signing up. \nYour account has been successfully created.");
				}
				else {
					console.log(`Sign up form was not submitted:  ${data.message}`);
					alert(data.message);
				}
			})
			.catch(err => console.error(err));
	});
});
