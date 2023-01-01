<?php

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
$password = $json_obj['password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
$stmt = $mysqli->prepare("select count(*), id, password from users where username=?");
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
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();

$pwd_guess = $password;
// Compare the submitted password to the actual password hash
if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
	
    $_SESSION['user_id'] = $user_id;
	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
	$token = $_SESSION['token'];
	echo json_encode(array(
		"success" => true,
		"message" => "Valid id and password",
		"token" => $token
	));
	exit;
}else{
	echo json_encode(array(
		"success"=> false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}




?>