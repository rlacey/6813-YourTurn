<?php
	session_start();
	require("db.php");
	
	$user_to = strip_tags(mysql_real_escape_string($_POST['user_to']));
	$user_from = strip_tags(mysql_real_escape_string($_POST['user_from']));
	$message = strip_tags(mysql_real_escape_string($_POST['message']));
	
	//Check valid values
	//$valid = isset($user_to) && $user_to != '' && isset($user_from) && $user_from != '' && isset($message) && $message != '';
	
	//Update records
	//if($valid){
		$current_time = time();
		$query = "INSERT INTO messages VALUES ('$user_from', '$user_to', '$message',0)";
		mysql_query($query, $db) or die(mysql_error());

	//}
	//else{
		echo $user_to . "\n" . $user_from . "\n" . $message . "\n" . $current_time;
	//}

?>