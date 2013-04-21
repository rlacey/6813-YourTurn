<?php

	session_start();	

	require("db.php");	

	$user_name = mysql_real_escape_string($_POST['user_name']);
	$user_pass = mysql_real_escape_string($_POST['user_pass']);

	// Login attempt
	if (isset($user_name) && isset($user_pass)) {
        $password = sha1($_POST["user_pass"]);
        $query = "SELECT USER_PASS from users WHERE USER_NAME='" . $user_name . "'";
        $result = mysql_query($query, $db) or die(mysql_error());
        $row = mysql_fetch_assoc($result);
        if ($password === $row["USER_PASS"]) {
            $_SESSION['username']=$user_name;
            echo "valid";
        } else {
        	echo "invalid";
        }
	} else {
		echo "invalid";
	}	
?>