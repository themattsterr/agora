Meteor.methods({
	'getUserData':function(id){
		var user = AGORAUsers.findOne({_id:id});
		return user;
	},
	'createUserData': function(id, first, last, major, catalog, startSem, startYear, endSem, endYear, advisor, nid, numOfCourses){
		return AGORAUsers.insert(
		{				//modifier
			_id: id,
			firstName: first,
			lastName: last,
			isAdvisor: false,
			major: major,
			catalog: catalog,
			startSem: startSem,
			startYear: startYear,
			endSem: endSem,
			endYear: endYear,
			advisor: advisor,
			nid: nid,
			numOfCourses: numOfCourses,
		});
	},
	'updateUserData': function(id, first, last, major, catalog, startSem, startYear, endSem, endYear, advisor, nid, numOfCourses,grades){
		var updateCount = AGORAUsers.update(
		{_id:id},			//selector
		{	$set :{				//modifier
			_id: id,
			firstName: first,
			lastName: last,
			isAdvisor: false,
			major: major,
			catalog: catalog,
			startSem: startSem,
			startYear: startYear,
			endSem: endSem,
			endYear: endYear,
			advisor: advisor,
			nid: nid,
			numOfCourses: numOfCourses,
			grades: grades
		}},	{upsert : false});
	},
	'addStudentToAdvisorList' :function(id_Advisor,id_Student){
		AGORAUsers.update({_id:id_Advisor},{$addToSet: {id_Students: id_Student}},function(error,count){
			console.log(error,count);
		});
	},
	'insertData' : function(arr){
		if (AGORACourses.find({}).fetch().length == 0) {
			console.log('inserting data')
			for (var i = 0; i < arr.length; i++) {
				var curCourse = arr[i];
				AGORACourses.insert(curCourse);
			}
		}
	},
	'parseCourseData' : function(courseData){

		var regex = /((FA|SP|SU)[0-3][0-9]) ([A-Z]{3})(\d{4}[HC]*).+?(\d{1,2}\.\d{1}) (.{1,3})/gm
		var arr = courseData.match(regex);
		var coursesToAdd = [];
		var sched = 
		[// schedule[0] is the first year
		  [ //schedule[0][0] is the first semester (fall) of the first year 
		      ["","","","",""],
		      ["","","","",""],
		      ["","","","",""]  
		  ],
		  [   
		      ["","","","",""],
		      ["","","","",""],
		      ["","","","",""]  
		  ],
		  [   
		      ["","","","",""],
		      ["","","","",""],
		      ["","","","",""]  
		  ],
		  [   
		      ["","","","",""],
		      ["","","","",""],
		      ["","","","",""]  
		  ],
		  [   
		      ["","","","",""],
		      ["","","","",""],
		      ["","","","",""]  
		  ]
		];
		var yearStart = Number(arr[0].split(' ')[0].substr(2));
		var yearEnd = Number(arr[arr.length - 1].split(' ')[0].substr(2));

		for(var i in arr){
			var semYear = arr[i].split(' ')[0];
			var identifier = arr[i].split(' ')[1].substr(0,3) + ' ' + arr[i].split(' ')[1].substr(3);
			var year = Number(semYear.substr(2));

			var col = -1;
			if (semYear.substr(0,2) == 'FA')
				col = 0;
			else if (semYear.substr(0,2) == 'SP')
				col = 1;
			else if (semYear.substr(0,2) == 'SU')
				col = 2;
			
			var course = {identifier: identifier, yr: year, col: col};

			for(var j = 2; j < arr[i].split(' ').length; j++){
				if (arr[i].split(' ')[j] != ""){
					course.credits = arr[i].split(' ')[j];
					course.grade = arr[i].split(' ')[j+1];
					break;
				}
			}
			

			if (col >= 0) coursesToAdd.push(course);
		}
		
		var numFound = 0;

		for(var i in coursesToAdd) {
			var curCourse = coursesToAdd[i];
			if (AGORACourses.findOne({identifier:curCourse.identifier})) numFound++;
			else curCourse.courseVariation = "warning";
			if (curCourse.yr < yearStart) yearStart = curCourse.yr;
			if (curCourse.yr > yearEnd) yearEnd = curCourse.yr;

			if (curCourse.col == 0) curCourse.semester = "Fall";
			if (curCourse.col == 1) curCourse.semester = "Spring";
			if (curCourse.col == 2) curCourse.semester = "Summer";

			curCourse.year = Number(curCourse.yr) + 2000;


			
			coursesToAdd[i] = curCourse;

		}

      coursesToAdd.sort(function(a, b) { 
        if (a.yr > b.yr) 
          { return 1; }
        if (a.yr < b.yr) 
          { return -1; }
        if (a.yr == b.yr){
        	if (a.col == 0) {
        		if (b.col == 1) return 1;
        		if (b.col == 2) return 1;
        	}
        	if (b.col == 0) {
        		if (a.col == 1) return -1;
        		if (a.col == 2) return -1;
        	}
        	if(a.col > b.col) return 1;
        	if(a.col < b.col) return -1;
        }
        return 0; 
      });


		return {"schedule": sched, "courses": coursesToAdd, "yearStart": yearStart, "yearEnd": yearEnd, "numTotal": coursesToAdd.length, "numFound": numFound};

	},
	'importCourseSchedule' : function(idUser, scheduleData){
		AGORAUsers.update({_id:idUser}, {$set:{importedSched: scheduleData} }, {upsert:true} );
	},
	'getCourseInfo' : function(courseCode){
		var courseObj = AGORACourses.find(
			{identifier:courseCode}
		).fetch();
		
		console.log(courseObj);
	}
});