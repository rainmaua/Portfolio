<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Write Comment</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>
    <?php
    session_start();
    require 'news_website_db.php';
    if (isset($_POST['commentEnter'])) {
        if (isset($_POST['token'])) {
            if (!hash_equals($_SESSION['token'], $_POST['token'])) {
                die("Request forgery detected");
            }
        }


        if (!isset($_SESSION['username'])) {
    ?>
            <p><a href="./main.php">Home</a></p>
    <?php
            echo "Please log in to write comments.";
            exit;
        }
        if (isset($_POST['story_id']) && isset($_POST['comment'])) {
            $user_id = $_SESSION['user_id'];
            $story_id = $_POST['story_id'];
            $comment = $_POST['comment'];

            $stmt = $mysqli->prepare("insert into comments (user_id, story_id, comment)  values (?,?,?)");
            if (!$stmt) {
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }

            $stmt->bind_param('iis', $user_id, $story_id, $comment);

            $stmt->execute();

            $stmt->close();
            header("Location: read.php?story_id=$story_id");
        }
        else {
            echo "story_id or comment is missing";
        }
    }

    ?>

</body>

</html>