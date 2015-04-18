if(Meteor.isClient){

    Template.advisor.helpers({
        userList: function(){
            //var user = AGORAUsers.findOne({_id:Meteor.userId()});
            var user = Session.get('currentUser');
            var userList = AGORAUsers.find({_id: {$in: user.id_Students}}).fetch()
            return userList;
        },
        subtractOne : function(year){
          var prevYear = Number(year) - 1;
          return prevYear + "";
        },
        studentYearsWithTitles: function () {
          var arr = [];
          var user = Session.get('currentStudent');
          var startYear = Number(user.startYear);
          var endYear = Number(user.endYear);
          if(user.startSem == 'Fall')
            startYear++;
          if(user.endSem == 'Fall')
            endYear++;

          for(var i = 0; i <= endYear - startYear; i++){
              arr[i] = startYear + i;
          }

          return arr;
        },
        	studentScheduleHTML: function(year) {
    		var sched = Session.get('currentStudent').importedSched;
    		var curUser = Session.get('currentStudent');
    		var yrIndex;
    		//if (curUser && curUser.startSem == 'Fall')
    			//year++;

    		//if ( year > curUser.endYear && curUser.endSem != 'Fall') {
    		    //return "";
    		//}



			var yrIndex = year - curUser.startYear;
    		var prevYearSchedule;

    		if (yrIndex > 0) 
    			prevYearSchedule = sched[yrIndex-1];
    		else {
    			prevYearSchedule = [
				  ["","","","","",""],
				  ["","","","","",""],
				  ["","","","","",""] ];
    		}
    		
    		var currYearSchedule = sched[yrIndex];
    		if (yrIndex == sched.length) {
    			 currYearSchedule = [
				  ["","","","","",""],
				  ["","","","","",""],
				  ["","","","","",""] ];
    		}

    		
    		var HTMLString = '<table class="ui three column celled table" style="margin-top:0;margin-bottom:0;"><thead><tr>';
    		HTMLString += '<th>Fall '+ Number(year-1) +'</th>';
    		HTMLString += '<th>Spring '+year+'</th>';
    		HTMLString += '<th>Summer '+year+'</th></tr></thead><tbody>';
			for (var i = 0; i < 6; i++) {
				if (Session.get('currentStudent').grades){
				var fallGrade = Session.get('currentStudent').grades[prevYearSchedule[0][i]];
				var springGrade = Session.get('currentStudent').grades[currYearSchedule[1][i]];
				var summerGrade = Session.get('currentStudent').grades[currYearSchedule[2][i]];
				} else {
					var fallGrade, springGrade, summerGrade;
				}
				
				if(fallGrade)
					HTMLString += '<tr><td style="text-align: center; height:37px;" yr="' + (yrIndex-1) + '"col="0" row="'+i+'">'+prevYearSchedule[0][i]+'  |  '+fallGrade+'</td>';
				else
					HTMLString += '<tr><td style="text-align: center; height:37px;" yr="' + (yrIndex-1) + '"col="0" row="'+i+'">'+prevYearSchedule[0][i]+'</td>';
				
				if (springGrade)
					HTMLString += '<td style="text-align: center; height:37px;" yr="' + yrIndex + '"col="1" row="'+i+'">'+currYearSchedule[1][i]+'  |  '+springGrade+'</td>';
				else
					HTMLString += '<td style="text-align: center; height:37px;" yr="' + yrIndex + '"col="1" row="'+i+'">'+currYearSchedule[1][i]+'</td>';
				
				if (summerGrade)
					HTMLString += '<td style="text-align: center; height:37px;" yr="' + yrIndex + '"col="2" row="'+i+'"><label>'+currYearSchedule[2][i]+'  |  '+summerGrade+'</td></tr>';
    			else
    				HTMLString += '<td style="text-align: center; height:37px;" yr="' + yrIndex + '"col="2" row="'+i+'">'+currYearSchedule[2][i]+'</td></tr>';
    		}
    		HTMLString += '</tbody></table>';
    		return HTMLString;
    	}
    })

    Template.advisor.events({
        'click .student.button' : function(event){
            Session.set('currentStudent',this);
        }
    });

    Template.advisor.rendered = function(){
    	Session.set('currentStudent',null);
    }


}