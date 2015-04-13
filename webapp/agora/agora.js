



if (Meteor.isClient) {


  Session.setDefault('searchParam', {});
  Session.setDefault('selectedCourse',null);
  Session.setDefault('selectedCard',null);
  Session.setDefault('isSidebarOpen',false);
  Session.setDefault('renderOrder', { last: 0 });
  Session.setDefault('schedule',null);
  Session.setDefault('isSignUp', false);
	Session.setDefault('viewHistory',null);


  var User = function(id){
  	this.id = id;
  	this.set = false;
  }

  User.prototype.checkData = function(){
	var value = AGORAUsers.findOne({_id:this.id});
	if (value){
  		this.value = value;
  		this.set = true;
	}
  }

  User.prototype.getData = function(user){
  	var handle = Meteor.setInterval(function(){
		user.checkData();
		if (user.value){
			Meteor.clearInterval(handle);
			console.log(user.value);
		}
	},1000);
  }

  User.prototype.setSession = function(user, session){
  	 var handle = Meteor.setInterval(function(){
		user.checkData();
		if (user.value){
			Meteor.clearInterval(handle);
			Session.set(session,user);
		}
	},1000);
  }

 var user = new User(Meteor.userId());

  Template.registerHelper('isReady', function () {
  	var first = AGORAUsers.findOne();
  	if (first){
  		if(!Session.get('currentUser')){
    		Session.set('currentUser',AGORAUsers.findOne({_id:Meteor.userId()}));
    		//Session.set('mainUser',AGORAUsers.findOne({_id:Meteor.userId()}));
  		}
    	return true;
  	}
    else {
    	console.log(first);
    	return false;
    }
  });

  Template.registerHelper('withIndex', function (array) {
    return _.map(array, function (val, i) {
      return {
        'index': i,
        'value': val
      };
    });
  });

  Template.head.helpers({
    userEmail: function(){
		return Meteor.user().emails[0];
	},
	isUserAdvisor: function(){
		// returning null when using get mainUser
		var user = Session.get('currentUser');
		return user.isAdvisor;
	},
	userList: function(){
		//var user = AGORAUsers.findOne({_id:Meteor.userId()});
		var user = Session.get('mainUser');
		var userList = AGORAUsers.find({_id: {$in: user.id_Students}}).fetch()
		var nidList = [];
		for (var i in userList){
			nidList.push(userList[i].nid);
		}
		return nidList;
	}
  });

  Template.head.events({


    'click #backButton' : function(){
    	var cur = Session.get('currentView'),
    		viewHistory = Session.get('viewHistory');
    	
    	if( !viewHistory || viewHistory.length == 0){
    		if(cur == 'login') Session.set('currentView','main');
    	}
    	else {
    		Session.set('currentView',viewHistory.pop());
    		Session.set('viewHistory',viewHistory);
    	}
    	Session.set('isSignUp',false);
     },
    'click #logOutButton': function() {
		Meteor.logout(function(error){
			if(error)
				alert(error);
			else {
				Session.set('currentUser', null);
				Session.set('mainUser', null);
				Session.set('searchParam', {});
				Session.set('selectedCard', null);
				Session.set('selectedCourse', null);
				Session.set('renderOrder', { last: 0 });
				
				Session.set('viewHistory',null);
				Session.set('currentView','main');
			}

		});
      },
      'click #userButton' :function(event){
      	changeView('profile');
      }


    
  });


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

  Template.registerHelper('currentView', function () {
    return Session.get('currentView');
  });

}

var changeView = function( newView ){
  	var curView = Session.get('currentView'),
  		viewHistory = Session.get('viewHistory');

  	if (!viewHistory) {
  		viewHistory = new Array();
  		viewHistory.push(curView);
  	} else {
        var lastView = viewHistory.pop();
        if(lastView){
            viewHistory.push(lastView);
            if(lastView != curView){
                viewHistory.push(curView);
            }
        } else viewHistory.push(curView);
  	}

	Session.set('currentView',newView);
	Session.set('viewHistory',viewHistory);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.call('insertData',courses);
  });
}
