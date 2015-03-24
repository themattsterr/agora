Meteor.methods({
	'insertData' : function(arr){

		for (var i = 98; i < arr.length; i++) {
			var curCourse = arr[i];
			AGORACourses.insert(curCourse);
		}
	}
});