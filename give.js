/**
* @author Ryan Lacey
*
*/

$(document).ready(function(){
	$("button#photo-url").click(function(){
		alert("Charles is a bitch");
	});
});

function switchTab(tab) {
	var tabID = tab.split("-")[0];
	// Remove active state from all tab labels and assign clicked label to be new active tab
	$('.tab-label').attr('class', 'tab-label');
	$('#'+tab).attr('class', 'tab-label active');
	// Remove active state from all tab pabes and assign clicked tab to be new active tab
	$('.tab-pane').attr('class', 'tab-pane');
	$('#'+tabID).attr('class', 'tab-pane active');
}