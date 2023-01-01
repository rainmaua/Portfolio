<?php
ini_set("session.cookie_httponly", 1);
session_start(); 
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
    die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}

require 'database.php';
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])&& isset($_SESSION['token'])){
    $user_id = $_SESSION['user_id']; 
    $session_token = $_SESSION['token']; 
    $username = $_SESSION['username'];
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
$event_id = (int) $json_obj['event_id']; 
$event = $json_obj['event'];
$date = $json_obj['date']; 
$start_at = $json_obj['start_at'].":00";
$end_at = $json_obj['end_at'].":00"; 
$category = $json_obj['category']; 
$shared_username = $json_obj['shared_username']; 


$token = $json_obj['token'];
if (!preg_match('/^\d{4}-\d{2}-\d{2}/', $date) && $date!=null){
    echo json_encode(array(
        "success" => false,
        "message" => "Date format is invalid. Please enter date in yyyy-mm-dd format."
    ));
    exit; 
}
if (!preg_match('/^\s*:00|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:00$/', $start_at)){
    echo json_encode(array(
        "success" => false,
        "message" => "First time format is invalid. Please enter time in hh:mm format. 00:00-23:59"
    ));
    exit;   
}
if (!preg_match('/^\s*:00|^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:00$/', $end_at)){
    echo json_encode(array(
        "success" => false,
        "message" => "Second time format is invalid. Please enter date in hh:mm format. 00:00-23:59"
    ));
    exit;   
}
// CSRF security check
if ($token) {
    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }
}

//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
// if the event is shared, update the shared event of the other person too. 
if ($shared_username){
    $stmt0 = $mysqli->prepare("select date_created from events where event_id=?"); 
    if(!$stmt0){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong."
        ));
        exit;
    }
    $stmt0->bind_param('i', $event_id);
    $stmt0->execute();
    $stmt0->bind_result($date_created); 
    $stmt0->fetch();
    $stmt0->close(); 

    $stmt1 = $mysqli->prepare("update events set event=?, date=?, start_at=?, end_at=?, category=? where shared_username=? and date_created=?"); 
    if(!$stmt1){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong."
        ));
        exit;
    }
    $stmt1->bind_param('sssssss', $event, $date, $start_at, $end_at, $category, $username, $date_created);
    $stmt1->execute();
    $stmt1->close(); 
}

//UPDATE QUERY
$stmt = $mysqli->prepare("update events set event=?, date=?, start_at=?, end_at=?, category=?, shared_username=? where event_id=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "something went wrong."
    ));
    exit;
}

$stmt->bind_param('ssssssi', $event, $date, $start_at, $end_at, $category, $shared_username, $event_id);

$stmt->execute();



$stmt->close();



echo json_encode(array(
    "success" => true,
    "message" => "event has been updated",
    "event"=>$event,
    "event_id"=>gettype($event_id),
    "date"=>$date,
    "end_at"=> $end_at,
    "start_at"=>$start_at
    

));

exit;
?>