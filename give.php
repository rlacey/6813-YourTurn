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

		<title>Give · YourTurn</title>

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

		<script type="text/javascript" src="give.js"></script>
		<script type="text/javascript" src="user_management.js"></script>

	    <style type="text/css">
		    #page-title {
		    	text-align: center;
		    }	

		    .img-polaroid {
		    	max-width: 90%;
		    	width: auto
		    }	  


		    .remove {
		    	margin-left: 8px;
		    	margin-right: 5px;
		    }
	    </style>
	</head>

	<body>
		<div id="wrapper">
			<div id="content">
		

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
								        <li class="active"><a href="give.php"><i class="icon-heart"></i> Give</a></li>
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
			    <h1 id="page-title">Donate used toys!</h1>


				<!-- =================================================

				TOY FORM & TABS

			    ================================================== -->
			    <div class="row-fluid" style="overflow: auto;">
					<div class="well tabbable tabs-left span6 offset3">
						<ul class="nav nav-tabs" id="tab-labels">
							<li id="tab-toy" class='tab-label' onClick="switchTab(this.id)">
								<button type="button" class="close" >&times;</button> <a href="#toy" data-toggle="tab">Default Toy</a>
							</li>
						</ul>	   
						<div class="tab-content" id="tab-content">
							<div class="tab-pane active" id="content-toy">
								<div class="row-fluid">

									<div class="span4">

										<!-- Text input-->
										<div class="control-group">
											<label class="control-label"><strong>Toy Name</strong></label>
											<div class="controls">
												<input id="toyName" type="text" placeholder="" class="input-large text-form" required="">
											</div>
										</div>

										<!-- Select Basic -->
										<div class="control-group">
											<label class="control-label"><strong>Age Range</strong></label>
											<div class="controls">
												<select id="ageRange" class="input-xlarge" style="width:auto;">
													<option>All ages</option>
													<option>0 - 3</option>
													<option>4 - 7</option>
													<option>8 - 12</option>
													<option>13 +</option>
												</select>
											</div>
										</div>

										<!-- Select Basic -->
										<div class="control-group">
											<label class="control-label"><strong>Condition</strong></label>
											<div class="controls">
												<select id="condition" class="input-xlarge" style="width:auto;">
													<option>New</option>
													<option>Lightly used</option>
													<option>Heavily used</option>
												</select>
											</div>
										</div>

										<!-- Select Basic -->
										<div class="control-group">
											<label class="control-label"><strong>Category</strong></label>
											<div class="controls">
												<select id="category" class="input-xlarge" style="width:auto;">
													<option>Action Figures & Dolls</option>
													<option>Bikes, Boards & Scooters</option>
													<option>Building Sets</option>													
													<option>Collectibles</option>													
													<option>Games & Puzzles</option>													
													<option>Learning Toys</option>
													<option>Musical Instruments</option>													
													<option>Remote Control</option>													
													<option>Sports Equipment</option>													
													<option>Toy Cars</option>
													<option>Trading Cards</option>
													<option>Video Games</option>
												</select>
											</div>
										</div>	

										<!-- Textarea -->
										<div class="control-group">
											<label class="control-label"><strong>Description</strong></label>
											<div class="controls">                     
												<textarea id="description" class="text-form"></textarea>
											</div>
										</div>

										<!-- Button -->
										<div class="control-group">
											<div class="controls">
												<button id="addToy" class="btn" onClick="addAnotherToy()">Add another toy</button>
											</div>
										</div>						
									</div> <!-- /span4 -->

									<div class="span6 offset2">
						                
										<div class="control-group">
											<label class="control-label"></label>
											<div class="controls">
												<button class="btn" id="button-photo-url" onclick="linkToPhotoPrompt()">Link to Photo</button>
												<button class="btn" id="button-photo-upload" onClick="uploadPhotoPrompt()">Upload a Photo</button>
											</div> <!-- /controls -->
										</div> <!-- /control group -->
										<img id="toy-image" src="images\original.png" class="img-polaroid">
									</div> <!-- /span7 -->

								</div> <!-- /row-fluid -->
							</div> <!-- /tab pane -->
						</div> <!-- /tab content -->
					</div> <!-- /tabbable -->
				</div> <!-- /row-fluid -->


				<!-- =================================================

				MODAL - PHOTO LINK TO URL

			    ================================================== -->
				<div id="modal-photo-url" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="windowTitleLabel" aria-hidden="true" style="display: none;">
					<div class="modal-header">
						<a href="#" class="close" data-dismiss="modal">&times;</a>
						<h3>Enter the URL of a photo of your toy.</h3>
					</div>
					<div class="modal-body">				
						<input id="photo-url-input" type="text" placeholder="http://www.mit.edu/img/BackImage.jpg" style="width:100%">
					</div>
					<div class="modal-footer">
						<a href="#" class="btn" data-dismiss="modal">Cancel</a>
						<a href="#" class="btn btn-primary" onclick="linkToPhotoSubmit(this.parentNode.parentNode.id)">Submit</a>
					</div>
				</div>	


				<!-- =================================================

				MODAL - SUBMIT CONFIRMATION

			    ================================================== -->
				<div id="modal-submit-confirmation" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="windowTitleLabel" aria-hidden="true" style="display: none;">
					<div class="modal-header">
						<a href="#" class="close" data-dismiss="modal">&times;</a>
						<h3>Thank you for your dontation!</h3>
					</div>
					<div class="modal-body">				
						You will now be taken back to the YourTurn homepage.
					</div>
					<div class="modal-footer">
						<a href="index.html" class="btn btn-primary" onclick="closeModal(this.parentNode.parentNode.id)">OK</a>
					</div>
				</div>				


				<!-- =================================================

				SUBMIT ALL FORMS

			    ================================================== -->

			    <button class="btn btn-large btn-primary center" id="submit-toys" onClick="submitToyForms()">Submit</button>
			</div> <!-- content -->

			<!-- =================================================

			FOOTER

		    ================================================== -->
		    <div id="footer">
				<footer>
					<hr>
					<img src="images\original.png" class="img center" style="height:50px;"/>
				</footer>
			</div> <!-- footer -->
		</div> <!-- wrapper -->
	</body>
</html>