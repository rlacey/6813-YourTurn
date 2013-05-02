<?php
	session_start();
	require("db.php");

	$searchFilter = strip_tags(mysql_real_escape_string($_POST['searchFilter']));
	$ageFilter = strip_tags(mysql_real_escape_string($_POST['ageFilter']));
	$cats = $_POST['cats'];
	$numPerPage=$_POST['numPerPage'];
	$query = 'SELECT COUNT(toy_id) FROM toys WHERE ';
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
	//Count num pages in matching set
	$totalRecords = mysql_query($query,$db) or die(mysql_error());
	while($row=mysql_fetch_assoc($totalRecords)){
		$roughNumPages= $row['COUNT(toy_id)'] /$numPerPage;
		if($roughNumPages == floor($roughNumPages)){
			$numPages=$roughNumPages;
		}
		else{
			$numPages= floor()+1;
		}
	}
	echo $numPages;
?>