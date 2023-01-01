<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Id and password</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">

    
</head>

<body>
<section class="vh-100">
    <div class="container-fluid h-custom">
    
    <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
        <h1>Sign up</h1>
        <input type="text" name="username" id="user__name" placeholder="Username">
        <input type="password" name="password" id="pass__word" placeholder="Password">
        <input type="submit" name="finish_signup" id="signup__finished" value="Enter">

    </form>
    </div>
</section>
    <?php
    session_start();
    // When you click this php, $stmt query is enabled.
    require 'database.php';
    

    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT); 
        $existsUserId = $mysqli->query("select username from users where username='$username'");
        if ($existsUserId->num_rows == 0) {
            $stmt = $mysqli->prepare("insert into users (username, password) values (?,?)");
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
            $stmt->bind_param('ss', $username, $password);

            $stmt->execute();

            $stmt->close();
            echo "Login succeeded";
            header("Location: login.php");
        } else {
            echo "Username already exists. Please enter a different username.";
        }
    }
    ?>
</body>

</html>