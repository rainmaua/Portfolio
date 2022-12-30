<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>


    <?php
    require 'news_website_db.php';
    session_start();
    // If user's not logged in, he or she cannot access this page. 
    if (!isset($_SESSION['user_id'])) {
        exit;
    }
    if (isset($_POST['story_id'])) {
        $story_id = $_POST['story_id'];
        $comment_id = $_POST['comment_id'];
        $comment = $mysqli->real_escape_string($_POST['comment']);

        $stmt = $mysqli->prepare("select idx, comment, users.username, date_created from comments join users on (comments.user_id = users.id) where idx='$comment_id';");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();
        $stmt->bind_result($comment_id, $comment, $username, $date_created);
        $stmt->fetch();
        // echo $comment;
        $stmt->close();
    }


    ?>



    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']) ?>" method='POST'>
        <table class='table table-condensed'>
            <tr>
                <td>
                    <textarea name='comment' id='commentParentText' class='form-control col-lg-12' id='commend_edit_textarea'><?php echo $comment; ?></textarea>

                </td>
            </tr>
            <tr>
                <td>
                    <span class='float_right'>
                        <button type='submit' name='commentEditDone' class='btn btn-default btn-sm'>Edit</button>
                    </span>
                </td>
            </tr>
        </table>
        <input type='hidden' name='comment_id' value='<?php echo htmlentities($comment_id); ?>'>
        <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
        <input type='hidden' name='story_id' value='<?php echo htmlentities($story_id); ?>'>
        
    </form>
    <?php
    if (isset($_POST['commentEditDone'])) {
        if (isset($_POST['token'])) {
            if (!hash_equals($_SESSION['token'], $_POST['token'])) {
                die("Request forgery detected");
            }
        }

        $story_id = $_POST['story_id'];
        $comment_id = $mysqli->real_escape_string($_POST['comment_id']);
        $comment = $mysqli->real_escape_string($_POST['comment']);


        $stmt = $mysqli->prepare("update comments set comment='$comment' where idx='$comment_id'");
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
        $stmt->bind_param('is', $comment_id, $comment);
        $stmt->execute();
        header("location: read.php?story_id=$story_id");
        $stmt->close();
    }
    ?>

</body>

</html>