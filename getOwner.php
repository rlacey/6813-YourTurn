<?php
	session_start();
	require("db.php");
	
	$id = strip_tags(mysql_real_escape_string($_POST['id']));
	
	//Check valid values
	//$valid = isset($user_to) && $user_to != '' && isset($user_from) && $user_from != '' && isset($message) && $message != '';
	
	//Update records
	//if($valid){
		$query = "SELECT owner FROM toys WHERE toy_id = '".$id."'";
		$result = mysql_query($query, $db) or die(mysql_error());

	echo json_encode(mysql_fetch_assoc($result));
	//}

?>