<?php
	session_start();
	require("db.php");
	
	$user = strip_tags(mysql_real_escape_string($_POST['owner']));
	$id = strip_tags(mysql_real_escape_string($_POST['id']));
	
	//Check valid values
	//$valid = isset($user_to) && $user_to != '' && isset($user_from) && $user_from != '' && isset($message) && $message != '';
	
	//Update records
	//if($valid){
		$query = "UPDATE users SET last_message = ".$id." WHERE user_name = '".$user."'";
		$result = mysql_query($query, $db) or die(mysql_error());

	echo $query;
	//}

?>