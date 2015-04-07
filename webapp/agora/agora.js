



if (Meteor.isClient) {


  Session.setDefault('searchParam', {});
  Session.setDefault('selectedCourse',null);
  Session.setDefault('selectedCard',null);
  Session.setDefault('isSidebarOpen',false);
  Session.setDefault('renderOrder', { last: 0 });
  Session.setDefault('schedule',null);
  Session.setDefault('isSignUp', false);
  Session.setDefault('currentView','schedule');

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


  Template.registerHelper('isSidebarOpen', function () {
    return Session.get('isSidebarOpen');
  });

  Template.registerHelper('isAccountSettings', function () {
    return Session.get('currentView') == 'account settings';
  });

  Template.registerHelper('isReady', function () {
  	var first = AGORAUsers.findOne();
  	if (first){
  		if(!Session.get('mainUser')){
    		Session.set('currentUser',AGORAUsers.findOne({_id:Meteor.userId()}));
    		Session.set('mainUser',AGORAUsers.findOne({_id:Meteor.userId()}));
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
		var user = Session.get('mainUser');
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
    'click #accountSettingsButton' : function(){
        Session.set('currentView','account settings');
     },
    'click #openSidebar': function () {
        //$('.ui.sidebar').sidebar('toggle');
        //Meteor.call('insertData', courses);
        var initialElement = $('.center-pane');
        var openedElement = $('.center-pane-out');

        if (!initialElement.length) {
          Session.set('isSidebarOpen',false);
          openedElement[0].className = 'center-pane';
          $('.left-pane-out')[0].className = 'left-pane'
          $('.left-pane').css('left','0px');
        }

        if(!openedElement.length) {
          Session.set('isSidebarOpen',true);
          initialElement[0].className = 'center-pane-out';
          $('.left-pane')[0].className = 'left-pane-out';
          $('.left-pane').css('left','350px');

        }
      },
    'click #scheduleButton': function () {
        Session.set('currentView','schedule');
      },
    'click #signOutButton': function() {
		Meteor.logout(function(error){
			if(error)
				alert(error);
			else {
				Session.set('currentUser', null);
				Session.set('mainUser', null);
				Session.set('isSetupFinished', false);
				Session.set('isSidebarOpen', false);
				Session.set('isSignUp', false);
				Session.set('searchParam', {});
				Session.set('selectedCard', null);
				Session.set('selectedCourse', null);
				Session.set('schedule', null);
				Session.set('renderOrder', { last: 0 });
				if( Session.get('currentView') == 'schedule' ){
					Template.schedule.rendered();
				} else if( Session.get('currentView') == 'account settings' ) {
					Template.setup.rendered();
				}
			}

		});
      },
      'change #userField': function (event) {
      	var selectedValue = $('#userDropdown').dropdown('get text');
      	var selectedUser = {};
      	if (selectedValue != Meteor.user().emails[0].address)
      		selectedUser = AGORAUsers.findOne({nid: selectedValue});
      	else 
      		selectedUser = Session.get('mainUser');

      	Session.set('currentUser',selectedUser);
      	if( Session.get('currentView') == 'schedule' ){
      		Template.schedule.rendered();
      	} else if( Session.get('currentView') == 'account settings' ) {
      		Template.setup.rendered();
      	}
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



}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.call('insertData',courses);
  });
}
