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

if(Meteor.isClient){

    Template.update.rendered = function(){

    	//set current users stuff
    	var user = Session.get('currentUser');
    	Session.set('currentMajor',user.major);
		if (user){
			$('#firstNameUpdate').val(user.firstName)
			$('#lastNameUpdate').val(user.lastName)
			$('#majorDropdownUpdate').dropdown('set selected',user.major)
			$('#catalogYearDropdownUpdate').dropdown('set selected',user.catalog)
			$('#startSemDropdownUpdate').dropdown('set selected',user.startSem)
			$('#startYearFieldUpdate').val(user.startYear)
			$('#endSemDropdownUpdate').dropdown('set selected',user.endSem)
			$('#endYearFieldUpdate').val(user.endYear)
			$('#nidFieldUpdate').val(user.nid)
		}
		$('.ui.error.message').hide();
		$('.ui.form').form({
			    firstName: {
				  identifier  : 'firstNameUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your first name'
					}
				  ]
				},
			    lastName: {
				  identifier  : 'lastNameUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your last name'
					}
				  ]
				},
				major: {
				  identifier  : 'majorFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select a major'
					}
				  ]
				},
				year: {
				  identifier  : 'catalogYearFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select a catalog year'
					}
				  ]
				},
				startSem: {
				  identifier  : 'startSemesterFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select your first semester'
					}
				  ]
				},
				startYear: {
				  identifier  : 'startYearFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your first year'
					}
				  ]
				},
				endSem: {
				  identifier  : 'endSemesterFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select your last semester'
					}
				  ]
				},
				endYear: {
				  identifier  : 'endYearFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your last year'
					}
				  ]
				},
				nid: {
				  identifier  : 'nidFieldUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your NID'
					}
				  ]
				},
				password: {
				  identifier  : 'passwordUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your password'
					}
				  ]
				},
				email: {
				  identifier  : 'emailUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your email address'
					}
				  ]
				},
				verify: {
				  identifier  : 'verifyPasswordUpdate',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please veriy your password'
					}
				  ]
				}
		},{inline: true});
    }

    Template.update.helpers({
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

    Template.update.events({
    	'change #majorFieldUpdate' : function(event){
    		Session.set('currentMajor', $('#majorDropdownUpdate').dropdown('get text'));
    	},
        'click #createButton' : function(){
			var user = 	{
				firstName: $('#firstNameUpdate').val(),
				lastName: $('#lastNameUpdate').val(),
				isAdvisor: false,
				major: $('#majorDropdownUpdate').dropdown('get text'),
				catalog: $('#catalogYearFieldUpdate').val(),
				startSem: $('#startSemDropdownUpdate').dropdown('get text'),
				startYear: $('#startYearFieldUpdate').val(),
				endSem: $('#endSemDropdownUpdate').dropdown('get text'),
				endYear: $('#endYearFieldUpdate').val(),
				advisor: null,
				nid: $('#nidFieldUpdate').val()
			}
            var email = $('#emailUpdate').val()
			var pass = $('#passwordUpdate').val()
			var passVerify = $('#verifyPasswordUpdate').val()

			if (email != "") {
				if( pass != "") {
					if ( passVerify != ""){
						if (pass != passVerify)
							$('.ui.error.message').text("Incorrect password verification.").show();
						else {
							Accounts.createUser({email: email, password: pass},function(error){
								if(error) $('.ui.error.message').text(error).show();
								else {
								    Session.set('isSignUp',false);
                                    user._id = Meteor.userId();
                                    user.numOfCourses = -1;
                                    Session.set('currentUser',user);
                                    Meteor.call('createUserData',user._id,user.firstName,user.lastName,user.major,user.catalog,
                                        user.startSem,user.startYear,user.endSem,user.endYear,user.advisor,user.nid,user.numOfCourses,
                                        function(error,result){
                                            if(error) console.log(error);
                                        }
                                    );
								}
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
        },
        'click #saveButton' : function(){
			var user = 	{
				firstName: $('#firstNameUpdate').val(),
				lastName: $('#lastNameUpdate').val(),
				isAdvisor: false,
				major: $('#majorDropdownUpdate').dropdown('get text'),
				catalog: $('#catalogYearFieldUpdate').val(),
				startSem: $('#startSemDropdownUpdate').dropdown('get text'),
				startYear: $('#startYearFieldUpdate').val(),
				endSem: $('#endSemDropdownUpdate').dropdown('get text'),
				endYear: $('#endYearFieldUpdate').val(),
				advisor: null,
				nid: $('#nidFieldUpdate').val()
			}
            user._id = Session.get('currentUser')._id;
            user.numOfCourses = Session.get('currentUser').numOfCourses;
            user.isAdvisor = Session.get('currentUser').isAdvisor;
            user.importedSched = Session.get('currentUser').importedSched;
            Session.set('currentUser',user);
            Meteor.call('updateUserData',user._id,user.firstName,user.lastName,user.major,user.catalog,
                user.startSem,user.startYear,user.endSem,user.endYear,user.advisor,user.nid,user.numOfCourses,
                function(error,result){
                    if(error) console.log(error);
                }
            );
        }
    });
}