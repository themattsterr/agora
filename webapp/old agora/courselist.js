// agora course list template

if (Meteor.isClient) {

	var updateCourseSchedule = function(scheduleData){
		var user = Session.get('currentUser');
		user.importedSched = scheduleData;
		Session.set('currentUser',user);
		Meteor.call('importCourseSchedule',user._id, scheduleData);
		Template.schedule.rendered();
	}

	Template.courseList.rendered = function(){
    	$('#searchResults').css({top: '220px',width:'350px', 'min-height':'740px'});
  	}

  	Template.courseList.helpers({
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
	    }
	  });

	  Template.courseList.events({
	    'blur .ui.dropdown': function (event) {
	      var search = Session.get('searchParam');

	      if ($('#collegeDropdown').dropdown('get text') != "College")
	        search.college = $('#collegeDropdown').dropdown('get text');

	      if ($('#deptDropdown').dropdown('get text') != "Dept")
	        search.dept = $('#deptDropdown').dropdown('get text');

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