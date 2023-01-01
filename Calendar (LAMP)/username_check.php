<?php
// This php file is for checking the username of shared_user.

//INCLUDE DATABASE
ini_set("session.cookie_httponly", 1);

session_start();
require 'database.php';


header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$token = $json_obj['token'];

if ($username == $_SESSION['username']){
    echo json_encode(array(
		"success" => false,
		"message" => "Error: You entered your own username"
	));
	exit;
}

// CSRF security check
if ($token) {
	if(!hash_equals($_SESSION['token'], $token)){
		echo json_encode(array(
			"success" => false,
			"message" => "Request forgery detected"
		));
		die("Request forgery detected");
	}
}
// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
$stmt = $mysqli->prepare("select count(*) from users where username=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "something went wrong."
	));
	exit;
}
// Bind the parameter
// $user = $_POST['username'];
$stmt->bind_param('s', $username);
$stmt->execute();
// Bind the results
$stmt->bind_result($cnt);
$stmt->fetch();

// Compare the submitted password to the actual password hash
if ($cnt == 1) {
	echo json_encode(array(
		"success" => true,
		"message" => "Valid username"
	));
	exit;
}else{
	echo json_encode(array(
		"success"=> false,
		"message" => "Error: Incorrect Username: ".$username
	));
	exit;
}




?>