<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Page</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">

</head>

<body>
    <?php

    session_start();
    include 'comment_read.php';
    require 'news_website_db.php';
    // // If user's not logged in, he or she cannot access this page. 
    // if (!isset($_SESSION['user_id'])){
    //     exit;
    // }

    // Otherwise,
    if (isset($_GET['story_id'])) {
        $story_id = $_GET['story_id'];

        //echo "story_id: " . $story_id . "<br>";

        $stmt = $mysqli->prepare("select idx, user_id, users.username, title, story, link, date_created from stories join users on (stories.user_id = users.id) where idx='$story_id'");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();
        $stmt->bind_result($story_id, $user_id, $username, $title, $story, $link, $date_created);
        $stmt->fetch();

        // echo $story;
        $stmt->close();
    } else {
        echo "no story_id delivered";
        exit;
    }



    ?>
    <div class='container'>
        <!-- <div class="col-md-10"> -->
        <table class="table table-condensed">
            <thead>
                <tr>
                    <td>
                        <span>
                            <a href="./main.php" class="btn btn-default">
                                Home
                            </a>

                        </span>
                    </td>
                </tr>
            </thead>
        </table>
        <table class="table table-condensed">
            <thead>
                <tr>
                    <th class="width10Th">Title</th>
                    <th class="width60Th">
                        <?php

                        echo htmlentities($title);
                        ?>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Link</td>
                    <td>
                        <?php
                        echo htmlentities($link);
                        ?>
                    </td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>
                        <?php
                        echo htmlentities($date_created);
                        ?>
                    </td>
                </tr>
                <tr>
                    <td>Writer</td>
                    <td>
                        <?php
                        echo htmlentities($username);
                        ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="table table-condensed">
            <tr>
                <td>
                    <span class="form-inline" role="form">
                        <?php
                        // echo htmlspecialchars(str_replace("\'", "'", $story));
                        echo $story;
                        ?>
                    </span>
                </td>
            </tr>
        </table>

        <table class="table table-condensed">
            <thead>
                <tr>
                    <td>
                        <div class='float_right'>
                            <?php
                            if (isset($_SESSION['user_id'])) {
                                if ($_SESSION['user_id'] == $user_id) { ?>

                                    <form class='form-inline' method='POST' action='edit.php'>
                                        <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
                                        <button type='submit' name='storyEdit' id='edit__btn' class='btn btn-default'>Edit</button>
                                        <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
                                    </form>

                                    <form class='form-inline' method='POST' action='delete.php'>
                                        <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
                                        <button type='submit' name='storyDelete' id='delete__btn' class='btn btn-default'>Delete</button>
                                        <input type='hidden' name='token' value='<?php echo $_SESSION['token'];?>'>
                                    </form>
                            <?php
                                } else {
                                }
                            }

                            ?>

                        </div>
                    </td>
                </tr>
            </thead>
        </table>

     
    </div>
    <form action='comment_write.php' method='POST'>
        <div class='container'>
            <table class='table table-condensed'>
                <!--rows='5' cols='20' -->
                <tr>
                    <td>
                        <textarea name='comment' class='form-control col-lg-12' placeholder='What are your thoughts?'></textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span role='form' class="float_right">
                            <button type='submit' name='commentEnter' class='btn btn-default btn-sm'>Comment</button>
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
        <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
    </form>
    <?php

    // changing order from 1.getComments 2.writeComments section to 1.writeComments section 2.getComments solved problem. Now I don't need to refresh the page twice.  

    // echo writeComments($story_id);
    if (isset($_POST['token'])) {
        if (!hash_equals($_SESSION['token'], $_POST['token'])) {
            die("Request forgery detected");
        }
    }
    echo getComments($story_id);
    ?>






</body>

</html>