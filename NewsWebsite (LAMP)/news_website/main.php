<!-- 
Things that can be fixed/updated
1. reply to reply
2. fix auto_increment index to not get infinitely large. e.g. remove idx=6, new element idx should be 6 not 7. 
3. add 'like' button

-->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main Page</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>

    <?php
    session_start();


    ?>
    <nav class="navbar navbar-expand-lg bg-light">


        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <?php


            if (isset($_SESSION['user_id'])) {
            ?>

                <li class="nav-item">
                    <form action="write.php" method="POST">
                        <input class='btn btn-default' type="submit" name="write" id="write__" value="Write">
                        <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
                    </form>
                </li>
                <li class="nav-item">
                    <form action="logout.php" method="POST">
                        <input class='btn btn-default' type="submit" name="logout" id="logout__id" value="Log out">
                    </form>
                </li>

            <?php
            } else { ?>
                <li class="nav-item">
                    <form action="login.php" method="POST">
                        <input class='btn btn-default' type="submit" name="login" id="login__id" value="Log in">
                    </form>
                </li>
            <?php
            } ?>

        </ul>


        <!-- Search Function -->
        <form class="d-flex" action="search.php" method="GET" role="search">

            <select name="category">
                <option value="title">Title</option>
                <option value="users.username">Writer</option>
                <option value="story">Content</option>
            </select>
            <input class="form-control me-2" type="text" name="search" placeholder="Search" aria-label="Search" value="<?php if (isset($_GET['search'])) {
                                                                                                                        } ?>">
            <button type="submit" class="btn btn-outline-dark">Search</button>
        </form>
    </nav>
    <br>
    <?php


    //------------------------------------------------------------------------------------
    // $stmt0 = $mysqli->prepare()
    require 'news_website_db.php';
    if (isset($_POST['token'])) {
        if (!hash_equals($_SESSION['token'], $_POST['token'])) {
            die("Request forgery detected");
        }
    }



    $stmt = $mysqli->prepare("select idx, user_id, users.username, title, story, link, date_created, like_count from stories join users on (stories.user_id = users.id) order by idx");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->execute();
    $stmt->bind_result($story_id, $user_id, $username, $title, $story, $link, $date_created, $like_count);
    // $story = addslashes($story); 




    while ($stmt->fetch()) {
        $_SESSION['story_id'] = $story_id;

        // echo $story_id;
        // $story = str_replace("\'", "'", $story);
    ?>

        <div class="container">
            <div class="col-md-10">
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
                            <div class="form-inline" role="form">
                                <?php
                                echo htmlentities($story);
                                ?>
                            </div>
                        </td>
                    </tr>
                </table>

                <table class="table table-condensed">
                    <thead>
                        <tr>
                            <td>
                                <div class='float_right'>
                                    <?php

                                    //<?php echo $_SESSION['token'];
                                    if (isset($_SESSION['user_id'])) {
                                        if ($_SESSION['user_id'] == $user_id) {
                                    ?>
                                            <form class='form-inline' method='POST' action='edit.php'>
                                                <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
                                                <button type='submit' name='postEdit' class='btn btn-default'>Edit</button>
                                                <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
                                            </form>

                                            <form class='form-inline' method='POST' action='delete.php'>
                                                <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
                                                <button type='submit' name='storyDelete' class='btn btn-default'>Delete</button>
                                                <input type='hidden' name='token' value='<?php echo $_SESSION['token'] ?>'>
                                            </form>
                                            <form class='form-inline' method='GET' action='read.php'>
                                                <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>
                                                <button type='submit' class='btn btn-default'>View</button>
                                            </form>
                                            <form class='form-inline' method='POST' action='sendEmailForm.php'>
                                                <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>

                                                <button type='submit' class='btn btn-default'>Email</button>
                                            </form>
                                        <?php
                                        } else { ?>
                                            <form class='form-inline' method='GET' action='read.php'>
                                                <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>

                                                <button type='submit' class='btn btn-default'>View</button>
                                            </form>
                                            <button class="likeBtn" type="button" data-story-id="<?php echo htmlentities($story_id); ?>">
                                                <span class="heart-shape">♡</span>
                                                <span class="like-count">
                                                    <?php echo htmlentities($like_count); ?>
                                                </span>
                                                <input type="hidden" class="user-id" value="<?php echo htmlentities($user_id); ?>">
                                            </button>
                                        <?php
                                        }
                                    } else { ?>
                                        <form class='form-inline' method='GET' action='read.php'>
                                            <input type='hidden' name='story_id' value='<?php echo $story_id; ?>'>

                                            <button type='submit' class='btn btn-default'>View</button>
                                        </form>
                                    <?php
                                    }

                                    ?>

                                </div>
                            </td>
                        </tr>
                    </thead>
                </table>

            </div>
        </div>
    <?php
    }

    $stmt->close();


    ?>






    <script>
        $(".likeBtn").on("click", function(e) {
            // alert("like btn clicked");
            var button = $(e.currentTarget || e.target)
            var likeCount = button.find(".like-count")
            var heartShape = button.find(".heart-shape")
            // alert(heartShape.text()); 
            $.post("./like_edit.php", {
                storyId: button.data("storyId"),
              
            }, function(result) {
                // alert("storyId passed");
                
                result = result.trim(); 
                // alert(result);
                var addCount = (result == "like" ? 1 : result == "unlike" ? -1 : 0)
                likeCount.text(+likeCount.text() + addCount)
                heartShape.text(result == "like" ? "♥" : result == "unlike" ? "♡" : "♡")     // heartShape.text(result == "liked" ? "♥" : "♡")
                // alert(addCount); 
                // alert(likeCount);
                // alert(heartShape.text()); 
               
            })

            // location.reload(true);
        })
        
    </script>

</body>

</html>