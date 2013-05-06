/**
 *
 *  @author Ryan Lacey
 */

var numToys = 0;
var trackedToys = 0;
var currentTabNumber = 1;
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

	if (numToys>0) {
		e.preventDefault();
	}
	
	numToys++;
	trackedToys++;
	toyIDs.push(numToys.toString());

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
 *  Called when a tab is clicked. 
 *  Selected tab becomes active and its content is displyed.
 *  Tabs only shown if more than one toy in listing. 
 */
function switchTab(tab) {
	if ($('#toyName'+currentTabNumber).val()!=='') {
		var toyName = $('#toyName'+currentTabNumber).val();
		if (toyName.length >10) {
			toyName = toyName.substring(0,10) + "...";
		}
		$('#tab-toy'+currentTabNumber).html('<button type="button" class="close" onClick="closeTab(event, this.parentNode.id)">&times;</button>'
			+ ' <a href="#toy" data-toggle="tab"><strong>'+ toyName + '</strong></a>');
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

/*
 *  Remove tab and all associated content from listing.
 */
function closeTab(e, tab) {
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

/*
 *  If only one tab is open, then hide tab labels.
 */
function checkTabDisplay() {
	// Don't display tabs until >1 toys are listed
	if (trackedToys<=1) {
		$('.tab-label').hide();
	} else {
		$('.tab-label').show();
	}
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
	input.val("");

	closeModal(modalID);
}

/* 
 *  Close model with specified ID
 */
function closeModal(modalID) {
	$("#"+modalID).modal ('hide'); 
};

function submitToyForms() {
	$('#error-toy-name').hide();
	$('#error-toy-description').hide();
	$('#error-toy-photo').hide();

	var validated = true;

	// Validate form entries
	for (var i=0; i<toyIDs.length; i++) {
		var toyName = $('#toyName'+toyIDs[i]).val();
		if (toyName==='') {
			validated = false;
			$('#error-toy-name').show();
		}
		var description = $('#description'+toyIDs[i]).val();
		if (description==='') {
			validated = false;
			$('#error-toy-description').show();
		}
		var photo = $('#toy-image'+toyIDs[i]).attr('src');
		console.log(photo);
		if (photo==="images\\toys-background.jpg") {
			validated = false;
			$('#error-toy-photo').show();
		}
	}

	if (validated) {
		// Get username
		var owner = $('#owner').attr('name');
		if (owner==''){
			alert("Please login or register before donating.");
			return;
		}
		// Retrieve form data
		for (var i=0; i<toyIDs.length; i++) {
			var toyName = $('#toyName'+toyIDs[i]).val();
			var ageRange = $('#ageRange'+toyIDs[i]).val();
			var condition = $('#condition'+toyIDs[i]).val();
			var category = $('#category'+toyIDs[i]).val();
			var description = $('#description'+toyIDs[i]).val();
			var photo = $('#toy-image'+toyIDs[i]).attr('src');
			// Send entries to DB
			$.post(
				"addToy.php",
				{"owner" : owner, "toy_name" : toyName, "toy_age_range" : ageRange, "toy_condition" : condition,
				 "toy_category" : category, "toy_description" : description, "toy_photo" : photo},
				function(data) {
					// console.log(data);
				}
			);
		}
		$("#modal-submit-confirmation").modal ("show");
	} 
}
