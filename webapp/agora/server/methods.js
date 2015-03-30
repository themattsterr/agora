Meteor.methods({
	'insertData' : function(arr){
		if (AGORACourses.find({}).fetch().length == 0) {
			console.log('inserting data')
			for (var i = 0; i < arr.length; i++) {
				var curCourse = arr[i];
				AGORACourses.insert(curCourse);
			}
		}
	}
});