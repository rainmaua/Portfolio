
    <?php
      
        session_start();
        require 'news_website_db.php';
        if (isset($_POST['commentDelete'])) {
            $comment_id = $_POST['comment_id'];
            $story_id = $_SESSION['story_id']; 

            // CSRF security check
            if (isset($_POST['token'])) {
                if(!hash_equals($_SESSION['token'], $_POST['token'])){
                    die("Request forgery detected");
                }
            }

            // delete comment
            $stmt = $mysqli->prepare("delete from comments where idx='$comment_id'");
            if (!$stmt) {
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
            /*i - Integer
                 d - Decimal
                s - String
                 b - Blob 
                Since we're accepting three string parameters, represent it as 'sss'
                use beind_param() when you're interested in inputs NOT outputs.*/
            // $stmt->bind_param('iiss', $comment_id, $user_id, $date_created, $comment);
            $stmt->execute();
    
            $stmt->close();
    
            header("Location: read.php?story_id=$story_id");
        }
    
    
    ?>
