<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Write Post</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>
    <?php
    session_start();
    // If user's not logged in, he or she cannot access this page. 
    if (!isset($_SESSION['user_id'])){
        exit;
    }
    
    if (isset($_POST['token'])) {
        if (!hash_equals($_SESSION['token'], $_POST['token'])) {
            die("Request forgery detected");
        }
    }

    ?>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <form action="main.php" method="POST">
                            <input  class='btn btn-default' type="submit" name="mainPage" value="Home">
                        </form>
                    </li>
                </ul>ß
            </div>
        </div>
    </nav>
    <br>

    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']) ?>" method="POST">
        <div class="container">
            <div class="col-md-10">
                <table class="table table-condensed">
                    <thead>
                        <tr>
                            <th width="10%">Title</th>
                            <th width width="60%">
                                <input type="text" name="title" id="title" placeholder="Story title" maxlength="100" required>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Link</td>
                            <td>
                                <input type="text" name="link" id="link" placeholder="URL*" maxlength="200" required>
                            </td>
                        </tr>

                        <tr>
                            <td>Writer</td>
                            <td> <?php

                                    echo htmlentities($_SESSION['username']);
                                    ?>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table  class="table table-condensed">
                    <tr>
                        <td>
                           
                            <textarea name="story"  class="form-control col-lg-12"  placeholder="Let's get writing..."></textarea>
                            
                        </td>
                    </tr>
                </table>

                <table class="table table-condensed">
                    <thead>
                        <tr>
                            <td>
                                <span class='float_right'>
                                    <button type="submit" name="write" class="btn btn-default">Submit</button>
                                    <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>" />
                                </span>
                            </td>
                        </tr>
                    </thead>
                </table>

            </div>
        </div>
    </form>

    <?php

    // echo "Hello, " . htmlentities($_SESSION['username']) . "<br>";

    require 'news_website_db.php';
    if (empty($_POST['title']) || empty($_POST['story'])) {
        echo "Please fill out all fields";
    } else {
        // safety check 
        if (isset($_POST['token'])) {
            if (!hash_equals($_SESSION['token'], $_POST['token'])) {
                die("Request forgery detected");
            }
        }

        if (isset($_POST['title']) && isset($_POST['story'])) {


            $user_id = $_SESSION['user_id'];
            $title = $_POST['title'];
            $story = $_POST['story'];
            $link = $_POST['link'];
            // check validity of given URL
            if(!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$link)){
                echo "Please enter a valid URL.";
                exit; 
            }
            // check validity of given title
            if (preg_match('/"/', $title)) {
                // this string starts and end with a double quote
                echo "This website does not accept double quotes in title. Please enter a valid title.";
                exit; 
            }


            $stmt = $mysqli->prepare("insert into stories (user_id, title, story, link) values (?,?,?,?)");
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
            $stmt->bind_param('isss', $user_id, $title, $story, $link);
            $stmt->execute();

            $stmt->close();

            header("Location: main.php");
        }
    }

    ?>

</body>

</html>