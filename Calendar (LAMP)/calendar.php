<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style_calendar.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <link href="jquery-ui/jquery-ui.min.css" rel="stylesheet" type="text/css">
    <script src="jquery-ui/external/jquery/jquery.js" ></script>
    <script src="jquery-ui/jquery-ui.min.js" ></script>

    <title>Calendar</title>
</head>

<body>
    <?php
    ini_set("session.cookie_httponly", 1);
    session_start();
    if (isset($_SESSION['token'])){
        $token = $_SESSION['token'];
    }
    else{
    }
 
    ?>
    <!-- Reference: https://stackoverflow.com/questions/65253543/how-to-align-nav-items-to-the-right-in-bootstrap-5 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="navbar">

        <div class="d-flex flex-grow-1">
            <span class="w-100 d-lg-none d-block">
                <!-- hidden spacer to center brand on mobile -->
            </span>
            <div id="nav_title" class="mx-5">
            </div>
        </div>
        <ul class="navbar-nav ms-auto flex-nowrap">
            <div id="signup_div">
            <!-- <li class="nav-item px-2"> -->
                <form id="signup_form" method="POST">
                    <!-- <span>Sign up</span> -->
                    <input type="text" name="username" id="new_username" placeholder="Username">
                    <input type="password" name="password" id="new_password" placeholder="Password">
                    <input type="submit" name="finish_signup" id="signup_btn" value="Sign up">
                </form>
            <!-- </li> -->
            </div>
            <div id="login_div">
            <!-- <li class="nav-item"> -->
                <form id="login_form" method="POST">
                    <input class="" type="text" name="username" id="username" placeholder="Username">
                    <input class="" type="password" name="password" id="password" placeholder="Password">
                    <input class="" type="submit" name="login" id="login_btn" value="Log in">
                </form>
            <!-- </li> -->
            </div>
            
            <li class="nav-item">
                <button type="button" class="btn btn-default px-5" name="logout" id="logout_btn">Log out</button>

            </li>
        </ul>



    </nav>

    <?php
    //------------------------------------------------------------------------------------

    require 'database.php';
    // if (isset($_POST['token'])) {
    //     if (!hash_equals($_SESSION['token'], $_POST['token'])) {
    //         die("Request forgery detected");
    //     }
    // }
    // echo "login token: ".$_SESSION['token'];
    ?>

    <div class="container">
        <div class="calendar">

            
            <button id="prev_month_btn">&lt;</button>
            <button id="next_month_btn">&gt;</button>
            
            <span id="current_date_display"></span>

            <table class="table table-bordered " id="calendar_table">
                <thead>
                    <tr id="week_header">
                        <th class="day-header" scope="col">SUN</th>
                        <th class="day-header" scope="col">MON</th>
                        <th class="day-header" scope="col">TUE</th>
                        <th class="day-header" scope="col">WED</th>
                        <th class="day-header" scope="col">THU</th>
                        <th class="day-header" scope="col">FRI</th>
                        <th class="day-header" scope="col">SAT</th>
                    </tr>
                </thead>

            </table>
            <dialog class="modal_1" id="modal_1">
                <!-- to show dialog, you can do <dialog open class="modal" id="modal"> -->
                Event:
                <div id="display_title"></div>
                <span id="display_date"></span>
                <span id="display_start_at"></span> -
                <span id="display_end_at"></span>
                <br>
                Category:
                <span id="display_category"></span>
                <span id="display_category_hidden"></span>
                <span id="display_event_id"></span>
                <br>
                Shared with:
                <span id="display_shared_username"></span>
                <hr>
                <button class="update-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="close-btn">Close</button>

                <!-- Common error: event token:  <br />
                <b>Notice</b>:  Undefined index: token in <b>/home/rainmaua/public_html/module5-group/calendar.php</b> on line <b>119</b><br />
                 -->
            </dialog>

            <!-- Reference: https://www.youtube.com/watch?v=b16V25eNyJY -->
            <!-- Dialog for saving and updating events -->
            <form id="submit_form" method="POST">
                <div>
                    <input type="text" id="event_title" name="event_title" class="event-title" placeholder="title"
                        required>
                </div>
                <div>
                    <input type="text" id="date" name="date" class="date" placeholder="yyyy-mm-dd" required >
                    <input type="text" id="start_at" name="start_at" class="start_at" placeholder="hh:mm" > -
                    <input type="text" id="end_at" name="end_at" class="end_at" placeholder="hh:mm" >
                    <label for="category">Category:</label>
                    <select name="category" id="category">
                        <option id="default" value="default">Main</option>
                        <option id="event_" value="event_">Event</option>
                        <option id="to_do" value="to_do">To Do</option>
                        <option id="learning" value="learning">Learning</option>
                        <option id="reward" value="reward">Reward</option>
                        <option id="workout" value="workout">Workout</option>
                    </select>
                    <br>

                    <input type="checkbox" id="share_event_btn" value="false" >Share Event<br>
                    <div id="share_container">
                        <!-- <input type="button" id="add_user_btn" value="+">
                        <input type="button" id="delete_user_btn" value="-"><br> -->
                        <input type="text" id="shared_user_0" placeholder="username to share event" >

                    </div>

                    <input type="hidden" id="submit_event_id" name="event_id" class="event_id" >
                    <input type="hidden" id="token"  value="<?php echo $token;?>" >
                </div>
                <div>
                    <input type="submit" id="submit_event_btn" name="submit" value="Save" >
                </div>
            </form>

            <div id="temp_value">
            </div>

            <!-- Note: these javaScript files should stay right next to each other to share global variables. 
            Don't change their locations in this file -->
            <script src="js_calendar_library.js"></script>
            <script src="js_calendar.js"></script>
            <script src="js_signup.js"></script>
            <script src="js_login.js"></script>
            <script src="js_logout.js"></script>
            <script src="js_event_save.js"></script>

        </div>
    </div>
</body>

</html>