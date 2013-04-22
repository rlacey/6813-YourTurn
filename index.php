<?php 

	session_start();  
	
	require("db.php");

    $username = NULL;
    // Check if user logged in
    if (isset( $_SESSION['username']) &&  $_SESSION['username']!='') {
        $username =  $_SESSION['username'];
        $loggedIn=true;
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
		    #toys-background {
		    	margin-top: 5%;
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
						        <li class="active"><a href="index.php"><i class="icon-home"></i> Home</a></li>
						        <li><a href="give.php"><i class="icon-heart"></i> Give</a></li>
						        <li><a href="find.php"><i class="icon-search"></i> Find</a></li>
						        <li><a href="about.php"><i class="icon-question-sign"></i> About</a></li>
					        </ul>
		            	</div><!--/.nav-collapse -->
			            <div class="nav-collapse collapse pull-right">
					        <ul class="nav">
						        <li><a href="messages.php"><i class="icon-envelope"></i> Messages</a></li>
						        <li id="user">
						        	<?php 
						        	if(!$loggedIn) { ?>
						        		<a href="#modal-register" data-toggle="modal">Login / Signup</a>
						        	<?php } else { ?>
						        		<a id="label-logout" href="" name="<?php echo $username; ?>" class="hover" onClick="logout()"><i class="icon-user"></i> <?php echo " ".$username; ?></a>
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
                <form class="form-signin">
                    <input id="register-name" type="text" name="register_name" class="input-block-level" placeholder="Username">
                    <input id="register-email" type="text" name="register_email" class="input-block-level" placeholder="Email">
                    <input id="register-password" type="password" name="register_pass" class="input-block-level" placeholder="Password">
                </form>
				 Already have an account?
                <a href="#modal-login" data-toggle="modal" data-dismiss="modal" onClick="switchModal()"> Log in.</a>
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

		MODAL - LOGIN

	    ================================================== -->
        <div id="modal-login" class="modal hide fade small-modal" tabindex="-1" role="dialog">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3>Welcome back!</h3>
            </div>
            <div class="modal-body">
                <form class="form-signin">
                    <input id="login-name" type="text" name="login_name" class="input-block-level" placeholder="Username">
                    <input id="login-password" type="password" name="login_pass" class="input-block-level" placeholder="Password">
                </form>
				 Want to sign up?
                <a href="#modal-register" data-toggle="modal" data-dismiss="modal" onClick="switchModal()"> Register.</a>
    			<div id='login-error' class='alert alert-error hide'>
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					<strong>Username and password combination not found. Please check login information.</strong>
				</div> 
            </div>
			<div class="modal-footer">
				<button class="btn btn-primary" aria-hidden="true" onClick="submitLogin()">Log In</button>
			</div> 
        </div>
	    

		<!-- =================================================

		HERO UNIT

	    ================================================== -->

		<div class="container span6 offset3">
			<div class="hero-unit" style="background-color:white;">
				<div align="center"><h1>Welcome to YourTurn!</h1></div>
				<img id="toys-background" src="images\toys-background.jpg" class="img center"style="height:35%;"/>
			</div>
			<div class="row-fluid">
				<div class="span6">
					<h2>Give</h2>
					<p>
						Is your daughter no longer interested in her dolls?
						Has your son moved on from playing with his old blocks and legos?
						Is your home getting a bit cluttered with toys your kids no longer want?
						Donate their old toys to families in need!
					</p>
					<p><a class="btn" href="give.html">Donate!</a></p>
				</div>
				<div class="span6">
					<h2>Find</h2>
					<p> 
						Looking for a gift for your daughter's upcoming birthday, but money is a bit tight? 
						How about saving some cash by starting off your son on a used guitar to kickstart his rockstar career? 
						Search for used toys, instruments, and more!
					</p>
					<p><a class="btn" href="find.html">Search!</a></p>
				</div>
			</div>
		</div> <!-- /container -->       

	</body>
</html>