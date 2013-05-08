<?php
	session_start();
	require("db.php");
	
	$owner = strip_tags(mysql_real_escape_string($_POST['owner']));
	
	$query = "SELECT * FROM messages WHERE (user_to='". $owner."' OR user_from = '" . $owner. "') ORDER BY message_ID DESC";
	$result = mysql_query($query, $db) or die(mysql_error());
	
	$arr=array();
	while($row=mysql_fetch_assoc($result)){
		$arr[]= $row;
	}
	echo json_encode($arr);

?>