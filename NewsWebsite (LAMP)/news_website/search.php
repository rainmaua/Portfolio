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
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <form action="main.php" method="POST">
                            <input style='text-decoration: none;' class='btn btn-default' type="submit" name="mainPage" id="main__" value="Home">
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <br>
    <?php
    if (isset($_GET['category']) && $_GET['search']) {
        $category = $_GET['category'];
        $search_text = $_GET['search'];
        echo "<h1>\"$search_text\" search result: </h1>";
    }
    ?>

    <div class="col-md-12">
        <div class="card mt-4">
            <div class="card-body">
                <table class="table table-bordered">
                    <h2></h2>

                    <?php

                    if (isset($_GET['category']) && $_GET['search']) {
                        $category = $_GET['category'];
                        $search_text = $_GET['search'];
                        require 'news_website_db.php';
                        $stmt = $mysqli->prepare("select idx, title, users.username, date_created from stories join users on (stories.user_id = users.id) where ($category like '%$search_text%') order by id;");
                        if (!$stmt) {
                            printf("Query Prep Failed: %s\n", $mysqli->error);
                            exit;
                        }

                        $stmt->execute();

                        $stmt->bind_result($story_id, $title, $username, $date_created);
                        // check whether the result is empty, if so don't print out the table. 
                        $result = $stmt->num_rows; //->get_result()->num_rows; 
                        if (!$stmt->fetch()) {
                            echo "No results containing all your search terms were found.";
                            exit;
                        }
                        // when the table is not empty, print out the first row that's just fetched. 
                        else {?>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Username</th>
                                    <th>Date created</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <form method='GET' action='read.php'>

                                            <input type='hidden' name='story_id' value=<?php echo htmlentities($story_id); ?>>
                                            <button type='submit' class='btn btn-light'><?php echo htmlentities($title); ?></button>
                                        </form>

                                    </td>
                                    <td><?php echo htmlentities($username); ?></td>
                                    <td><?php echo htmlentities($date_created); ?></td>
                                </tr>
                            <?php
                        } ?>

                        <?php
                        // then print out the remaining rows. 
                        while ($stmt->fetch()) {
                        ?>
                            <tr>
                                <td>
                                    <form method='GET' action='read.php'>
                                        <input type='hidden' name='story_id' value=<?php echo htmlentities($story_id); ?>>
                                        <button type='submit' class='btn btn-light'><?php echo htmlentities($title); ?></button>
                                    </form>

                                </td>
                                <td><?php echo htmlentities($username); ?></td>
                                <td><?php echo htmlentities($date_created); ?></td>
                            </tr>

                        <?php
                        }
                    }

                        ?>

                            </tbody>
                </table>
            </div>
        </div>
    </div>
</body>

</html>