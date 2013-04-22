<?php
	
	session_start();

	require("db.php");

	$owner = strip_tags(mysql_real_escape_string($_POST['owner']));
	$toy_name = strip_tags(mysql_real_escape_string($_POST['toy_name']));
	$toy_age_range = strip_tags(mysql_real_escape_string($_POST['toy_age_range']));
	$toy_condition = strip_tags(mysql_real_escape_string($_POST['toy_condition']));
	$toy_category = strip_tags(mysql_real_escape_string($_POST['toy_category']));
	$toy_description = strip_tags(mysql_real_escape_string($_POST['toy_description']));
	$toy_photo = strip_tags(mysql_real_escape_string($_POST['toy_photo']));

	$valid = isset($toy_name) && $toy_name!='' && isset($toy_age_range) && $toy_age_range!='' && isset($toy_condition) && $toy_condition!='' && isset($toy_category) && $toy_category!=''
				&& isset($toy_description) && isset($toy_photo) && $toy_photo!='';

	if ($valid) 
	{
		$query = "INSERT INTO toys VALUES ('$owner', '$toy_name', '$toy_age_range', '$toy_condition', '$toy_category', '$toy_description', '$toy_photo')";
		mysql_query($query, $db) or die(mysql_error());
		echo $toy_name . "added!";
	} else {
		echo $owner . "\n" . $toy_name. "\n" . $toy_age_range. "\n" . $toy_condition. "\n" . $toy_category. "\n" . $toy_description. "\n" . $toy_photo;
	}

?>