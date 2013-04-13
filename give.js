/**
 *
 *  @author Ryan Lacey
 */

var numToys = 0;
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
function addAnotherToy() {
	numToys++;

	// Tab is the label that a user clicks
	var tab = defaultTab.clone();
	var tabID = defaultTab.attr('id') + numToys;
	tab.attr('id', tabID);
	tab.html('<a href="#toy" data-toggle="tab">Toy '+ numToys + '</a>');

	// Content is what the tab displays
	var content = defaultContent.clone();
	var contentID = defaultContent.attr('id') + numToys;
	content.attr('id', contentID);

	// Add tab to tabs list
	$('#tab-labels').append(tab);
	$('#tab-content').append(content);	

	// Update title to default name (toy number) and titleID
	var legend = $('#'+contentID).find('#title-toy');
	legend.attr('id', 'title-toy'+numToys);
	legend.html("Toy "+numToys);

	// Update form IDs
	var toyName = $('#'+contentID).find('#toyName');
	toyName.attr('id', 'toyName'+numToys);
	var ageRange = $('#'+contentID).find('#ageRange');
	ageRange.attr('id', 'ageRange'+numToys);	
	var condition = $('#'+contentID).find('#condition');
	condition.attr('id', 'condition'+numToys);
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
	alert(photoButtonID);
	var photo = $("#"+photoID);
	var input = photo.val();
	// Update picture from user input]
	photo.attr('src', input);
	// Clear input field
	photo.val("");

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
	alert('This function is not implemented yet. Sorry!');
}

/*
 *  Called when a tab is clicked. 
 *  Selected tab becomes active and its content is displyed.
 *  Tabs only shown if more than one toy in listing. 
 */
function switchTab(tab) {
	var tabID = tab.split("-")[1];
	// Remove active state from all tab labels and assign clicked label to be new active tab
	$('.tab-label').attr('class', 'tab-label');
	$('#tab-'+tabID).attr('class', 'tab-label active');
	// Remove active state from all tab pages and assign clicked tab to be new active tab
	$('.tab-pane').attr('class', 'tab-pane');
	$('#content-'+tabID).attr('class', 'tab-pane active');
	// Don't display tabs until >1 toys are listed
	if (numToys<=1) {
		$('.tab-label').hide();
	} else {
		$('.tab-label').show();
	}
}

