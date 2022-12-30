

<?php
session_start(); 



if (!isset($_SESSION['user_id'])){
    exit;
}
else {
    $user_id = $_SESSION['user_id']; 
}

// check story_value is received
if (!empty($_POST['storyId'])){
    $story_id = $_POST['storyId']; 
    // echo "story_id: ".$story_id."<br>"; 
    // echo "user_id: ".$user_id."<br>"; 
}
else {
    // echo "No values passed to this file.";
}


// get like_count 
require "news_website_db.php";
$story_id = $_POST['storyId']; 

$stmt0 = $mysqli->prepare("SELECT like_count FROM stories WHERE idx=?");

$stmt0->bind_param("i", $story_id); 
if (!$stmt0) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt0->execute();
$stmt0->bind_result($like_count);
$stmt0->fetch(); 

$stmt0->close();

// echo "like_count: ".$like_count."<br>"; 

// check whether it's first time user clicking the like button. 
$isPresent = false; 
require "news_website_db.php";
$story_id = $_POST['storyId']; 
   
    $stmt = $mysqli->prepare("select exists(select*from likes where story_id=$story_id and user_id=$user_id);
    ");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt->execute();
    $stmt->bind_result($userExists);
    
    while ($stmt->fetch()) {
        if ($userExists == 1) {
            $isPresent = true; 
        }
        else {
            $isPresent = false; 
        }
    } 
    
    echo $userExists != 0 ? "unlike" : "like";  
    
    $stmt->close();

// when no one clicked. Create the record of user and make the heart filled.
if ($isPresent == false) {
    // echo "this like section is empty"; 
    require "news_website_db.php";
    $story_id = $_POST['storyId']; 
    $user_id = $_SESSION['user_id']; 
    $is_like = 1; 
    $stmt2 = $mysqli->prepare("insert into likes (story_id, user_id, is_like) values (?,?,?)");
    if (!$stmt2) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt2->bind_param('iii', $story_id, $user_id, $is_like);
    $stmt2->execute();

    $stmt2->close();
    // increase like_count in stories table
    require "news_website_db.php";
    $stmt3 = $mysqli->prepare("update stories set like_count = ? where idx= ?");
    $like_count_updated = $like_count+1; 
    // echo "like_count2: ".$like_count."<br>"; 
    // echo "like_count_updated: ".$like_count_updated."<br>"; 
    $stmt3->bind_param('ii', $like_count_updated, $story_id);
    $stmt3->execute();    
    $stmt3->close();
}
else {

    // echo "this like section is filled"; 
    $story_id = $_POST['storyId']; 
    $user_id = $_SESSION['user_id']; 



    // delete record from likes table since user canceled like
    require "news_website_db.php";
    
    $is_like = 0; 
    $stmt2 = $mysqli->prepare("delete from likes  where story_id = ? and user_id = ?");
    if (!$stmt2) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt2->bind_param('ii', $story_id, $user_id);
    $stmt2->execute();

    $stmt2->close();

    // decrease like_count in stories table
    require "news_website_db.php";
    $stmt3 = $mysqli->prepare("update stories set like_count = ? where idx= ?");
    $like_count_updated = $like_count-1; 
    // echo "like_count2: ".$like_count."<br>"; 
    // echo "like_count_updated: ".$like_count_updated."<br>"; 
    $stmt3->bind_param('ii', $like_count_updated, $story_id);
    $stmt3->execute();    
    $stmt3->close();



}




?>