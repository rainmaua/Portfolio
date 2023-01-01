<?php

//INCLUDE DATABASE

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
$stmt = $mysqli->prepare("select count(*), id from users where username=?");
// Bind the parameter
// $user = $_POST['username'];
$stmt->bind_param('s', $username);
$stmt->execute();
// Bind the results
$stmt->bind_result($cnt, $user_id);
$stmt->fetch();
$stmt->close();


if( !preg_match('/^[\w_\-]+$/', $username) ){
    echo json_encode(array(
        "success" => false,
        "message" => "Username format is invalid. Please enter a different username."
    ));
    exit;    
}
else if ($cnt > 0) {
	echo json_encode(array(
		"success" => false,
		"message" => "Username already exists.\nPlease enter a different username."
	));
	exit;
}
else {
    $password_hashed = password_hash($password, PASSWORD_BCRYPT); 
    $stmt2 = $mysqli->prepare("insert into users (username, password) values (?,?)");
    if (!$stmt2) {
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed: %s\n" //$mysqli->error"
        ));
        exit;
    }
    $stmt2->bind_param('ss', $username, $password_hashed);
    $stmt2->execute();
    $stmt2->close();
    echo json_encode(array(
        "success" => true
    ));
    exit;
}   
   
    
	
	



?>