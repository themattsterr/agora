// agora set up template

if (Meteor.isClient) {

	var fillYearArray = function(start,end){
		var arr = [];
		for(var i = 0; i <= end-start; i++){
			arr[i] = 2000 + start + i;
		}
		Session.set('yearArray',arr);
	}

    Template.setup.rendered = function(){

    	//set current users stuff
    	var user = Session.get('currentUser');
		if (user){
			$('#firstName').val(user.firstName)
			$('#lastName').val(user.lastName)
			$('#majorDropdown').dropdown('set selected',user.major)
			$('#catalogYearDropdown').dropdown('set selected',user.catalog)
			$('#startSemDropdown').dropdown('set selected',user.startSem)
			$('#startYearField').val(user.startYear)
			$('#endSemDropdown').dropdown('set selected',user.endSem)
			$('#endYearField').val(user.endYear)
			$('#advisorDropdown').dropdown('set selected',user.advisor)
			$('#nidField').val(user.nid)
		}
		$('.ui.error.message').hide();
		$('.ui.form').form({
			    firstName: {
				  identifier  : 'firstName',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your first name'
					}
				  ]
				},
			    lastName: {
				  identifier  : 'lastName',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your last name'
					}
				  ]
				},
				major: {
				  identifier  : 'majorField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select a major'
					}
				  ]
				},
				year: {
				  identifier  : 'catalogYearField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select a catalog year'
					}
				  ]
				},
				startSem: {
				  identifier  : 'startSemesterField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select your first semester'
					}
				  ]
				},
				startYear: {
				  identifier  : 'startYearField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your first year'
					}
				  ]
				},
				endSem: {
				  identifier  : 'endSemesterField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select your last semester'
					}
				  ]
				},
				endYear: {
				  identifier  : 'endYearField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your last year'
					}
				  ]
				},
				nid: {
				  identifier  : 'nidField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please enter your NID'
					}
				  ]
				},
				advisor: {
				  identifier  : 'advisorField',
				  rules: [
					{
					  type   : 'empty',
					  prompt : 'Please select an Advisor'
					}
				  ]
				}
		},{inline: true});
    }

    Template.setup.helpers({
     isSetupFinished: function() {
     	return Session.get('isSetupFinished');
     },
       majorList: function () {
       	return ['Computer Science','Computer Engineering'];
       },
       catalogYearList: function () {
       	return [2015,2016];
       },
       yearsWithTitles: function () {
      	return Session.get('yearArray');
    	},
    	foundCoursesHTML: function(year) {
    		var foundSched = Session.get('foundSchedule');
    		var curUser = Session.get('currentUser');
    		var yrIndex;
    		if (curUser && curUser.semStart == 'fall')
    			year++;

			var yrIndex = year - 2000 - foundSched.yearStart;
    		var prevYearSchedule;

    		if (yrIndex > 0) 
    			prevYearSchedule = foundSched.schedule[yrIndex-1];
    		else {
    			prevYearSchedule = [
				  ["","","","",""],
				  ["","","","",""],
				  ["","","","",""] ];
    		}

    		

    		var currYearSchedule = foundSched.schedule[yrIndex];
    		var HTMLString = '<table class="ui three column celled table"><thead><tr>';
    		HTMLString += '<th>Fall '+ Number(year-1) +'</th>';
    		HTMLString += '<th>Spring '+year+'</th>';
    		HTMLString += '<th>Summer '+year+'</th></tr></thead><tbody>';
			for (var i = 0; i < 4; i++) {
				HTMLString += '<tr><td>'+prevYearSchedule[0][i]+'</td>';
				HTMLString += '<td>'+currYearSchedule[1][i]+'</td>';
				HTMLString += '<td>'+currYearSchedule[2][i]+'</td></tr>';
    		}
    		HTMLString += '</tbody></table>';
    		return HTMLString;
    	},
    	advisorList : function(){
    		var advisors = AGORAUsers.find({isAdvisor: true},{firstName: true, lastName: true}).fetch();
    		var nameList = [];
    		for (var a in advisors){
    			nameList.push(advisors[a].lastName + ', ' + advisors[a].firstName);
    		}
    		return nameList;
    	}
    });

    Template.setup.events({
		'submit #accountForm': function(event) {
			
			var user = 	{
				firstName: $('#firstName').val(),
				lastName: $('#lastName').val(),
				isAdvisor: false,
				major: $('#majorDropdown').dropdown('get text'),
				catalog: $('#catalogYearField').val(),
				startSem: $('#startSemDropdown').dropdown('get text'),
				startYear: $('#startYearField').val(),
				endSem: $('#endSemDropdown').dropdown('get text'),
				endYear: $('#endYearField').val(),
				advisor: $('#advisorDropdown').dropdown('get text'),
				nid: $('#nidField').val()
			}

			if (!Session.get('currentUser')){
				user._id = Meteor.userId();
				user.numOfCourses = -1;
				Session.set('currentUser',user);
				Meteor.call('createUserData',user._id,user.firstName,user.lastName,user.major,user.catalog,
					user.startSem,user.startYear,user.endSem,user.endYear,user.advisor,user.nid,user.numOfCourses,
					function(error,result){
						var advisorObj = AGORAUsers.findOne({firstName:user.advisor.split(', ')[1],lastName:user.advisor.split(', ')[0],isAdvisor:true});
						Meteor.call('addStudentToAdvisorList',advisorObj._id,user._id);
					});
			} else {
				user._id = Session.get('currentUser')._id;
				user.numOfCourses = Session.get('currentUser').numOfCourses;
				user.isAdvisor = Session.get('currentUser').isAdvisor;
				Session.set('currentUser',user);
				Meteor.call('updateUserData',user._id,user.firstName,user.lastName,user.major,user.catalog,
					user.startSem,user.startYear,user.endSem,user.endYear,user.advisor,user.nid,user.numOfCourses,
					function(error,result){
						var advisorObj = AGORAUsers.findOne({firstName:user.advisor.split(', ')[1],lastName:user.advisor.split(', ')[0],isAdvisor:true});
						Meteor.call('addStudentToAdvisorList',advisorObj._id,user._id);
					});
			}
			
		},
    	'click #findCoursesButton' : function(event){
    		var importString = $('#importInfoField').val();

			Meteor.call('parseCourseData', importString, function(err,result) {
				Session.set('foundSchedule', result);
				fillYearArray(result.yearStart, result.yearEnd);
				// updates number of courses
				var user = Session.get('currentUser');
				user.numOfCourses = result.numOfCourses;
				Session.set('currentUser',user);
				Meteor.call('updateUserData',
					user._id,
					user.firstName,
					user.lastName,
					user.major,
					user.catalog,
					user.startSem,
					user.startYear,
					user.endSem,
					user.endYear,
					user.advisor,
					user.nid,
					user.numOfCourses,
					function (error, result) {
						if (!error) {
							Session.set('isSetupFinished',true);
						}
					}
				);
			});
    	},
    	'click #importButton' : function(event) {
    		var user = Session.get('currentUser');
    		Meteor.call('importCourseSchedule', user._id, Session.get('foundSchedule').schedule);
    	}
    });
}