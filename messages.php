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

		<title>Messages · YourTurn</title>

		<!-- Load style sheets -->
	    <link href="bootstrap/css/bootstrap.css" rel="stylesheet">
	    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet">

	    <!-- <link href='http://fonts.googleapis.com/css?family=Crafty+Girls' rel='stylesheet' type='text/css'> -->
	    <!-- <link href='http://fonts.googleapis.com/css?family=The+Girl+Next+Door' rel='stylesheet' type='text/css'> -->
	    <!-- <link href='http://fonts.googleapis.com/css?family=Permanent+Marker' rel='stylesheet' type='text/css'> -->
	    <link href='http://fonts.googleapis.com/css?family=Rock+Salt' rel='stylesheet' type='text/css'>	    

		<!-- Load any supplemental Javascript libraries here -->
		<script type="text/javascript" src="external_js/jquery-1.9.0.min.js"></script>
		<script src="bootstrap/js/bootstrap.js"></script>

		<script type="text/javascript" src="user_management.js"></script>

		<style>
		    #page-title {
		    	text-align: center;
		    	padding-bottom: 20px;
		    }

			#contacts-pane {
				background-color: white;
				height: 70%;
				overflow: auto;				
			}

			#messages-pane {
				background-color: white;
				height: 70%;
				overflow: auto;				
			}		

			.contact {
				padding-top: 1px;
				padding-bottom: 1px;
				padding-left: 5px;
				padding-right: 5px;
			}

			.selected {
				background-color: #00FFFF;
			}

			ul {
			    list-style-type: none;
			}

		</style>
	</head>

	<body>
		<div id="wrap">
			<div id="main">

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
								        <li><a href="about.php"><i class="icon-question-sign"></i> About</a></li>
							        </ul>
				            	</div><!--/.nav-collapse -->
					            <div class="nav-collapse collapse pull-right">
							        <ul class="nav">
								        <li class="active"><a href="messages.php"><i class="icon-envelope"></i> Messages</a></li>
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

				TITLE

			    ================================================== -->
			    <h1 id="page-title">Messages</h1>
			    <div class="hide" id="owner" name=<?php echo $username; ?> ></div>


				<!-- =================================================

				CONTACTS PANE

			    ================================================== -->
				<div class="row-fluid">
					<div class="well tabbable tabs-left span6 offset3">
						<ul class="nav nav-tabs" id="tab-labels">
							<li id="tab-toy" class='tab-label' onClick="switchTab(this.id)"><a href="#toy" data-toggle="tab">Default User</a></li>
							<li id="tab-toy" class='tab-label' onClick="switchTab(this.id)"><a href="#toy" data-toggle="tab">User 2</a></li>
							<!-- <li id="toy2-Tab" class='tab-label' onClick="switchTab(this.id)"><a href="#toy2" data-toggle="tab">toy2</a></li> -->
						</ul>	   
						<div class="tab-content" id="tab-content">
							<div class="tab-pane active" id="content-toy">
								<div class="row-fluid">
									<div id="messages-pane" class="span11" style = "background-color: transparent;">
										<div id="message">
											<h4>Other Guy</h4>
											This is the message content. This is the message content.  This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content.  This is the message content. This is the message content. This is the message content. 
											<hr>
										</div>
										<div id="message">
											<h4>You</h4>
											This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. This is the message content. 
											<hr>
										</div>
										<div id="reply-pane">
											<textarea id="reply" class="text-form" style="width:100%; height:80px;"></textarea>
											<div id = "reply-button" style = "float:right;">
											<button id="submit-reply" class="btn" onClick="">Reply</button>
											</div>
										</div>
									</div>
								</div> <!-- /row-fluid -->
							</div> <!-- /tab pane -->
						</div> <!-- /tab content -->
						
					</div> <!-- /tabbable -->
				</div> <!-- /row-fluid-->
			</div> <!-- main -->
		</div> <!-- wrap -->


		<!-- =================================================

		FOOTER

	    ================================================== -->
		<div id="footer">
			<hr>
			<img src="images\original.png" class="img center" style="height:50px;"/>
		</div> <!-- footer -->

	</body>
</html>