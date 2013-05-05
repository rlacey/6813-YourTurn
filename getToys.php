<?php
	session_start();
	require("db.php");

	$searchFilter = strip_tags(mysql_real_escape_string($_POST['searchFilter']));
	$ageFilter = strip_tags(mysql_real_escape_string($_POST['ageFilter']));
	$cats = $_POST['cats'];
	$pageNum=$_POST['pageNum'];
	$numPerPage=$_POST['numPerPage'];
	$queryHeader1 = 'SELECT * FROM toys WHERE ';
	$queryHeader2 = 'SELECT COUNT(toy_id) FROM toys WHERE ';
	$queryBody = '';
	for ($i=0;$i<count($cats);$i++){
		if ($i==0){
			$queryBody .= "(toy_category ='" . $cats[$i] ."'";
		}
		else{
			$queryBody .=" OR toy_category='" . $cats[$i] ."'";
		}
		if ($i==count($cats)-1){
			$queryBody .=')';
		}
	}
	if ($ageFilter!=''){
		$queryBody.= " AND (toy_age_range='".$ageFilter."')";
	}
	if ($searchFilter!=''){
		$queryBody.=" AND (toy_name like '%" . $searchFilter. "%')";
	}
	$queryBody.=" ORDER BY toy_name";
	//Count num pages in matching set
	if($pageNum==-1){
		$queryHeader2 .= $queryBody;
		$totalRecords = mysql_query($queryHeader2,$db) or die(mysql_error());
		while($row=mysql_fetch_assoc($totalRecords)){
			$roughNumPages= $row['COUNT(toy_id)'] /$numPerPage;
			if($roughNumPages == floor($roughNumPages)){
				$pageNum=$roughNumPages;
			}
			else{
				$pageNum= floor($roughNumPages)+1;
			}
		}
	}
	$queryBody .= ' LIMIT '. strval(($pageNum-1)*$numPerPage) .', '. strval($numPerPage).';';
	// echo $queryHeader1.$queryBody;
	$result = mysql_query($queryHeader1.$queryBody, $db) or die(mysql_error());
	$arr=array();
	while($row=mysql_fetch_assoc($result)){
		$arr[]= $row;
	}
	echo json_encode($arr);
?>