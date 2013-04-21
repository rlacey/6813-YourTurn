<?php
	$db = mysql_connect("sql.mit.edu", "rlacey", "data") or die(mysql_error());
	mysql_select_db("rlacey+yourturn", $db) or die(mysql_error());
?>