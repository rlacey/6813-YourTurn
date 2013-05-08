var currentTab = 0;
var defaultTab;
var defaultContent;
var userList = new Array(); // The list of usernames that correspond to the conversations
var conversations = new Array(); // An array of arrays. Each array corresponds to one thread with each element of the array being a particular message.
var mostRecentCheck = 0;
var oldMessageLength = 0;
var messageLength = 0;
var newMessages = new Array();

$(document).ready(function() {
	// Defaults are a blank slate for toy forms
	defaultTab = $('#tab-toy').clone();
	defaultContent = $('#content-toy').clone();

	// Remove the default models from the webpage
	$('#tab-toy').remove();
	$('#tab-toy').remove();
	$('#content-toy').remove();
	
	
	//Populate from database
	loadConversations(0);
	
	// Update timestamp


});

function updateMostRecent(){
	var owner = $('#owner').attr('name');
	console.log("ml:" + messageLength);
	$.post(
		"mostRecent.php",
		{"owner":owner,"id":messageLength},
		function(data){
		console.log("ASLDFJASLDFJASLDFJ");
		console.log("ml:" + messageLength);
		console.log(data);
		}
	);
	
}

function loadConversations(numtab){
	var owner = $('#owner').attr('name');
	
	//Check to see that the user is logged in
	if (owner==''){
			alert("Please login or register before donating.");
			return;
	}
	
	$.post("checkMessages.php", {"owner": owner}, function(data){
		parsed = JSON.parse(data);
		oldMessageLength = parsed[0]["last_message"];
	})
	
	//Grab all messages involved with the user
	$.post(
		"getMessage.php",
		{"owner":owner},
		function(data){
			var parsed=JSON.parse(data);
			messageLength = parsed.length;
			
			conversations = new Array();
			userList = new Array();
			// Compute unique conversations
			for(var i=0; i<parsed.length; i++){
				var current_from = parsed[i]['user_from'];
				var current_to = parsed[i]['user_to'];
				
				// Add new user to list if not already added.
				if(current_from != owner){
					console.log("user_from:" + current_from);
					
					// New user
					if(userList.indexOf(current_from) == -1){
						userList.push(current_from);
						var currentConversation = new Array();
						currentConversation.push("other*" + parsed[i]['message']);
						conversations.push(currentConversation);
					}
					// Old user
					else{
						var user_index = userList.indexOf(current_from);
						var currentConversation = conversations[user_index];
						currentConversation.push("other*" + parsed[i]['message']);
						conversations[user_index] = currentConversation;
						
					}
					
					var currentindex = userList.indexOf(current_from);
					if (i<messageLength-oldMessageLength && newMessages.indexOf(currentindex)==-1){
						newMessages.push(currentindex);
					}
				}
				else if(current_to != owner){
					console.log("user_to:" + current_to);
					// New user
					if(userList.indexOf(current_to) == -1){
						userList.push(current_to);
						var currentConversation = new Array();
						currentConversation.push("me*" + parsed[i]['message']);
						conversations.push(currentConversation);
					}
					// Old user
					else{
						var user_index = userList.indexOf(current_to);
						var currentConversation = conversations[user_index];
						currentConversation.push("me*" + parsed[i]['message']);
						conversations[user_index] = currentConversation;
						
					}
					
					var currentindex = userList.indexOf(current_to);
					if (i<messageLength-oldMessageLength && newMessages.indexOf(currentindex)==-1){
						newMessages.push(currentindex);
					}
				}
				else{
					console.log("ERROR: SHOULD NEVER BE HERE!");
				}
				
			}
			displayConversations();
			if(numtab != -1){
				switchTabs('tab-toy'+numtab);
			}
			else{
				var recent = userList.length-1
				switchTabs('tab-toy'+recent);
			}
			console.log('bye');
			updateMostRecent();
		}
	);
	console.log('hi');
	
	
}

/*
Send message
*/
function sendMessage(){
	var owner = $('#owner').attr('name');
	var other = userList[currentTab];
	var message = $('#content-toy'+currentTab+' #reply').val();
	
	// Send to database
	$.post(
		"addMessage.php",
		{"user_from":owner, "user_to":other, "message": message },
		function(data){
			console.log('hi'+data);
		}
	);
	
	// Update data structure 
	conversations[currentTab].push('me*' + message);
	loadConversations(0);
	// Display
}

/*
New conversation created when "Message Owner" is clicked on the find page.
*/
function addConversation(toy_id){
	// Update data structure
	//userList.push(username);
	//conversations.push(new Array());
	console.log(toy_id);
	var owner = "";
	$.post("getOwner.php", {"id" : toy_id}, function(data){
		var parsed=JSON.parse(data);
		owner = parsed['owner'];
		console.log(owner);
	var user = $('#owner').attr('name');
	console.log(user);
	$.post(
		"addMessage.php",
		{"user_from":user, "user_to":owner, "message": "" },
		function(data){
			console.log('hi'+data);
			window.location.href = "messages.php";
		}
	);
	})
	
	// TODO: How will they be on the messages page from the find page? - switch tab, display conversations?
	
	
}

function displayConversations(){
	// TODO: Display a no messages page
	if(userList.length == 0){
		
	}
	
	// Iterate through tabs/content
	$('#tab-labels').text('');
	for(var i=0; i < userList.length; i++){
		// Create conversation tab
		var tab = defaultTab.clone();
		var tabID = defaultTab.attr('id') + i;
		tab.attr('id', tabID);
		tab.html('<a href="#toy" data-toggle="tab">' + userList[i] + '</a>');
		
		// Populate conversation pane
		var content = defaultContent.clone();
		var contentID = defaultContent.attr('id') + i;
		content.attr('id', contentID);
		
		// Add tab to tabs list
		
		$('#tab-labels').append(tab);
		$('#tab-content').append(content);
		if (newMessages.indexOf(i)!=-1){
			tab.css("font-weight", "bold");
		}
		
		$('#'+contentID+' #messages-pane').text('');
		//Update content pane
		for(var j=conversations[i].length-1; j >=0 ; j--){
			var message_array = conversations[i][j].split('*');
			var user = message_array.shift();
			var message = message_array.join();
			if(user == 'other'){
				user = userList[i];
			}
			if(message!=""){
				$('#'+contentID+' #messages-pane').append('<div class = "message"><h4>'+user+'</h4>'+message+'<hr>');
			}
		}
		$('#'+contentID+' #messages-pane').append('<div id="reply-pane"><textarea id="reply" class="text-form" placeholder = "Enter Message Here." style="width:100%; height:80px;"></textarea>				<div id = "reply-button" style = "float:right;">'+
											'<button id="submit-reply" class="btn" onClick="sendMessage()">Reply</button>'+
											'</div>'+
										'</div>');
		$('#'+contentID+' #messages-pane').scrollTop(window.innerHeight);
	}
}

function switchTabs(user){
	// TODO: Modal something goes here
	if($('#reply'+currentTab).val() != ''){
		
	}
	
	tabNumber = user.substring(7);
	$('.tab-label').attr('class', 'tab-label');
	$('#tab-toy'+tabNumber).attr('class', 'tab-label active');
	$('#tab-toy'+tabNumber).css('font-weight', 'normal');
	// Remove active state from all tab pages and assign clicked tab to be new active tab
	$('.tab-pane').attr('class', 'tab-pane');
	$('#content-toy'+tabNumber).attr('class', 'tab-pane  active');
	currentTab = tabNumber;
}