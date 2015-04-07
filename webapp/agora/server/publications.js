Meteor.publish('mainUserInfo', function(){
	if (!this.userId){
		this.ready();
		return;
	}
	return AGORAUsers.find({_id: this.userId}); 
});

Meteor.publish('studentsFromList', function(){
	if (!this.userId){
		this.ready();
		return;
	}
	var studentList = AGORAUsers.find({_id: this.userId}).id_Students;
	if (studentList)
		return AGORAUsers.find({_id: {$in: studentList}});
	else
		return;
});
