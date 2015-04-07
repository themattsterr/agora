// agora login template

if (Meteor.isClient) {

    Template.login.onRendered(function(){
		$('.ui.error.message').hide();
    });

    Template.login.helpers({
    	isSignUp : function(){
    		return Session.get('isSignUp');
    	},
       majorList: function () {
       	return ['Computer Science','Computer Engineering'];
       },
       catalogYearList: function () {
       	return [2015,2016];
       }
    });

    Template.login.events({
	    'click #signUpButton': function (event) {
	       Session.set('isSignUp',true);
	       $('.ui.error.message').hide();
	    },
	    'click #signInButton' : function(event){
	    	if (Session.get('isSignUp')) {
	    		Session.set('isSignUp',false);
	    		$('.ui.error.message').hide();
	    	} else {
				var email = $('#loginEmailField').val()
				var pass = $('#loginPasswordField').val()
				if (email != "") {
					if( pass != "") {
						Meteor.loginWithPassword(email,pass,function(error){
							if(error)
								$('.ui.error.message').text(error).show();
							else{
								Session.set('currentUser',AGORAUsers.findOne({_id:Meteor.userId()}));
								Session.set('mainUser',AGORAUsers.findOne({_id:Meteor.userId()}));
							}
						});
					} else {
						$('.ui.error.message').text("No password entered.").show();
					} 
				} else {
						$('.ui.error.message').text("No email entered.").show();
				}
	    	}
		},
		'click #createAccountButton' : function(event){
			var email = $('#loginEmailField').val()
			var pass = $('#loginPasswordField').val()
			var passVerify = $('#loginVerifyPasswordField').val()

			if (email != "") {
				if( pass != "") {
					if ( passVerify != ""){
						if (pass != passVerify)
							$('.ui.error.message').text("Incorrect password verification.").show();
						else {
							Accounts.createUser({email: email, password: pass},function(error){
								if(error)
									$('.ui.error.message').text(error).show();
							});
						}
					} else {
						$('.ui.error.message').text("Please verify password.").show();
					}
				} else {
					$('.ui.error.message').text("No password entered.").show();
				} 
			} else {
					$('.ui.error.message').text("No email entered.").show();
			}

		}
    });
}