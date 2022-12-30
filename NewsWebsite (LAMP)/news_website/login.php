<!--
    Login username: rainmaua, pass: 1234
    Login username: yiryoungkim, pass: 1234
    test.yiryoung@gmail.com
    Password: 1234test

    sdncnonqlfhmvsog
 -->
<!-- 
Login Page styling reference: variation#1 from https://mdbootstrap.com/docs/standard/extended/login/ 
-->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link href='http://fonts.googleapis.com/css?family=Oswald:400,300,700' rel='stylesheet' type='text/css'>


</head>

<body>
    <?php 
    session_start(); // starts session, so that e.g. $oldnum can be remembered whenever we start the session.
    require 'news_website_db.php';
   
    ?>
    <section class="vh-100">
        <div class="container-fluid h-custom">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-md-9 col-lg-6 col-xl-5">

                    <img src="image/flowerImage.webp" class="img-fluid" alt="My image2">

                </div>
                <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                    
                    <form action=" <?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
                        <h1 class="display-5">Login</h1>
                        <div class="fomr-outline mb-4">
                            <input class="form-control form-control-lg" type="text" name="username" id="user__name" placeholder="Username">

                        </div>
                        <div class="form-outline mb-3">
                            <input class="form-control form-control-lg" type="password" name="password" id="pass__word" placeholder="Password">

                        </div>

                        <input class="btn btn-outline-primary" type="submit" name="login" id="login__id" value="Log in">

                        </form>

                    </div>
                    <form action="sign_up.php" method="POST">
                        <div class="d-flex align-items-center justify-content-center pb-4">
                            <p class="mb-0 me-2">Don't have an account?</p>

                            <input class="btn btn-outline-dark" type="submit" name="signUp" id="sign__up" value="Create new">

                    </form>
                </div>
            </div>

        </div>
        </div>

    </section>
</body>

</html>

<?php


// This is a *good* example of how you can implement password-based user authentication in your web application.
// Use a prepared statement
if (isset($_POST['username']) && isset($_POST['password'])) {
    $stmt = $mysqli->prepare("select count(*), id, password from users where username=?");
    // Bind the parameter
    $user = $_POST['username'];
    $stmt->bind_param('s', $user);
    $stmt->execute();
    // Bind the results
    $stmt->bind_result($cnt, $user_id, $pwd_hash);
    $stmt->fetch();

    $pwd_guess = $_POST['password'];
    // Compare the submitted password to the actual password hash
    if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)) {
        // Login succeeded!
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user;
        // Set token. 
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
        // Redirect to your target page
        header("Location: main.php");
    } else {
        // Login failed; redirect back to the login screen
        echo "The username or password you entered is incorrect.";
    }
}

if (isset($_POST['signUp'])) {
    header("Location: sign_up.php");
    exit;
}





?>