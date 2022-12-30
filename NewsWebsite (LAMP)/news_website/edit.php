<!DOCTYPE html>
<html lang="en">
<!-- to accept single quotation
1. I converted $story datatype to longtext, which accept single quotes and emojis too. 
2. I made value=".." instead of value='..' , which make the program does not accept double quotation, but I thought accepting single quotation was more important. -->
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Post</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">

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
    if (isset($_POST['story_id'])){
        $story_id = $_POST['story_id'];
        //echo "story_id: ". $story_id."<br>"; 
        $stmt = $mysqli->prepare("select idx, user_id, users.username, title, story, link, date_created from stories join users on (stories.user_id = users.id) where idx=$story_id order by idx");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
    
        $stmt->execute();
        $stmt->bind_result($story_id, $user_id, $username, $title, $story, $link, $date_created);
        $stmt->fetch();
    
        
        $stmt->close();
    }
   
    
    ?>

    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']) ?>" method='POST'> 
        <div class='container'>
            <div class='col-md-10'>
                <table class='table table-condensed'>
                    <thead>
                        <tr>
                            <th width='10%'>Title</th>
                            <th width width='60%'>
                                
                                <input type='text' name='title' id='title' value="<?php echo $title; ?>" maxlength='100' required>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Link</td>
                            <td>
                                <input type='text' name='link' id='link' value='<?php echo htmlentities($link); ?>' maxlength='100' required>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>
                                <?php echo htmlentities($date_created); ?>
                            </td>
                        </tr>
                        <tr>
                            <td>Writer</td>
                            <td>
                                <?php echo htmlentities($username); ?>
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

                <table class='table table-condensed'>
                    <thead>
                        <tr>
                            <td>

                                <span class='float_right'>
                                    <a href='./main.php' class='btn btn-default'>
                                        Home
                                    </a>
                                    <button type='submit' name='postEditDone' id='post__edit' class='btn btn-default'>Edit</button>
                                    <input type='hidden' name='story_id' value= <?php echo htmlentities($story_id);?> />
                                    <input type='hidden' name='token' value='<?php echo $_SESSION['token']?>'>
                                </span>

                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </form>
    <?php
   

    if (isset($_POST['postEditDone'])) {
        if (isset($_POST['token'])) {
            if(!hash_equals($_SESSION['token'], $_POST['token'])){
                die("Request forgery detected");
            }
        }
        // real_escape_string adds slash before quotation marks. So use it when content doesn't involve quotation marks. 
        // e.g. title: Yi's story  after real_escape_string -> Yi/'s story 
        $story_id = $mysqli -> real_escape_string($_POST['story_id']);
        $title = ($_POST['title']);
        $story = ($_POST['story']);
        // $link = $_POST['link'];
        $link = $mysqli -> real_escape_string($_POST['link']); 
        
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

        //echo "title: ".$title."<br>";
        //echo "story: ".$story."<br>"; 
        $stmt = $mysqli->prepare("update stories set title=?, story=?, link=? where idx=?");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        /*
        i - Integer
        d - Decimal
        s - String
        b - Blob 
        Since we're accepting three string parameters, represent it as 'sss'
        use bind_param() when you're interested in inputs NOT outputs.*/
        $stmt->bind_param('sssi', $title, $story, $link,  $story_id);

        $stmt->execute();

        $stmt->close();

        header("Location: main.php");
    }


    ?>


</body>

</html>