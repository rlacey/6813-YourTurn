/**
 *
 *  @author Ryan Lacey
 */

$(document).ready(function() {
 	hovering();
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
			$("#modal-register").modal ("hide");
			hovering();
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
			$("#modal-login").modal ("hide");
			hovering();			
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

	$.post(
		"logout.php",
		{"user_name" : name},
		function(data) {
			// nothing
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