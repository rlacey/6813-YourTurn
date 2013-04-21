function displayRegistration() {
	$("#modal-register").modal ("show");
}

function submitRegistration() {
	$('#register-error-email').hide();
	$('#register-error-username').hide();

	var name = $("#register-name").val();
	var email = $("#register-email").val();
	var password = $("#register-password").val();
	console.log(name+" "+email+" "+password);
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
			$('#user').html('<a><i class="icon-user"></i> '+name+'</a>');
			$("#modal-register").modal ("hide");
		}
	);
}