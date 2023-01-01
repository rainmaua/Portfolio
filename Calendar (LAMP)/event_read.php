<?php 
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


if (isset($_POST['event_id'])){
    $event_id = $_POST['event_id']; 
    // formated time: 00:00:00 -> 00:00 AM/PM
    $stmt = $mysqli->prepare(
       "select 
            event_id, user_id, event, date, 
            TIME_FORMAT(start_at, '%h:%i %p') start_at, 
            TIME_FORMAT(end_at, '%h:%i %p') end_at,
            category, shared_username 
        from events join users on (events.user_id=users.id) 
        where event_id=?");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong"
        ));
    
    }
    
    $stmt->bind_param('s', $event_id);
}
else if(isset($_POST['date'])&& isset($_SESSION['username'])) {
    $date = $_POST['date'];
    $username = $_SESSION['username'];
    $event_id = ""; 
    $stmt = $mysqli->prepare("select event_id, user_id, event, date, start_at, end_at, category, shared_username from events join users on (events.user_id=users.id) where date=? and users.username =?");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong"
        ));
    
    }
    
    $stmt->bind_param('ss', $date, $username);
}


$stmt->execute();

$event_array = array(); 

$result = $stmt->get_result();

while($row = $result->fetch_assoc()){
    // create object and fill it with event info.
    // somehow just adding $row to $event_array makes parsing impossible. 


    $object = new stdClass();
    $object->event_id = htmlentities($row['event_id']);
    $object->user_id = htmlentities($row['user_id']);
    $object->event_title = htmlentities($row['event']);
    $object->event_date = htmlentities($row['date']);
    $object->start_at = htmlentities($row['start_at']);
    $object->end_at = htmlentities($row['end_at']);
    $object->category = htmlentities($row['category']); 
    $object->shared_username = htmlentities($row['shared_username']);

    // $event_array[] = json_encode($object); 
    array_push($event_array, ($object)); 
}
// echo "</ul>\n";
echo json_encode(array(
    "success" => true,
    "events_array" => json_encode($event_array)
));

$stmt->close();

?>
