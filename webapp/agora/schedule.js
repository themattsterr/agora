// agora schedule template




if (Meteor.isClient) {

  	var fillYearArray = function(start,end){
		start = Number(start.substr(2,2));
		end = Number(end.substr(2,2));
		var arr = [];
		for(var i = 0; i <= end-start; i++){
			arr[i] = 2000 + start + i;
		}
		Session.set('yearArray',arr);
	}

    //used in drag and drop events for live updating
  	var updateCourseSchedule = function(scheduleData){
		var user = Session.get('currentUser');
		user.importedSched = scheduleData;
		Session.set('currentUser',user);
		Meteor.call('importCourseSchedule',user._id, scheduleData);
		Template.schedule.rendered();
  	}

  var resetSchedule = function(scheduleData){
      
     var cellWidth = $('#dragArea')[0].offsetWidth / 3 - 10,
        cellHeight = Number.parseInt($('.ui.three.column.celled.table')[0].offsetHeight / 7),
        //cellHeight = 36,
        currentUser = Session.get('currentUser'),
        yearCount = currentUser.endYear - currentUser.startYear;
     
     if (currentUser.startSem == "Fall" && yearCount > 0) yearCount--;
     if (currentUser.endSem == "Fall" && yearCount > 0) yearCount++;

        $('.drop').css({
          top: $('.table.ui.three.column.celled.table')[0].offsetTop + cellHeight,
          left: $('.table.ui.three.column.celled.table')[0].offsetLeft,
          //top:14 + cellHeight,
          //left:14,
          width: 3*cellWidth,
          height: 7*cellHeight + (7*(yearCount)*cellHeight) - cellHeight
        })

      var renderOrder = Session.get('renderOrder');
      var HTMLArray = [];
      var coords;

      for (var yr in scheduleData) {
        for (var col in scheduleData[yr]){
          for (var row in scheduleData[yr][col]){
            var val = scheduleData[yr][col][row];
            if (val != ""){
              var coords = '{\"z\":' + yr + ',\"x\":'+col+',\"y\":'+row+'}';
              if ( !renderOrder[val] ) {
                renderOrder[val] = renderOrder["last"] + 1;
                renderOrder["last"]++;
              }
              HTMLArray.push({ courseInfo: val, coords: coords, render: renderOrder[val] });
            }
          }
        }
      }
      Session.set('renderOrder',renderOrder);

      HTMLArray.sort(function(a, b) { 
        if (a.render > b.render) 
          { return 1; } 
        if (a.render < b.render) 
          { return -1; } 
        return 0; 
      });

      $('#dragAreaGrid')[0].innerHTML = "";
      for (var i in HTMLArray){

        var year = JSON.parse(HTMLArray[i].coords).z;
        var semester = JSON.parse(HTMLArray[i].coords).x;

        //
        //
        //
        //
        //get current date
        //check if year and semester within current date
        //
        //August 24, 2015 Fall
        //May 18, 2015 Summer
        //Jan 11, 2016 Spring 2016
        var spring = [1,11];
        var summer = [5,18];
        var fall = [8,24];
       
        var rightNow = new Date();
        var nowYear = rightNow.getFullYear();
        var nowDate = rightNow.getDate();
        var nowMonth = rightNow.getMonth();
        var currentSemester = -1;

        if (nowMonth >= spring[0] && nowDate >= spring[1])
        	currentSemester = 1;
		if (nowMonth >= summer[0] && nowDate >= summer[1])
			currentSemester = 2;
		if (nowMonth >= fall[0] && nowDate >= fall[1])
			currentSemester = 0;

		console.log(currentSemester);

        var HTMLString = '';
        if(semester == currentSemester && Number(currentUser.startYear) + year <= nowYear)
        	HTMLString += '<div class="drag locked"';
        else
        	HTMLString += '<div class="drag"';
        HTMLString += ' coords=' + HTMLArray[i].coords + ' >' 
        HTMLString += 		'<div class="ui buttons" style="width:100%;">\
        					<div class="ui labeled  icon button" style=" background-color: rgba(0,0,0,0);">' + HTMLArray[i].courseInfo + '\
								<i class="remove icon link icon"></i>\
							  </div>\
							  <div class="ui right floated button" style=" background-color: rgba(0,0,0,0);">';
		if(Session.get('show grades')) {
			HTMLString += Session.get('currentUser').grades[HTMLArray[i].courseInfo];
		}
		HTMLString += '			</div>\
							</div>';
		//HTMLString += '<div class="ui fluid right labeled icon button" style="background-color: rgba(0,0,0,0);">' + HTMLArray[i].courseInfo + '\n';
        //HTMLString += '<i class="remove icon link icon"></i></div>';
        HTMLString += '</div>';
        $('#dragAreaGrid')[0].innerHTML += HTMLString;
      }


      for (var i = 0; i < $('.drag').length; i++){
        var coordinates = $('.drag')[i].getAttribute('coords'),
            coordsObj = JSON.parse(coordinates);
            col = coordsObj.x,
            row = coordsObj.y,
            yr = coordsObj.z,
            curDiv = $('.drag')[i];

      if(col > 0 && yr > 0) yr--;

      $(curDiv).css({
          top: row*(cellHeight) + (7*(yr)*cellHeight),
          left: col*(cellWidth),
          width: cellWidth,
          height: cellHeight
        });

      }
      

  }


  Template.schedule.onRendered(function(){

  })

  Template.schedule.rendered = function(){

    var currentUser = Session.get('currentUser');


    fillYearArray(currentUser.startYear, currentUser.endYear);

      
      if(!currentUser || !currentUser.importedSched){
        $('#dragAreaGrid')[0].innerHTML = "";
        return;
      }

          Session.set('schedule', currentUser.importedSched);
          resetSchedule(Session.get('schedule'));
     
           var cellWidth = $('#dragArea')[0].offsetWidth / 3 - 10,
              cellHeight = Number.parseInt($('.ui.three.column.celled.table')[0].offsetHeight / 7),
              //cellHeight = 36,
              yearCount = currentUser.endYear - currentUser.startYear;
      
        jQuery(function($){
           var schedule = Session.get('schedule');
           var originalGridX, originalGridY, originalYear, originalValue;
           var $div = $('#dragAreaGrid');
           var z = 1;
           var gridCoords = function(x,y){
              var gridX, gridY, gridZ;

              gridX = Math.round( x / cellWidth);
              gridY = Math.round( y / cellHeight);
              gridZ = Math.floor(gridY / 7);

              gridY = gridY - 7*gridZ;

              if (gridX > 0)
                gridZ++;

              if (gridY == 6)
                gridZ = -1;


              console.log({x: gridX, y: gridY, z: gridZ});
              return {x: gridX, y: gridY, z: gridZ};
           }

           $('.drag')
            .drag("start",function( ev, dd ){
                schedule = Session.get('schedule');
                var coords = gridCoords($(this)[0].offsetLeft,$(this)[0].offsetTop);

                originalGridX = coords.x;
                originalGridY = coords.y;
                originalYear = coords.z;
                originalValue = schedule[originalYear][originalGridX][originalGridY];
                schedule[originalYear][originalGridX][originalGridY] = "";

                $( this ).css({
                  zIndex: z++,
                  background: "#85A1DA"
                });

            })
           .drag(function( ev, dd ){

              var coords = gridCoords($(this)[0].offsetLeft,$(this)[0].offsetTop);


                $( this ).css({
                  top: Math.round( dd.offsetY / cellHeight ) * cellHeight ,
                  left: Math.min( 2*cellWidth, Math.max( 0, Math.round( dd.offsetX / cellWidth ) * cellWidth ))
                });

                if( coords.z < 0 ) {
                  $( this ).css('visibility','hidden')
                } else {
                  $( this ).css('visibility','visible')
                }


           },{ relative:true })

          .drag("end", function(ev, dd){

                var coords = gridCoords($(this)[0].offsetLeft,$(this)[0].offsetTop);

                if(coords.z >= 0 && coords.z <= yearCount && schedule[coords.z][coords.x][coords.y] == "") {
                  schedule[coords.z][coords.x][coords.y] = originalValue;
                  var coordsAttr = '{ \"z\":' + coords.z + ', \"x\": '+coords.x+', \"y\": '+coords.y+'}';

                  $(this)[0].setAttribute('coords',coordsAttr);

                } else {
                  $( this ).css('visibility','visible')
                  $( this ).animate({
                      top: dd.originalY,
                      left: dd.originalX
                   }, 420 );
                  schedule[originalYear][originalGridX][originalGridY] = originalValue;
                }

                Session.set('schedule', schedule);
                updateCourseSchedule(schedule);
                $( this ).css({
                  background: "#BCE"
                });
          })
        });


  }


Template.schedule.events({
	'click .remove.icon' : function(event){
		var schedule = Session.get('schedule');
		var div = event.target.offsetParent.offsetParent;
		var coords = JSON.parse(div.getAttribute('coords'));
		schedule[coords.z][coords.x][coords.y] = "";
		Session.set('schedule',schedule);
		updateCourseSchedule(schedule);
		//resetSchedule(schedule);
	},
	'click #showButtonProfile' : function(event){
		Session.set('show grades',true);
		Template.schedule.rendered();
	},
	'click #hideButtonProfile' : function(event){
		Session.set('show grades',false);
		Template.schedule.rendered();
	},
	'click #saveButtonProfile' : function(event){
		window.print();
	}
})


  Template.schedule.helpers({
  	remainingRequirements : function(){
  		//return remainingReqs(Session.get('currentUser').importedSched);
  		return [];
  	},
  	showingGrades : function(){
    	return Session.get('show grades');
    },
    subtractOne : function(year){
      var prevYear = Number(year) - 1;
      return prevYear + "";
    },
    yearsWithTitles: function () {
      var arr = [];
      var user = Session.get('currentUser');
      var startYear = Number(user.startYear);
      var endYear = Number(user.endYear);
      if(user.startSem == 'Fall')
        startYear++;
	  if(user.endSem == 'Fall')
	  	endYear++;

      for(var i = 0; i <= endYear - startYear; i++){
          arr[i] = startYear + i;
      }

      return arr;
    },

    scheduleCourseNameFromCoords: function (coordString) {
      var coords = JSON.parse(coordString);
      var curSched = Session.get('schedule');
      return curSched[coords.z][coords.x][coords.y];
    },

    userInfo : function () {
      return Session.get('currentUser');
    },

    scheduleHTMLArray: function () {
      //var curUserId = Session.get('currentUser');
      //Session.set('schedule', AGORAUsers.findOne({_id:curUserId}).importedSched);
      var curSched = Session.get('currentUser').schedule;
      var renderOrder = Session.get('renderOrder');
      var HTMLArray = [];
      var coords;


      for (var yr in curSched) {
        for (var col in curSched[yr]){
          for (var row in curSched[yr][col]){
            var val = curSched[yr][col][row];
            if (val != ""){
              var coords = '{ \"z\":' + yr + ', \"x\": '+col+', \"y\": '+row+'}';
              if ( !renderOrder[val] ) {
                renderOrder[val] = renderOrder["last"] + 1;
                renderOrder["last"]++;
              }
              HTMLArray.push({ courseInfo: val, coords: coords, render: renderOrder[val] });
            }
          }
        }
      }
      Session.set('renderOrder',renderOrder);

      HTMLArray.sort(function(a, b) { 
        if (a.render > b.render) 
          { return 1; } 
        if (a.render < b.render) 
          { return -1; } 
        return 0; 
      });

      return HTMLArray;
    }
  });

}