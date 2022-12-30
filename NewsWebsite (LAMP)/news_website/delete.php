<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>
    <?php
    session_start();
    function deleteStories()
    {

        if (isset($_POST['storyDelete'])) {
            require 'news_website_db.php';
            $story_id = $_POST['story_id'];

            // CSRF Security check 
            if (isset($_POST['token'])) {
                if(!hash_equals($_SESSION['token'], $_POST['token'])){
                    die("Request forgery detected");
                }
            }
            // create query
            $stmt0 = $mysqli->prepare("delete from comments where story_id='$story_id'");
            if (!$stmt0) {
                // delete comments linked to this story first. 
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
            $stmt0->bind_param('i', $story_id);
            $stmt0->execute();
            $stmt0->close(); 

            
            $stmt = $mysqli->prepare("delete from stories where idx='$story_id'");
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
            $stmt->bind_param('i', $story_id);
            $stmt->execute();

            $stmt->close();
            
            header("Location: main.php");
        }
    }
    deleteStories();
    ?>
</body>

</html>