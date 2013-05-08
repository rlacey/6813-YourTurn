/**
 *
 *  @author Ryan Lacey
 */

$(document).ready(function() {
	loginText = $('#user').text().trim();
	if (loginText === "Login / Signup") {
		$('.login-content').hide();
		$('.logout-content').show();
	} else {
		$('.login-content').show();
		$('.logout-content').hide();
	}
 	hovering();
	checkLastMessage();
});

function displayRegistration() {
	$("#modal-register").modal ("show");
}

function submitRegistration() {
	$('.alert').hide();

	var name = $("#register-name").val();
	var email = $("#register-email").val();
	var password = $("#register-password").val();

	$.post(
		"register.php",
		{"register_name" : name, "register_email" : email, "register_pass" : password},
		function(data) {
			messages = data.split(',');
			validEmail = messages[0];
			usernameAvailable = messages[1];
			if(validEmail==='invalid') {
				$('#register-error-email').show();
				return;
			}
			if(usernameAvailable==='taken') {
				$('#register-error-username').show();
				return;
			}
	        $('#user').html('<a id="label-logout" href="" name="<?php echo $username; ?>" class="hover" onClick="logout()"><i class="icon-user"></i> '+name+'</a>');
	        $('#owner').attr('name', name);
			$("#modal-register").modal ("hide");
			hovering();
			$('.login-content').show();
			$('.logout-content').hide();
		}
	);
}

function submitLogin() {
	$('.alert').hide();

	var name = $("#login-name").val();
	var password = $("#login-password").val();

	$.post(
		"login.php",
		{"user_name" : name, "user_pass" : password},
		function(data) {
			if(data==='invalid') {
				$('#login-error').show();
				return;
			}
	        $('#user').html('<a id="label-logout" href="" name="<?php echo $username; ?>" class="hover" onClick="logout()"><i class="icon-user"></i> '+name+'</a>');
	        $('#owner').attr('name', name);
			$("#modal-login").modal ("hide");
			hovering();		
			$('.login-content').show();
			$('.logout-content').hide();	
		}
	);
}

function switchModal() {
	$('.alert').hide();
	$('input').val('');
}

function logout() {
	console.log("logginh out");
	var name = $('#label-logout').attr('name');
	$('#owner').attr('name', '');

	$.post(
		"logout.php",
		{"user_name" : name},
		function(data) {
			$('login-content').hide();
			$('.logout-content').show();
		}
	);
}

function hovering() {	
	var name = $('#label-logout').attr('name');

	$('#user').on({
    mouseenter: function() {
        $('#label-logout').html('Logout');
    },
    mouseleave: function() {
    	var name = $('#label-logout').attr('name');
        $('#label-logout').html('<i class="icon-user"></i> '+name);
    }
	}, ".hover");
}

function checkLastMessage(){
	//grab user last_message
	// grab actual last message and compare
	//if actual > user, append (new) to message tab
	var owner = $('#owner').attr('name');
	$.post("checkMessages.php", {"owner": owner}, function(data){
		console.log(data);
		parsed = JSON.parse(data);
		var lastChecked = parsed[0]["last_message"];
		console.log(lastChecked);
		messages = parsed[1];
		var found = false;
		var i = 0;
		while (!found){
			if (messages[i]["message"]!=""){
				found = true;
			}
			else{
				i++;
			}
		}
		var actualLast = messages.length-i;
		console.log(actualLast);
		if (actualLast > lastChecked){
			console.log("new message!");
			$('a:contains(Messages)').append(' (new)');
		}
		else{
			//$('a:contains(Messages)').text('<i class="icon-envelope"></i> Messages');
		}
	})
}