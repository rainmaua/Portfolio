<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Send Email Page</title>
</head>
<body>
<nav>
    <a href="./main.php">Home</a>
</nav>
<h1>Send email result: </h1>
<?php

use PHPMailer\PHPMailer\PHPMailer; 

// Reference: https://www.youtube.com/watch?v=mte7LroYd74&list=LL&index=1
// Reference: https://github.com/ms181/phpmailer/blob/main/index.php
function sendmail($writer, $toWhom, $title, $link, $story){
   
    $name = $writer;  // Name of your website or yours
    $to = $toWhom;  // mail of reciever
    $subject = $title;
    $body = "Link: ".$link."<br>Story: ".$story."<br>From: Yi Ryoung's Blog";
    $from = "test.yiryoung@gmail.com";  // you email
    $password = "znfiothyyyukscef"; //"sdncnonqlfhmvsog";  // your email password
    echo "hello";
    // Ignore from here

    require_once "PHPMailer/PHPMailer.php";
    require_once "PHPMailer/SMTP.php";
    require_once "PHPMailer/Exception.php";
    $mail = new PHPMailer();

    // To Here

    //SMTP Settings
    $mail->isSMTP();
    $mail->SMTPDebug;// = 3;  //Keep It commented this is used for debugging                          
    $mail->Host = "smtp.gmail.com"; // smtp address of your email
    $mail->SMTPAuth = true;
    $mail->Username = $from;
    $mail->Password = $password;
    $mail->Port = 587;  // port
    $mail->SMTPSecure = "tls";  // tls or ssl
    $mail->smtpConnect([
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
        ]
    ]);

    //Email Settings
    $mail->isHTML(true);
    $mail->setFrom($from, $name);
    $mail->addAddress($to); // enter email address whom you want to send
    $mail->Subject = ("$subject");
    $mail->Body = $body;
    if ($mail->send()) {
        echo "Email is sent!";
    } else {
        echo "Something is wrong: <br><br>" . $mail->ErrorInfo;
    }
    // Close smtp connection
    $mail->smtpClose(); 
}


// If user's not logged in, he or she cannot access this page. 
session_start(); 
if (!isset($_SESSION['user_id'])){
    echo "user's not logged in.";
    exit;
}
else {
    echo "User's logged in!"; 
}

// toWhom title link username story
if (isset($_POST['toWhom']) && isset($_POST['title']) && isset($_POST['link']) && isset($_POST['username']) && isset($_POST['story'])){
    $toWhom = $_POST['toWhom'];
    $title = $_POST['title'];
    $link = $_POST['link'];
    $username = $_POST['username'];
    $story = $_POST['story'];

    // // check validity of given email
    // if (!filter_var($_POST['toWhom'], FILTER_VALIDATE_EMAIL)) {
    //     echo "Please enter a valid email.";
    //     exit; 
    // }
    sendmail($username, $toWhom, $title, $link, $story);
    

}
else {
    echo "values don't exist";
}
    
   ?>

</body>
</html>


