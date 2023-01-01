<?php

// to allow cookies: 
ini_set("session.cookie_httponly", 1);
session_start(); 

if ($_SESSION['username'] != null ) {
    echo json_encode(array(
        "success" => true,
        "username" => $_SESSION['username']
    ));
    // create cookie to prove user's logged in. 
    setCookie('isLoggedIn', 'true', time()*60); 
    setCookie('username', $_SESSION['username'], time()*60); 
    exit;
}
else {
    echo json_encode(array(
        "success" => false
    ));
    // delete isLoggedIn cookie
    if (isset($_COOKIE['isLoggedIn'])){
        setCookie("isLoggedIn", "", time()-3600);
    }
    
    exit; 
}

?>