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


if (Meteor.isClient) {


    Template.main.events({
        'click #studentButton' : function(){
            changeView( 'login' );
        },
        'click #advisorButton' : function(){
            changeView( 'login' );
        }
    });

}