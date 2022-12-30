<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>

<body>
    <?php
    session_start();
    require 'news_website_db.php';
    // If user's not logged in, he or she cannot access this page. 
    if (!isset($_SESSION['user_id'])){
        exit;
    }
    
    if (isset($_POST['story_id'])) {
        $story_id = $_POST['story_id'];
        echo "story_id: ". $story_id."<br>";
        $stmt = $mysqli->prepare("select user_id, users.username, title, story, link, date_created from stories join users on (stories.user_id = users.id) where idx='$story_id'");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

    
        $stmt->execute();
        $stmt->bind_result($user_id, $username, $title, $story, $link, $date_created);
        $stmt->fetch();
    
        echo $story_id;
        $stmt->close();
    }

   

    // action="<?php echo htmlentities($_SERVER['PHP_SELF']); 
    ?>

    <form action="sendEmailFunc.php" method='POST'>
        <div class='container'>
            <div class='col-md-10'>
                <table class='table table-condensed'>

                    <tbody>
                        <tr>
                            <td width='10%'>To:</td>
                            <td width width='60%'>

                                <input type='email' name='toWhom' id='to__whom' maxlength='100' placeholder=" email address" required>
                                <!-- /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ --> 
                            </td>
                        </tr>
                        <tr>
                            <td width='10%'>Title:</td>
                            <td width width='60%'>

                                <input type='text' name='title' id='title' value="<?php echo $title; ?>" maxlength='100' required>

                            </td>
                        </tr>
                        <tr>
                            <td>Link:</td>
                            <td>
                                <input type='text' name='link' id='link' value='<?php echo htmlentities($link); ?>' maxlength='100' required>
                            </td>
                        </tr>
                        <tr>
                            <td>Date:</td>
                            <td>
                                <?php echo htmlentities($date_created); ?>
                                <input type='hidden' name='date_created' id='date__created' value='<?php echo htmlentities($date_created); ?>'>
                            </td>
                        </tr>
                        <tr>
                            <td>Writer:</td>
                            <td>
                                <?php echo htmlentities($username); ?>
                                <input type='hidden' name='username' id='user__name' value='<?php echo htmlentities($username); ?>'>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class='table table-condensed'>
                    <tr>
                        <td>
                            <span class='form-inline' role='form'>
                                <textarea name='story' id='commentParentText' class='form-control col-lg-12' ><?php echo $story; ?></textarea>
                            </span>
                        </td>
                    </tr>
                </table>


            </div>
        </div>
        <a href='./main.php' style='text-decoration: none;' class='btn btn-default'>
        Home
        </a>    
        <button type='submit' name='sendemail' id='send__email' class='btn btn-default'>Send</button>
    </form>


</body>

</html>