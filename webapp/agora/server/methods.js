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
	'updateUserData': function(id, first, last, major, catalog, startSem, startYear, endSem, endYear, advisor, nid, numOfCourses){
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

		var regex = /((FA|SP|SU)[0-3][0-9]) ([A-Z]{3})(\d{4}(H|C)*)/gm
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
			var year = Number(semYear.substr(2)) - yearStart;

			var col = -1;
			if (semYear.substr(0,2) == 'FA')
				col = 0;
			else if (semYear.substr(0,2) == 'SP')
				col = 1;
			else if (semYear.substr(0,2) == 'SU')
				col = 2;

			
			var course = {identifier: identifier, yr: year, col: col};
			if (year + yearStart <= yearEnd || year < 0)
				coursesToAdd.push(course);
		}

		for(var i in coursesToAdd) {
			var curCourse = coursesToAdd[i];
			console.log(curCourse);
			for (var curRow in sched[curCourse.yr][curCourse.col]){
				if (sched[curCourse.yr][curCourse.col][curRow] == ""){
					sched[curCourse.yr][curCourse.col][curRow] = curCourse.identifier;
					break;
				}
			}
		}


		return {"schedule": sched, "yearStart": yearStart, "yearEnd": yearEnd, "numOfCourses": coursesToAdd.length};

	},
	'importCourseSchedule' : function(idUser, scheduleData){
		AGORAUsers.update({_id:idUser}, {$set:{importedSched: scheduleData} }, {upsert:true} );
	}
});