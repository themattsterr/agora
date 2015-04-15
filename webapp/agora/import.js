if(Meteor.isClient){

	Template.import.onDestroyed(function(){
		Session.set('foundSchedule',null);
		Session.set('coursesFoundMessage',null);
	});

    Template.import.helpers({
    	coursesFound : function(){
    		if (Session.get('foundSchedule')) return Session.get('foundSchedule').courses;
    		else return false;
    	},
    	coursesFoundMessage : function(){
    		var msg = {
    			variation : "",
    			header : "No Courses",
    			message : "Complete the Import Area section to view or import courses found."
    		};

    		if (Session.get('coursesFoundMessage')) msg = Session.get('coursesFoundMessage');

    		return msg;
    	},
       yearsWithTitles: function () {
        	return Session.get('yearArray');
    	},
    	foundCoursesHTML: function(year) {
    		var foundSched = Session.get('foundSchedule');
    		var curUser = Session.get('currentUser');
    		var yrIndex;
    		if (curUser && curUser.startSem == 'Fall')
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

    		var cellVariation = ['','',''];

    		if (year == curUser.startYear){
    			if (curUser.startSem == "Summer") {
    				cellVariation[1] = 'warning';
    				cellVariation[0] = 'warning';
    			}
    			if (curUser.startSem == "Spring") {
    				cellVariation[0] = 'warning';
    			}
    		}

    		var currYearSchedule = foundSched.schedule[yrIndex];
    		var HTMLString = '<table class="ui three column celled table"><thead><tr>';
    		HTMLString += '<th>Fall '+ Number(year-1) +'</th>';
    		HTMLString += '<th>Spring '+year+'</th>';
    		HTMLString += '<th>Summer '+year+'</th></tr></thead><tbody>';
			for (var i = 0; i < 4; i++) {
				HTMLString += '<tr><td style="text-align:center;" class="course '+cellVariation[0]+' cell">'+prevYearSchedule[0][i]+'</td>';
				HTMLString += '<td style="text-align:center;" class="course '+cellVariation[1]+' cell">'+currYearSchedule[1][i]+'</td>';
				HTMLString += '<td style="text-align:center;" class="course '+cellVariation[2]+' cell">'+currYearSchedule[2][i]+'</td></tr>';
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
				if(result){
					var user = Session.get('currentUser');
					var semesterToNumber = function(sem){
						if (sem == "Fall") return 3;
						else if (sem == "Spring") return 1;
						else if (sem == "Summer") return 2;
						else if (sem == 0) return 3;
						else if (sem == 1 || sem == 2) return sem;
						else return -1;
					}
					for (var i in result.courses){
						var curCourse = result.courses[i];
						if (curCourse.year < Number(user.startYear) || curCourse.year > Number(user.endYear)){
							result.courses[i].variation = "negative";
						} else if (curCourse.year == Number(user.startYear)){
							if (semesterToNumber(curCourse.col) < semesterToNumber(user.startSem))
								result.courses[i].variation = "negative";
						} else if (curCourse.year == Number(user.endYear)){
							if (semesterToNumber(curCourse.col) > semesterToNumber(user.endSem))
								result.courses[i].variation = "negative";
						}
					}
					Session.set('foundSchedule', result);
					var msg;
					if (result.numFound == result.numTotal){
						msg = {
							variation : "positive",
							header : "All " + result.numTotal + " Courses Found",
							message : '<ul class="list"><li>Courses shown below in red are out of the date range in your profile.</li></ul>'
						};
					}
					else {
						msg = {
							variation : "negative",
							header : result.numFound + " out of " + result.numTotal + " Courses Found",
							message : '<ul class="list"><li>Courses shown below in red are out of the date range in your profile.</li><li>Courses shown below in yellow were not found in the AGORA database.</li></ul>'
						};
					}
					Session.set('coursesFoundMessage',msg);
				} else console.log(err);
			});
    	},
    	'click #importButton' : function(event) {
    		var user = Session.get('currentUser');
			var coursesToAdd = Session.get('foundSchedule').courses;
			var sched = [];
			Session.get('yearArray').forEach(function(element){
				sched.push(			
					// schedule[0] is the first year
					  [//schedule[0][0] is the first semester (fall) of the first year 
						  ["","","","","",""],
						  ["","","","","",""],
						  ["","","","","",""]  
					  ]
					);
			});

			var yearStart = Number(user.startYear.substr(2));
			var numAdded = 0;
			for (var i in coursesToAdd){
				var curCourse = coursesToAdd[i];
				if (coursesToAdd[i].variation != "negative"){
					for (var curRow in sched[curCourse.yr - yearStart][curCourse.col]){
						if (sched[curCourse.yr - yearStart][curCourse.col][curRow] == ""){
							sched[curCourse.yr- yearStart][curCourse.col][curRow] = curCourse.identifier;
							numAdded++;
							break;
						}
					}
				}
			}


    		Meteor.call('importCourseSchedule', user._id, sched);
			//fillYearArray(result.yearStart, result.yearEnd);
			// updates number of courses
			user.numOfCourses = numAdded;
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

					}
				}
			);
    		user.importedSched = sched;
    		Session.set('currentUser',user);
    		Session.set('foundSchedule',null);
			var msg = {
				variation : "positive",
				header : "Schedule Imported",
				message : "Return to the student profile page to view your imported schedule"
			};
			Session.set('coursesFoundMessage',msg);
    	}
    });
}