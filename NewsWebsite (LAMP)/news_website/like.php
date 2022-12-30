<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <title>Document</title>
</head>

<body>
   
    <?php
    // Refernce: http://yoonbumtae.com/?p=3287

    ?>
    <?php
    // Create and show button 
    session_start(); 
    if (!isset($_SESSION['user_id'])){
        exit;
    }
    else {
        $user_id = $_SESSION['user_id']; 
    }
                      
    require 'news_website_db.php';
    $stmt = $mysqli->prepare("SELECT idx, like_count FROM stories ORDER BY idx");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->execute();
    $stmt->bind_result($story_id, $like_count);
    

    while ($stmt->fetch()) {
    ?>
        <tr>
            <th scope='row'>
            <td class="like-container">
                <button class="likeBtn" type="button" data-story-id="<?php echo htmlentities($story_id); ?>">
                    <span class="heart-shape">♡</span> 
                    <span class="like-count">
                        <?php echo htmlentities($like_count); ?>
                    </span>
                    <input type="hidden" class="user-id" value="<?php echo htmlentities($user_id); ?>">
                </button>
            </td>

        </tr>
    <?php 
    } 
    $stmt->close();
    ?>

    <!-- Jquery --> 
    <script>
        $(".likeBtn").on("click", function(e) {
            alert("like btn clicked");
            var button = $(e.currentTarget || e.target)
            var likeCount = button.find(".like-count")
            var heartShape = button.find(".heart-shape")
            // var userId = button.find(".user-id")
            $.post("./like_edit.php", {
                storyId: button.data("storyId"),
              
            }, function(result) {
                alert("storyId passed");
                alert(result);
                var addCount = (result == "like" ? 1 : result == "unlike" ? -1 : 0)
                likeCount.text(+likeCount.text() + addCount)
                heartShape.text(result == "like" ? "♥" : result == "unlike" ? "♡" : "♡")
            })

        })
    </script>


</body>

</html>