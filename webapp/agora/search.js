if (Meteor.isClient) {

	var updateCourseSchedule = function(scheduleData){
		var user = Session.get('currentUser');
		user.importedSched = scheduleData;
		Session.set('currentUser',user);
		Meteor.call('importCourseSchedule',user._id, scheduleData);
	}
	

	Template.search.rendered = function(){
    	//$('#searchResults').css({top: '220px',width:'350px', 'min-height':'740px'});
  	}

  	Template.search.helpers({
	    courseArray: function () {
	      var searchParam = Session.get('searchParam');
	      if (jQuery.isEmptyObject(searchParam))
	        return [];
	      else
	        return AGORACourses.find(searchParam).fetch();
	    },
	    collegeList: function () {
	      var distinctEntries = _.uniq(AGORACourses.find({}, {
	          sort: {college: 1}, fields: {college: true}
	      }).fetch().map(function(x) {
	          return x.college;
	      }), true);
	      return distinctEntries;
	    },
	    deptList : function() {
	      var searchParam = Session.get('searchParam');
	      var distinctEntries = _.uniq(AGORACourses.find({college:searchParam.college}, {
	          sort: {dept: 1}, fields: {dept: true}
	      }).fetch().map(function(x) {
	          return x.dept;
	      }), true);
	      return distinctEntries;
	    },
	    yearsWithTitles : function(){
		  var arr = [];
		  var user = Session.get('currentUser');
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
	    scheduledCoursesHTML: function(year) {
    		var sched = Session.get('currentUser').importedSched;
    		var curUser = Session.get('currentUser');
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
				HTMLString += '<tr><td style="text-align: center;" class="clickableCell" yr="' + (yrIndex-1) + '"col="0" row="'+i+'">'+prevYearSchedule[0][i]+'</td>';
				HTMLString += '<td style="text-align: center;"  class="clickableCell" yr="' + yrIndex + '"col="1" row="'+i+'">'+currYearSchedule[1][i]+'</td>';
				HTMLString += '<td style="text-align: center;"  class="clickableCell" yr="' + yrIndex + '"col="2" row="'+i+'">'+currYearSchedule[2][i]+'</td></tr>';
    		}
    		HTMLString += '</tbody></table>';
    		return HTMLString;
    	}
	  });

	  Template.search.events({
	    'blur .ui.dropdown': function (event) {
	      var search = Session.get('searchParam');

	      if ($('#collegeDropdown').dropdown('get text') != "College")
	        search.college = $('#collegeDropdown').dropdown('get value');

	      if ($('#deptDropdown').dropdown('get text') != "Department")
	        search.dept = $('#deptDropdown').dropdown('get value');

	      Session.set('searchParam', search );

	    },
	    'click #resetButton' : function(){
	      Session.set('searchParam',{});
	      $('#collegeDropdown').dropdown('restore defaults');
	      $('#deptDropdown').dropdown('restore defaults');
	      $('#codeSearchBox').val('');
	      $('#titleSearchBox').val('');
	      $('#yearDropdown').dropdown('restore defaults');
	      $('#semesterDropdown').dropdown('restore defaults');
	    },
	    'click #searchButton' : function(){
	      var search = Session.get('searchParam');

	      if ($('#codeSearchBox').val() != "")
	        search.identifier = { $regex: $('#codeSearchBox').val() };

	      if ($('#titleSearchBox').val() != "")
	        search.title = { $regex: $('#titleSearchBox').val() };

	      Session.set('searchParam',search);
	    },
		'click .clickableCell' : function(event){
			console.log(event.target);
			  var schedule = Session.get('currentUser').importedSched;
			  var course = Session.get('selectedCourse');
			  var lastCard = Session.get('selectedCard');
			  var col = Number(event.target.getAttribute('col'));
			  var yr = Number(event.target.getAttribute('yr'));
			  var row = Number(event.target.getAttribute('row'));;

			  if (event.target.innerHTML != "")
				return false;

			  if(course) {
				schedule[yr][col][row] = course.identifier;

				updateCourseSchedule(schedule);
				Session.set('selectedCourse',null);
				Session.set('selectedCard',null);
				$('#'+ lastCard).css('background','rgb(255, 255, 255)');

			  }
		},
	    'click #addCourseButton' : function(event){
	      var schedule = Session.get('currentUser').importedSched;
	      var course = Session.get('selectedCourse');
	      var lastCard = Session.get('selectedCard');
	      var col = $('#semesterDropdown').dropdown('get value');
	      var yr = $('#yearDropdown').dropdown('get value');
	      var row = null;

	      if (col == 'Sem' || yr == 'Year')
	        return false;

	      for(var curRow in schedule[yr][col]) {
	        if(schedule[yr][col][curRow] == "") {
	          row = curRow;
	          if (yr >= 4)
	            console.log(yr,col,row);
	          break;
	        }
	      }
	      
	      if(row && course) {
	        schedule[yr][col][row] = course.identifier;

	        updateCourseSchedule(schedule);
	        Session.set('selectedCourse',null);
	        Session.set('selectedCard',null);
	        $('#'+ lastCard).css('background','rgb(255, 255, 255)');

	      }


	    },



	    'click .course.card' : function(event){
	      console.log(event.currentTarget);

	      var lastCard = Session.get('selectedCard');
	      var lastCourse = Session.get('selectedCourse');

	      if (lastCourse) {
	          if (this._id == lastCourse._id){
	            Session.set('selectedCourse',null);
	            Session.set('selectedCard',null);
	            $(event.currentTarget).css('background','rgb(255, 255, 255)');
	          } else {
	            $('#'+ lastCard).css('background','rgb(255, 255, 255)');
	            Session.set('selectedCourse',this);
	            Session.set('selectedCard',event.currentTarget.id);
	            $(event.currentTarget).css('background','rgb(212, 239, 249)');
	          }
	      } else {
	        Session.set('selectedCourse',this);
	        Session.set('selectedCard',event.currentTarget.id);
	        $(event.currentTarget).css('background','rgb(212, 239, 249)');
	      }
	    }
	  });

}