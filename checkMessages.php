<?php
	session_start();
	require("db.php");
	
	$user = strip_tags(mysql_real_escape_string($_POST['owner']));
	
	//Check valid values
	//$valid = isset($user_to) && $user_to != '' && isset($user_from) && $user_from != '' && isset($message) && $message != '';
	
	//Update records
	//if($valid){
		$checkedquery = "SELECT last_message FROM users WHERE user_name = '".$user."'";
		$checkedresult = mysql_query($checkedquery, $db) or die(mysql_error());
		$checked=mysql_fetch_assoc($checkedresult);
		
		$actualquery = "SELECT message_id, message FROM messages WHERE (user_to='". $user."' OR user_from = '" . $user. "') ORDER BY message_ID DESC";
		$actualresult = mysql_query($actualquery, $db) or die(mysql_error());
	
	$arr=array();
	while($row=mysql_fetch_assoc($actualresult)){
		$arr[]= $row;
	}
	
	$result = array();
	array_push($result, $checked);
	array_push($result, $arr);
	echo json_encode($result);
	//}

?>