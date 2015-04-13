if(Meteor.isClient){

	var fillYearArray = function(start,end){
		var arr = [];
		for(var i = 0; i <= end-start; i++){
			arr[i] = 2000 + start + i;
		}
		Session.set('yearArray',arr);
	}

    Template.import.helpers({
       yearsWithTitles: function () {
        	return Session.get('yearArray');
    	},
    	foundCoursesHTML: function(year) {
    		var foundSched = Session.get('foundSchedule');
    		var curUser = Session.get('currentUser');
    		var yrIndex;
    		if (curUser && curUser.startSem == 'Fall')
    			year++;

    		if ( year - 2000 > foundSched.yearEnd) {
    		    return "";
    		}



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
				HTMLString += '<tr><td class="course cell">'+prevYearSchedule[0][i]+'</td>';
				HTMLString += '<td class="course cell">'+currYearSchedule[1][i]+'</td>';
				HTMLString += '<td class="course cell">'+currYearSchedule[2][i]+'</td></tr>';
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

    Template.import.events({
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
    		user.importedSched = Session.get('foundSchedule').schedule;
    		Session.set('currentUser',user);
    		Session.set('foundSchedule',null);
    	}
    });
}