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

    Template.profile.events({
        'click #searchButtonProfile' : function(event){
            changeView('search');
        },
        'click #importButtonProfile' : function(event){
            changeView('import');
        },
        'click #updateButtonProfile' : function(event){
            changeView('update');
        },
        'click #adviseStudentsProfile' : function(event){
        	changeView('advisor');
        },
        'click #createNewScheduleButton' : function(event){
        	var user = Session.get('currentUser');
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
			Meteor.call('importCourseSchedule', user._id, sched);
			//fillYearArray(result.yearStart, result.yearEnd);
			// updates number of courses
			user.numOfCourses = 0;
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
        }
    });

}