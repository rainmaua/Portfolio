<!DOCTYPE html>
<html lang="en">


<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments</title>
    <link rel="stylesheet" href="css/style.css"> 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>
    <div class="card w-100">
        <div class="card-body p-4">
            <div class="">
                <h5>Johny Cash</h5>
                <p class="small">3 hours ago</p>
                <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                    ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus
                    viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                    Donec lacinia congue felis in faucibus ras purus odio, vestibulum in
                    vulputate at, tempus viverra turpis.
                </p>
                <span style='float:right'>
                <button type="submit" name="edit" id="edit__btn" class="btn btn-default">Edit</button>
                <!-- <button type="submit" name="reply" id="reply__btn" class="btn btn-default">Reply</button> -->
                <a href="http://ec2-18-224-15-37.us-east-2.compute.amazonaws.com/~rainmaua/module3-group/news_website/comment.php" style="text-decoration: none;" class="btn btn-default">
                    Reply
                </a>
            </span>
            </div>
            
        </div>

    </div>
</body>

</html>

<!-- $stmt = $mysqli->prepare("select idx, date_created  from comments order by date_created desc limit 1");
            if (!$stmt) {
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }

            $stmt->execute();
            $stmt->bind_result($comment_id, $date_created);
            $stmt->fetch(); -->



            <?php
        require 'news_website_db.php';
        if (isset($_POST['commentEditDone'])) {
            $story_id = $_POST['story_id'];
            $comment_id = $_POST['comment_id'];
            $user_id = $_POST['user_id'];
            $date_created = $_POST['date'];
            $comment = $_POST['comment'];
            // $query = "insert into comments (user_id, date_created, comment ) 
            //         values ('$user_id', '$date', '$comment') ";
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
            $stmt->bind_param('iiss', $comment_id, $user_id, $date_created, $comment);
            $stmt->execute();
            $stmt->close();
        }
        echo "Yi's files<br>";
       
        echo htmlentities("Yi's files <br>"); 
        echo htmlspecialchars("Yi's files<br>"); 


    ?>


<table class="table table-condensed">
        <thead>
            <tr>
                <td>
                    <div class='float_right'>
                        <div class="container">
                            <div class="row">
                                <!-- Search box -->
                                    <div class="col-6">
                                    <form method="GET">

                                   
                               
                                    <div class="input-group">
                                        <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value="<?php if (isset($_GET['search'])) {
                                                                                        echo $_GET['search'];
                                                                                    } ?>"/>
                                        <input type="button" class="btn btn-outline-dark" name="submitSearch" value="Search">
                                    </div>
                                    
                                
                                    </form>
                                    
                                    </div>

                                <?php

                                session_start();
                                if (isset($_SESSION['user_id'])) {
                                ?>
                                    <div class="col">
                                        <form action="write.php" method="POST">
                                            <input style='text-decoration: none;' class='btn btn-default' type="submit" name="write" id="write__" value="Write">
                                        </form>
                                    </div>
                                    <div class="col">
                                        <form action="logout.php" method="POST">
                                            <input style='text-decoration: none;' class='btn btn-default' type="submit" name="logout" id="logout__id" value="Log out">
                                        </form>
                                    </div>


                                <?php
                                } else {
                                ?>
                                    <div class="col">
                                        <form action="login.php" method="POST">
                                            <input style='text-decoration: none;' class='btn btn-default' type="submit" name="login" id="login__id" value="Log in">
                                        </form>
                                    </div>
                                <?php
                                }
                                ?>

                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </thead>
    </table>