<?php
	session_start();
	require("db.php");

	$searchFilter = strip_tags(mysql_real_escape_string($_POST['searchFilter']));
	$ageFilter = strip_tags(mysql_real_escape_string($_POST['ageFilter']));
	$cats = $_POST['cats'];
	$query = 'SELECT * FROM toys WHERE ';
	for ($i=0;$i<count($cats);$i++){
		if ($i==0){
			$query .= "(toy_category ='" . $cats[$i] ."'";
		}
		else{
			$query .=" OR toy_category='" . $cats[$i] ."'";
		}
		if ($i==count($cats)-1){
			$query .=')';
		}
	}
	if ($ageFilter!=''){
		$query.= " AND (toy_age_range='".$ageFilter."')";
	}
	if ($searchFilter!=''){
		$query.=" AND (toy_name like '%" . $searchFilter. "%')";
	}
	$result = mysql_query($query, $db) or die(mysql_error());
	$arr=array();
	while($row=mysql_fetch_assoc($result)){
		$arr[]= $row;
	}
	echo json_encode($arr);
?>