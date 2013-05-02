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
		<meta name="author" content="Amruth Venkatraman">

		<title>Find ·Your Turn!</title>

		<!-- Load style sheets -->
	    <link href="bootstrap/css/bootstrap.css" rel="stylesheet">
	    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
	    <link href="find.css" rel="stylesheet">


	    <style type="text/css">
		    .center {
			    display: block;
			    margin-left: auto;
			    margin-right: auto
		    }

		    #page-title {
		    	text-align: center;
		    }
	    </style>

		<!-- Load any supplemental Javascript libraries here -->
		<script type="text/javascript" src="external_js/jquery-1.9.0.min.js"></script>
		<script src="bootstrap/js/bootstrap.js"></script>

		<script src='find.js'></script>
		<script type="text/javascript" src="user_management.js"></script>
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
								        <li class="active"><a href="find.php"><i class="icon-search"></i> Find</a></li>
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

				TITLE

			    ================================================== -->
			    <h1 id="page-title">Search for a toy!</h1><br>
			    <div class="hide" id="owner" name=<?php echo $username; ?> ></div>
			    
			    <div class='row-fluid'>
			    	<div class='span8 offset2'>
			    		<div class='row-fluid'>
			    			<div style='float:right'>
			    				<a id='cart' href='#' class='btn btn-link' style='font-size:medium' onclick='viewCart()'>View Cart <i class='icon-shopping-cart'></i></a>
		    				</div>
		    			</div>
		    			<div id='cartConfirmation' class='alert alert-success' style='display:none'>
	    				  <button type="button" class="close" data-dismiss="alert">&times;</button>
						  <strong>Congratulations!</strong> Your cart has been updated.
	    				</div>
	    				<div id='cartFullAlert' class='alert alert-error' style='display:none'>
	    				  <button type="button" class="close" data-dismiss="alert">&times;</button>
						  <strong>Sorry!</strong> You can only have five items in your cart :(.
	    				</div>
	    				<div id='finalCheckoutConfirmation' class='alert alert-info' style='display:none'>
	    				  <button type="button" class="close" data-dismiss="alert">&times;</button>
						  <strong>Last request has been sent!</strong>
	    				</div>
			    		<div class='row-fluid'>
					    	<div class='span3'>
						    	<ul class='nav nav-list'>
						    		<li class='nav-header'></li>
						    		<li> <div class='row-fluid'>
						    			<button class='btn btn-mini btn-primary' style='margin-right:0.5em' onclick="checkAllFilters();">Check Filters</button>
						    			<button class='btn btn-mini btn-warning' onclick="clearAllFilters();">Clear Filters</button>
						    		 </div></li>
						    		<li class='divider'></li>

						    		<li class='nav-header'></li>
					    			<li> 
					    				<form id ='searchForm' class="form-search">
											<div class="input-prepend">
												<button id='searchSubmit' type="submit" class="btn">Search</button>
												<input id='searchFilter' type="text" class="span5 search-query">
											</div>
										</form>
									</li>
									<li class='divider'></li>
									<li class='nav-header'>Toy Age Range</li>
									<li> 
										<select id="ageRangeFilter" style='width:100px'>
											<option></option>
											<option>All ages</option>
						    				<option>0 - 3</option>
							    			<option>4 - 7</option>
							    			<option>8 - 12</option>
							    			<option>13 +</option>
										</select>
									</li>
									<li class='divider'></li>
									<li class='nav-header'>Categories</li>
									<div id='categories'>
										<li> <label class='checkbox'> <input type='checkbox' value='Action Figures & Dolls' id='actionFiguresDolls' checked> Action Figures & Dolls</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Bikes, Boards & Scooters' id='bikesBoardsScooters' checked> Bikes, Boards & Scooters</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Building Sets' id='buildingSets' checked> Building Sets</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Collectibles' id='collectibles' checked> Collectibles</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Games & Puzzles' id='gamesPuzzles' checked> Games & Puzzles</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Learning Toys' id='learningToys' checked> Learning Toys</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Musical Instruments' id='musicalInstruments' checked> Musical Instruments</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Remote Control' id='remoteControl' checked> Remote Control</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Sports Equipment' id='sportsEquipment' checked> Sports Equipment</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Toy Cars' id='toyCars' checked> Toy Cars</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Trading Cards' id='tradingCards' checked> Trading Cards</li>
										<li> <label class='checkbox'> <input type='checkbox' value='Video Games' id='videoGames' checked> Video Games</li>	
										<li> <label class='checkbox'> <input type='checkbox' value='Other' id='other' checked> Other</li>	

									</div>							
								</ul>

					    	</div>
					    	<div class='span9'>
					    		<div class='row-fluid'>
							    	<div class='span4'>
									    <form class='form-inline' id="sortByForm">
							    			<label class='control-label' for='sortBy'> Sort By:</label>
								    		<select id="sortBy" style='width:100px'>
								    			<option>Name</option>
								    			<option>Date</option>
											</select>
								    	</form>
							    	</div>
							    	<div style='float:right'>
									    <form class='form-inline' id="numPerPageForm">
							    			<label class='control-label' for='numPer'> Results Per Page:</label>
								    		<select id="numPer" style='width:75px'>
								    			<option>2</option>
								    			<option>12</option>
								    			<option>20</Date>
								    			<option>40</option>
											</select>
								    	</form>
									</div>
								</div>
								<div class='row-fluid' id='toyWrapper'>

								</div>
							</div>
						</div>
					</div>
				</div> <!--row fluid> -->

				<div class="pagination" style='text-align:center'>
  					<ul>
    					<li id='firstPagingButton' class='disabled'><a href="#">First</a></li>
					    <li id ='lastPagingButton' class='disabled'><a href="#">Last</a></li>
  					</ul>
				</div>
			<!-- ================================================

			TOY DETAILS MODAL

			===================================================== -->

				<div id="modalToy" class="modal hide fade" tabindex='-1' role='dialog' aria-labelledby="toy" aria-hidden='true'>
					<div class="modal-header">
					    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					    <h3 id='modalToyTitle'></h3>
				    </div>
				    <div class='modal-body modalToyBody'>
				    	<div id='modalToyImageWrapper' class='text-center' style='height:300px'>
				    		<img id='modalToyImage' style='height:100%'></img>
			    		</div>
			    		<div>
			    			<p id='modalToyCats'></p>
		    			</div>
		    			<div>
			    			<p id='modalToyCondition'></p>
		    			</div>
		    			<div>
			    			<p id='modalToyDesc'></p>
		    			</div>
	    			</div>
	    			<div class='modal-footer'>
	    				<a href='#' onclick="$('#modalToy').modal('hide')" class='btn'>Cancel</a>
	    				<a href='messages.html' class='btn'>Message Owner</a>
	    				<a href='#' id='modifyCart' class='btn btn-primary'>Add to Cart</a>
					</div>
				</div>




			<!-- ================================================

			Cart Modal

			===================================================== -->

				<div id="modalCart" class="modal hide fade" tabindex='-1' role='dialog' aria-labelledby="toy" aria-hidden='true'>
					<div class="modal-header">
					    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					    <h3 id='Cart'>Your Cart</h3>
				    </div>
				    <div class='modal-body'>
				    	<div id='emptyCart' style='display:none'>Your cart is empty. Find some toys to add!</div>
			    		<ul id='cartList' class='nav nav-list'>
			    		</ul>
	    			</div>
	    			<div class='modal-footer'>
	    				<a href='#' onclick="$('#modalCart').modal('hide');" class='btn'>Cancel</a>
	    				<button id='checkoutButton' onclick='checkout();' class='btn'>Checkout</a>
					</div>
				</div>



			<!-- ================================================

			Checkout Modal

			===================================================== -->

				<div id="modalCheckout" class="modal hide fade" tabindex='-1' role='dialog' aria-labelledby="toy" aria-hidden='true'>
					<div class="modal-header">
					    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					    <h3>Message the toy owners</h3>
				    </div>
				    <div class='modal-body'>
		    			<div id='checkoutMessageConfirmation' class='alert alert-info' style='display:none'>
	    				  <button type="button" class="close" data-dismiss="alert">&times;</button>
						  <strong>Your message has been sent!</strong>
	    				</div>
				    	<div class='tabbable tabs-left'>
			    			<ul id='ownerList' class='nav nav-tabs'>
			    				<!-- <li class='active'><a href='#1A' data-toggle='tab'> tab 1</a></li>
			    				<li><a href='#2A' data-toggle='tab'> tab 2</a></li>
			    				<li><a href='#3A' data-toggle='tab'> tab 3</a></li>
			    				<li><a href='#4A' data-toggle='tab'> tab 4</a></li>
			    				<li><a href='#5A' data-toggle='tab'> tab 5</a></li> -->
			    			</ul>
			    			<div id='ownerMessages'class='tab-content' style='position:relative'>
			    				<!-- <div class='tab-pane active' id='1A'>
			    					<textarea style="width:28em; height:14em"></textarea>
			    				</div> -->
				    			<div class='row-fluid' id='checkoutButtonRow'>
				    				<div class='span1 offset6'>
					    				<button type='button' class='btn' onclick="$('#modalCheckout').modal('hide')">Cancel</button>
				    				</div>
				    				<div class='span1 offset2'>
				    					<button type='button' class='btn btn-primary' onclick='requestToy();'>Send</button>
				    				</div>
			    				</div>
			    			</div>

			    		</div>
	    			</div>
				</div>

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
