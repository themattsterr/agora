Meteor.methods({
	'insertData' : function(arr){
		if (AGORACourses.find({}).fetch().length == 0) {
			console.log('inserting data')
			for (var i = 0; i < arr.length; i++) {
				var curCourse = arr[i];
				AGORACourses.insert(curCourse);
			}
		}
	},
	'parseCourseData' : function(idUser, courseData, yearStart, yearEnd){

		var regex = /((FA|SP|SU)[0-1][0-9]) ([A-Z]{3})(\d{4}(H|C)*)/gm
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
			coursesToAdd.push(course);
		}

		for(var i in coursesToAdd) {
			var curCourse = coursesToAdd[i];
			for (var curRow in sched[curCourse.yr-1][curCourse.col]){
				if (sched[curCourse.yr-1][curCourse.col][curRow] == ""){
					sched[curCourse.yr-1][curCourse.col][curRow] = curCourse.identifier;
					break;
				}
			}
		}

		AGORAUsers.update({_id:idUser}, {$set:{importedSched: sched , yearStart: yearStart, yearEnd: yearEnd}}, {upsert:true} );

		return sched;

	}
});