<?php
    //INCLUDE DATABASE.PHP!!!!!!!!!!!!!!!!!!!!
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



    if (isset($_SESSION['user_id']) && isset($_SESSION['token']) && isset($_SESSION['username'])){
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
            echo json_encode(array(
                "success" => false,
                "message" => "Request forgery detected"
            ));
            die("Request forgery detected");
        }
    }

    

    //This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

    // Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

    //INSERT QUERY
    if ($shared_username){
        // create a new event for the shared user here
        $stmt0 = $mysqli->prepare("insert into events (user_id, event, date, start_at, end_at, category, shared_username) select id, ?, ?, ?, ?, ?, ? from users where username=?");
        //e.g. ("insert into events (user_id, event, date, start_at, end_at, category, shared_username) select id, 'new event', '2022-10-24', '00:00:00' , '12:00:00', 'default','rainmaua' from users where username='yiryoungkim'");
    
        if(!$stmt0){
            echo json_encode(array(
                "success" => false,
                "message" => "something went wrong."
            ));
            exit;
        }
    
        $stmt0->bind_param('sssssss',$event, $date, $start_at, $end_at, $category, $username, $shared_username);
        $stmt0->execute();
        $stmt0->close();
  
    }
    $stmt = $mysqli->prepare("insert into events (user_id, event, date, start_at, end_at, category, shared_username) values (?, ?, ?, ?, ?, ?, ?)");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "something went wrong."
        ));
        exit;
    }

    $stmt->bind_param('sssssss', $user_id, $event, $date, $start_at, $end_at, $category, $shared_username);

    $stmt->execute();



    $stmt->close();



    echo json_encode(array(
        "success" => true,
        "message" => "event has been created."
    
    ));
    exit;
    ?>