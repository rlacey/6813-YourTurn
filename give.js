function switchTab(tab) {
	var tabID = tab.split("-")[0];
	alert(tabID);
	$('.tabb').attr('class', 'tabb');
	$('#'+tab).attr('class', 'tabb active');
	
	$('.tab-pane').attr('class', 'tab-pane');
	$('#'+tabID).attr('class', 'tab-pane active');
}