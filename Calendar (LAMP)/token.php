<?php
session_start();

$refresh_token =  bin2hex(openssl_random_pseudo_bytes(32)); 
$_SESSION['token'] = $refresh_token;
echo json_encode(array(
    "token" => $refresh_token
));
exit;
 

?>