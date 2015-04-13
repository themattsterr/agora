if(Meteor.isClient){

    Template.advisor.helpers({
        userList: function(){
            //var user = AGORAUsers.findOne({_id:Meteor.userId()});
            var user = Session.get('currentUser');
            var userList = AGORAUsers.find({_id: {$in: user.id_Students}}).fetch()
            return userList;
        }
    })

}