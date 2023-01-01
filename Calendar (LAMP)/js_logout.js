// LOG OUT
$("#logout_btn").click(function (event) {
	console.log("logout btn is clicked");
	event.preventDefault();
	//   $(this).hide("slow");

	$.post("logout.php", {}, function (data) {
		console.log("Data loaded: " + data);
		let jsonData = JSON.parse(data);
		if (jsonData.success === true) {

			console.log("logout.php isLoggedIn = true");
			console.log("cookie: ", getCookie("isLoggedIn"));

			updateCalendar();
		}
		else {
			// user logged out
			console.log("logout.php isLoggedin = false");
			console.log("cookie: ", getCookie("isLoggedIn"));
			// to reset username
			currentUsername = "";
			isLoggedIn = false;
			updateCalendar();
            document.getElementById("nav_title").textContent = ""; 
		}
	});
});