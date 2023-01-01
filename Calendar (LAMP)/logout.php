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
        echo json_encode(array(
            "success" => false
        ));
        // remove cookies before destorying session
        if (isset($_COOKIE['isLoggedIn'])){
            setCookie("isLoggedIn", "", time()-3600);
        }
        if (isset($_COOKIE['username'])){
            setCookie("username", "", time()-3600);
        }
       
        session_destroy();
        
        // header("Location: calendar.php");
        
        exit;
    ?>