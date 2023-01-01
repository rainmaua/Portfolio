<?php 
//INCLUDE DATABASE.PHP!!!!!!!!!!!!!!!!!!!!
ini_set("session.cookie_httponly", 1);


session_start(); 
require 'database.php';
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
    die("Session hijack detected");
}else{
	    $_SESSION['useragent'] = $current_ua;
}

if (isset($_SESSION['user_id']) && isset($_SESSION['token']) && isset($_SESSION['username'])){
    $user_id = $_SESSION['user_id']; 
    $username = $_SESSION['username']; 
    $session_token = $_SESSION['token']; 
}
else {
    echo json_encode(array(
        "success" => false,
        "message" => "User is not logged in or session token is missing."
    ));
    exit;
}


header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$event_id = $json_obj['event_id'];
$token = $json_obj['token']; 

// CSRF security check
if ($token) {
    if(!hash_equals($session_token, $token)){
        echo json_encode(array(
            "success" => false,
            "message" => "Request forgery detected."
        ));
        die();
    }
}

//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
//Another query to check the event to delete is a shared event, so that 
// the other user's shared condition can be modified to not shared. 

$stmt0 = $mysqli->prepare("select shared_username, date_created from events where event_id=?"); 
if(!$stmt0){
    echo json_encode(array(
        "success" => false,
        "message" => "something went wrong."
    ));
    exit;
}
$stmt0->bind_param('i', $event_id);
$stmt0->execute();
$stmt0->bind_result($shared_username, $date_created); 
$stmt0->fetch();
$stmt0->close(); 
if ($shared_username){
    $stmt1 = $mysqli->prepare("update events set shared_username=null where shared_username=? and date_created=?"); 
    if(!$stmt1){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong."
        ));
        exit;
    }
    $stmt1->bind_param('ss', $username, $date_created); 
    $stmt1->execute();
    $stmt1->close(); 
}

// DELETE QUERY
$stmt = $mysqli->prepare("delete from events where event_id=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "something went wrong."
    ));
    exit;
}

$stmt->bind_param('i', $event_id);

$stmt->execute();



$stmt->close();



echo json_encode(array(
    "success" => true,
    "message" => "event has been deleted. "
));

exit;
?>