/**
 *
 *  @author Ryan Lacey
 */

var numToys = 0;
var trackedToys = 0;
var currentTabNumber = 0;
var toyIDs = new Array();
var defaultTab;
var defaultContent;

$(document).ready(function() {

	// Defaults are a blank slate for toy forms
	defaultTab = $('#tab-toy').clone();
	defaultContent = $('#content-toy').clone();

	// Remove the default models from the webpage
	$('#tab-toy').remove();
	$('#content-toy').remove();

	// Add initial toy form to page (toy1)
	addAnotherToy();

});

/* 
 *  Called when "Add another toy" is clicked.
 *  Adds new tab with blank form.
 *  Assigns a toy number to relevant fields so data can be tracked with respect to a specific toy.
 */
function addAnotherToy(e) {	
	e.preventDefault();
	
	numToys++;
	trackedToys++;
	toyIDs.push(numToys.toString());

	console.log("add toy      toy#"+numToys+"    tracked="+trackedToys);

	// Tab is the label that a user clicks
	var tab = defaultTab.clone();
	var tabID = defaultTab.attr('id') + numToys;
	tab.attr('id', tabID);
	tab.html('<button type="button" class="close" onClick="closeTab(event, this.parentNode.id)">&times;</button>'
		+ ' <a href="#toy" data-toggle="tab"><strong>Toy '+ numToys + '</strong></a>');

	// Content is what the tab displays
	var content = defaultContent.clone();
	var contentID = defaultContent.attr('id') + numToys;
	content.attr('id', contentID);

	// Add tab to tabs list
	$('#tab-labels').append(tab);
	$('#tab-content').append(content);	

	// Update form IDs
	var toyName = $('#'+contentID).find('#toyName');
	toyName.attr('id', 'toyName'+numToys);
	var ageRange = $('#'+contentID).find('#ageRange');
	ageRange.attr('id', 'ageRange'+numToys);	
	var condition = $('#'+contentID).find('#condition');
	condition.attr('id', 'condition'+numToys);
	var category = $('#'+contentID).find('#category');
	category.attr('id', 'category'+numToys);	
	var description = $('#'+contentID).find('#description');
	description.attr('id', 'description'+numToys);	
	var photo = $('#'+contentID).find('#toy-image');
	photo.attr('id', 'toy-image'+numToys);	
	var photoLinkButton = $('#'+contentID).find('#button-photo-url');
	photoLinkButton.attr('id', 'button-photo-url'+numToys);		

	switchTab(tabID);
}

/*
 *  Display prompt to enter photo URL
 */
function linkToPhotoPrompt() {
	$("#modal-photo-url").modal ("show");
}

/*
 * Parse url and close prompt
 */
function linkToPhotoSubmit(modalID) {
	var input = $('#photo-url-input');
	var photo = $("#toy-image"+currentTabNumber);
	// Update picture from user input]
	photo.attr('src', input.val());
	// Clear input field
	// input.val("");

	closeModal(modalID);
}

/* 
 *  Close model with specified ID
 */
function closeModal(modalID) {
	$("#"+modalID).modal ('hide'); 
};

/*
 *  Upload photo from file on user's computer.
 */
function uploadPhotoPrompt() {
	alert('This function is not yet implemented. Sorry!');
}

function submitToyForms() {
	var owner = $('#owner').attr('name');
	console.log("My owner: "+owner);
	for (var i=0; i<toyIDs.length; i++) {
		var toyName = $('#toyName'+toyIDs[i]).val();
		var ageRange = $('#ageRange'+toyIDs[i]).val();
		var condition = $('#condition'+toyIDs[i]).val();
		var category = $('#category'+toyIDs[i]).val();
		var description = $('#description'+toyIDs[i]).val();
		var photo = $('#photo-url-input').val();
		$.post(
			"addToy.php",
			{"owner" : owner, "toy_name" : toyName, "toy_age_range" : ageRange, "toy_condition" : condition,
			 "toy_category" : category, "toy_description" : description, "toy_photo" : photo},
			function(data) {
				// if(data==='invalid') {
				// 	$('#login-error').show();
				// 	return;
				console.log(data);
			}
		);
	}
	$("#modal-submit-confirmation").modal ("show");
}

/*
 *  Called when a tab is clicked. 
 *  Selected tab becomes active and its content is displyed.
 *  Tabs only shown if more than one toy in listing. 
 */
function switchTab(tab) {
	console.log("switch tab: "+tab)
	if ($('#toyName'+currentTabNumber).val()!=='') {
		$('#tab-toy'+currentTabNumber).html('<button type="button" class="close" onClick="closeTab(event, this.parentNode.id)">&times;</button>'
			+ ' <a href="#toy" data-toggle="tab"><strong>'+ $('#toyName'+currentTabNumber).val() + '</strong></a>');
	}

	var tabID = tab.split("-")[1];
	currentTabNumber = tabID.substring(3);
		// Update tab label to toy name
	// Remove active state from all tab labels and assign clicked label to be new active tab
	$('.tab-label').attr('class', 'tab-label');
	$('#tab-'+tabID).attr('class', 'tab-label active');
	// Remove active state from all tab pages and assign clicked tab to be new active tab
	$('.tab-pane').attr('class', 'tab-pane');
	$('#content-'+tabID).attr('class', 'tab-pane  active');

	checkTabDisplay();
}

function closeTab(e, tab) {
	console.log("close tab: "+tab);
	e.stopPropagation();
	
	// Identify which tab to remove
	var tab_tail = tab.split("-")[1];
	var tabID = tab_tail.substring(3);

	// Find nearest tab to switch to if current tab is closed
	var sibling;
	if (tabID == toyIDs[0]) {
		sibling = $('#'+tab).next();
	} else {
		sibling = $('#'+tab).prev();
	}	

	// Switch tabs to sibling if current is removed
	if (tabID === currentTabNumber) {
		switchTab(sibling.attr('id'));
	}	

	// Remove selected tab and associated content
	$('#'+tab).remove();
	$('#content-'+tab_tail).remove();
	var index = toyIDs.indexOf(tabID);			
	toyIDs.splice(index, 1);
	trackedToys--;

	checkTabDisplay();
}

function checkTabDisplay() {
	console.log("check tab count...");
	// Don't display tabs until >1 toys are listed
	if (trackedToys<=1) {
		$('.tab-label').hide();
	} else {
		$('.tab-label').show();
	}
}

