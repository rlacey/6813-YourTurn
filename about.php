<?php 

	session_start();  
	
	require("db.php");

    $username = NULL;
    // Check if user logged in
    if (isset( $_SESSION['username']) &&  $_SESSION['username']!='') {
        $username =  $_SESSION['username'];
        $loggedIn=true;
    } 
    // Check if user just submitted log-in information
    else if (isset($_POST["user_name"]) && isset($_POST["user_pass"])) 
    {
        $user = $_POST["user_name"];
        $pass = sha1($_POST["user_pass"]);
        $query = "SELECT USER_PASS from users WHERE USER_NAME='" . mysql_real_escape_string($user) . "'";
        $result = mysql_query($query, $db) or die(mysql_error());
        $row = mysql_fetch_assoc($result);
        if ($pass == $row["USER_PASS"]) {
            $_SESSION['username']=$user;
            $username =  $_SESSION['username'];
            $loggedIn=true;
        }
    } else {
        // User not logged in
        $loggedIn = false;
    }

?>

<html>
	<head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<meta name="description" content="">
		<meta name="author" content="Ryan Lacey">

		<title>YourTurn</title>

		<!-- Load style sheets -->
	    <link href="bootstrap/css/bootstrap.css" rel="stylesheet">
	    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet">

	    <!-- <link href='http://fonts.googleapis.com/css?family=Crafty+Girls' rel='stylesheet' type='text/css'> -->
	    <!-- <link href='http://fonts.googleapis.com/css?family=The+Girl+Next+Door' rel='stylesheet' type='text/css'> -->
	    <!-- <link href='http://fonts.googleapis.com/css?family=Permanent+Marker' rel='stylesheet' type='text/css'> -->
	    <link href='http://fonts.googleapis.com/css?family=Rock+Salt' rel='stylesheet' type='text/css'>	    

	    <style type="text/css">
	    .media {
	    	margin-bottom: 2em;
	    }
		    #page-title {
		    	text-align: center;
		    }

		    h1 {
		    	margin-bottom: 1em;
		    }	
	    </style>

		<!-- Load any supplemental Javascript libraries here -->
		<script type="text/javascript" src="external_js/jquery-1.9.0.min.js"></script>
		<script src="bootstrap/js/bootstrap.js"></script>

		<script type="text/javascript" src="user_management.js"></script>
		
	</head>

	<body>	
		
		<!-- =================================================

		NAVIGATION BAR

	    ================================================== -->
	    <div class="navbar-wrapper">
	    <!-- Wrap the .navbar in .container to center it within the absolutely positioned parent. -->
	    	<div class="container">
	    		<div class="navbar navbar-inverse">
	          		<div class="navbar-inner">
			            <!-- Responsive Navbar Part 1: Button for triggering responsive navbar (not covered in tutorial). Include responsive CSS to utilize. -->
			            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				            <span class="icon-bar"></span>
				            <span class="icon-bar"></span>
				            <span class="icon-bar"></span>
			            </button>
			            <div class="offset3"><a class="brand" href="index.php">YourTurn</a></div>
			            <!-- Responsive Navbar Part 2: Place all navbar contents you want collapsed withing .navbar-collapse.collapse. -->
			            <div class="nav-collapse collapse">
					        <ul class="nav">
						        <li><a href="index.php"><i class="icon-home"></i> Home</a></li>
						        <li><a href="give.php"><i class="icon-heart"></i> Give</a></li>
						        <li><a href="find.php"><i class="icon-search"></i> Find</a></li>
						        <li class="active"><a href="about.php"><i class="icon-question-sign"></i> About</a></li>
					        </ul>
		            	</div><!--/.nav-collapse -->
			            <div class="nav-collapse collapse pull-right">
					        <ul class="nav">
						        <li><a href="messages.php"><i class="icon-envelope"></i> Messages</a></li>
						        <li id="user">
						        	<?php 
						        	if(!$loggedIn) { ?>
						        		<a href="#modal-register" data-toggle="modal"><i class="icon-user"></i> Username</a>
						        	<?php } else { ?>
						        		<a><i class="icon-user"></i> <?php echo " ".$username; ?></a>
						        	<?php } ?>
						        	
					        	</li>
					        </ul>
		            	</div><!--/.nav-collapse -->		            	
		        	</div><!-- /.navbar-inner -->
		    	</div><!-- /.navbar -->
	        </div> <!-- /.container -->
	    </div><!-- /.navbar-wrapper -->	


		<!-- =================================================

		MODAL - REGISTER

	    ================================================== -->
        <div id="modal-register" class="modal hide fade small-modal" tabindex="-1" role="dialog">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3>Join the community!</h3>
            </div>
            <div class="modal-body">
                <form class="form-signin" action="register.php" method="post">
                    <input id="register-name" type="text" name="register_name" class="input-block-level" placeholder="Username">
                    <input id="register-email" type="text" name="register_email" class="input-block-level" placeholder="Email">
                    <input id="register-password" type="password" name="register_pass" class="input-block-level" placeholder="Password">
                </form>
    			<div id='register-error-email' class='alert alert-error hide'>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					<strong>Invalid e-mail!</strong>
					<br>
					Enter e-mail address again.
				</div>  
    			<div id='register-error-username' class='alert alert-error hide'>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					<strong>Invalid username!</strong>
					<br>
					Username already taken. Please choose another username.
				</div>               
            </div>
			<div class="modal-footer">
				<button class="btn btn-primary" aria-hidden="true" onClick="submitRegistration()">Register</button>
			</div>                    
        </div> 		    		
	    

		<!-- =================================================

		TITLE

	    ================================================== -->
	    <h1 id="page-title">A little bit on YourTurn</h1>

	    <div class="span4 offset3"><h2>What is YourTurn?</h2></div>

	    <div class="span6 offset3">
	    	<br>
	    	YourTurn is a student website created for the class User Interface Design and Implementation. 
	    	We were challenged to go through the iterative design process necessary to create a product with an 
	    	interface that is intuitive and effieicnt. One requirement of the project was to serve a user 
	    	population outside of ourselves. After interviewing members our our community, we found that many people
	    	expereience difficulty both in getting rid of and in finding used toys. From this YourTurn was born -- a site
	    	designed to provide an easy way for members of a community to exchange toys so that theydon't go
	    	to waste and make the day of some kids a little brighter!
		</div>

		<hr class="span6 offset3">
	    
	    <div class="span4 offset3"><h2>Designers</h2></div>

		<div class="media span6 offset3">
			<a class="pull-left" href="#">
				<img class="media-object" src="images/ryan.jpg" style="width: 200px;">
			</a>
			<div class="media-body">
			<h4 class="media-heading">
				<a href="mailto:rlacey@mit.edu?Subject=YourTurn">Ryan Lacey</a>
			</h4>
				Ryan is an undergraduate at MIT majoring in computer science with a concentration in education.
				He has been programming for three years -- gaining experience in Java, Python, Javascript, PHP, and SQL.
				After graduation Ryan intends to jump in the fast developing field of online education, perhaps to form the
				next Codeacademy or further develop giants like MIT's EdX!
			</div>
		</div>	    

		<div class="media span6 offset3">
			<a class="pull-right" href="#">
				<img class="media-object" src="images/amruth.jpg" style="width: 200px;">
			</a>
			<div class="media-body">
			<h4 class="media-heading">
				<a href="mailto:amruthv@mit.edu?Subject=YourTurn">Amruth Venkatraman</a>
			</h4>
				Amruth is a sophomore at MIT majoring in computer science. Amruth is interested in being a part of the tech world developing disruptive, innovative, cloud-based, crowd-sourcing, big data, social networks to better the human experience. He hopes that MIT will make him into an engineer who can accomplish all that and more.
			</div>
		</div>

		<div class="media span6 offset3">
			<a class="pull-left" href="#">
				<img class="media-object" src="images/jeffrey.jpg" style="width: 200px;">
			</a>
			<div class="media-body">
			<h4 class="media-heading">
				<a href="mailto:jchan927@mit.edu?Subject=YourTurn">Jeffrey Chan</a>
			</h4>
				Jeffrey is an undergraduate student at MIT double majoring in mathematics and computer science.
				He has been programming since the 9th grade with experience in Java, Python, R, and Javascript. After college, Jeffrey plans to attend graduate school in the field of statistics or machine learning.
			</div>
		</div>	

		<hr class="span">				

	</body>
</html>