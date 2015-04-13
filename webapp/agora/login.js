// agora login template

var changeView = function( newView ){
  	var curView = Session.get('currentView'),
  		viewHistory = Session.get('viewHistory');

  	if (!viewHistory) {
  		viewHistory = new Array();
  		viewHistory.push(curView);
  	} else {
        var lastView = viewHistory.pop();
        if(lastView){
            viewHistory.push(lastView);
            if(lastView != curView){
                viewHistory.push(curView);
            }
        } else viewHistory.push(curView);
  	}

	Session.set('currentView',newView);
	Session.set('viewHistory',viewHistory);
}

if (Meteor.isClient) {

    Template.login.onRendered(function(){
		$('.ui.error.message').hide();
    });

    Template.login.helpers({

    });

    Template.login.events({
	    'click #signUpButton': function (event) {
	       changeView('update');
	       Session.set('isSignUp',true);
	    },
	    'click #logInButton' : function(event){
			var email = $('#loginEmailField').val()
			var pass = $('#loginPasswordField').val()
			if (email != "") {
				if( pass != "") {
					Meteor.loginWithPassword(email,pass,function(error){
						if(error)
							$('.ui.error.message').text(error).show();
						else{
							Session.set('currentUser', AGORAUsers.findOne({_id:Meteor.userId()}));
							//Session.set('mainUser',AGORAUsers.findOne({_id:Meteor.userId()}));
							Session.set('viewHistory', null);
							Session.set('currentView','profile');
						}
					});
				} else {
					$('.ui.error.message').text("No password entered.").show();
				} 
			} else {
					$('.ui.error.message').text("No email entered.").show();
			}
		}
    });
}