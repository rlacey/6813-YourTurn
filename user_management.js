/**
 *
 *  @author Ryan Lacey
 */

 $(document).ready(function() {

	$('#user').on({
	    mouseenter: function() {
	        $('#label-logout').html('Logout');
	    },
	    mouseleave: function() {
	    	var name = $('#label-logout').attr('name');
	        $('#label-logout').html('<i class="icon-user"></i> '+name);
	    }
	}, ".hover");

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
	        $('#label-logout').html('<i class="icon-user"></i> '+name);
			$("#modal-register").modal ("hide");
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
	        $('#label-logout').html('<i class="icon-user"></i> '+name);
			$("#modal-login").modal ("hide");
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