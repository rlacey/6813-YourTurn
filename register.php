<?php

	session_start();	

	require("db.php");	

	$register_name = mysql_real_escape_string($_POST['register_name']);
	$register_email = mysql_real_escape_string($_POST['register_email']);
	$register_pass = mysql_real_escape_string($_POST['register_pass']);

	// Registration attempt
	if (isset($_POST["register_name"]) && isset($_POST["register_email"]) && isset($_POST["register_pass"])) {
		$user = mysql_real_escape_string($_POST["register_name"]);
		$query = "SELECT COUNT(*) FROM users WHERE USER_NAME='$user'";
		$result = mysql_query($query, $db);
		$row = mysql_fetch_array($result);

		$submit = true;

		// Is e-mail format valid?
		if (filter_var($register_email, FILTER_VALIDATE_EMAIL)) {
			echo "valid,";
		} else {
			echo "invalid,";
			$submit = false;
		}

		// Does username exist in DB?
		if ($row["COUNT(*)"] != 0) {
			echo "taken,";
			$submit = false;
		} else {
			echo "available";
		}

		if($submit) {
			$pass = sha1(mysql_real_escape_string($_POST["register_pass"]));
			$email = mysql_real_escape_string($_POST["register_email"]);
			$query = "INSERT INTO users VALUES ('$user', '$pass', '$email','NULL')";
			mysql_query($query, $db) or die(mysql_error());
			$_SESSION['username']=$user;
		}
	}
?>