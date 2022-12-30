<?php

// @ https://www.youtube.com/watch?v=1LmPeHX7RRo
function getComments($story_id)
{


    require 'news_website_db.php';

    // $story_id = $_SESSION['story_id']; 
    $stmt = $mysqli->prepare("select idx, user_id, users.username, story_id, date_created, comment from comments join users on (comments.user_id = users.id) where story_id='$story_id' order by idx");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->execute();
    $stmt->bind_result($comment_id, $user_id, $username, $story_id, $date_created, $comment);


    while ($stmt->fetch()) {

?>
        <!-- <form method='POST' action='".getComments()."'> -->
        <div class="container">
            <div class="card w-100">
                <div class="card-body">
                    <div class="">
                        <small>
                            <?php
                            echo htmlentities($username);
                            ?>
                            <?php
                            echo htmlentities($date_created);
                            ?>
                        </small>
                        <p>
                            <?php
                            // used nl2br() function to accept line breaks
                            echo nl2br(htmlentities($comment));
                            ?>
                        </p>
                        <span class='float_right'>

                            <?php
                            // if a user is logged in and he/she wrote this comment, show delete/edit btn  
                            if (isset($_SESSION['user_id'])) {

                                if ($_SESSION['user_id'] == $user_id) {
                                    echo "<form class='form-inline' method='POST' action='comment_edit.php'>
                                <input type='hidden' name='comment_id' value='" . $comment_id . "'>
                                <input type='hidden' name='comment' value='" . $comment . "'>
                                <input type='hidden' name='story_id' value='" . $story_id . "'>
                                <button type='submit' name='commentEdit' id='edit__btn' class='btn btn-default'>Edit</button>
                                </form>";

                                    echo "<form class='form-inline' method='POST' action='comment_delete.php'>
                                <input type='hidden' name='comment_id' value='" . $comment_id . "'>
                                <button type='submit' name='commentDelete' id='delete__btn' class='btn btn-default'>Delete</button>
                                <!-- <a href='http://ec2-18-224-15-37.us-east-2.compute.amazonaws.com/~rainmaua/module3-group/news_website/comment_write.php' class='btn btn-default'>Reply</a>-->
                                </form>";
                                } else {
                                }
                            } else {
                                echo "<small>Please Login or Register to reply to this comment.</small>";
                            }

                            ?>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- </form> -->
<?php
        // header("Location:comment_write.php");

    }

    $stmt->close();
}





?>