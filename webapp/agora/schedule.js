// agora schedule template




if (Meteor.isClient) {

    //used in drag and drop events for live updating
  	var updateCourseSchedule = function(scheduleData){
		var user = Session.get('currentUser');
		user.importedSched = scheduleData;
		Session.set('currentUser',user);
		Meteor.call('importCourseSchedule',user._id, scheduleData);
  	}

  var resetSchedule = function(scheduleData){
      
     var cellWidth = $('#dragArea')[0].offsetWidth / 3 - 10,
        //cellHeight = Number.parseInt($('.ui.three.column.celled.table')[0].offsetHeight / 6),
        cellHeight = 37,
        currentUser = Session.get('currentUser'),
        yearCount = currentUser.endYear - currentUser.startYear + 1;

        $('.drop').css({
          top: $('.table.ui.three.column.celled.table')[0].offsetTop + cellHeight,
          left: $('.table.ui.three.column.celled.table')[0].offsetLeft,
          //top:14 + cellHeight,
          //left:14,
          width: 3*cellWidth,
          height: 5*cellHeight + (6*(yearCount)*cellHeight)
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
        //
        //
        //

        var HTMLString = '<div class="drag"';
        HTMLString += ' coords=' + HTMLArray[i].coords + ' >' + HTMLArray[i].courseInfo + '</div>';
        $('#dragAreaGrid')[0].innerHTML += HTMLString;
      }


      for (var i = 0; i < $('.drag').length; i++){
        var coordinates = $('.drag')[i].getAttribute('coords'),
            coordsObj = JSON.parse(coordinates);
            col = coordsObj.x,
            row = coordsObj.y,
            yr = coordsObj.z,
            curDiv = $('.drag')[i];

      if(col > 0) yr--;

      $(curDiv).css({
          top: row*(cellHeight) + (6*(yr)*cellHeight),
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


         //if (!currentUser) {
          //Session.set('isSetupFinished',false);
          //$('#dragArea')[0].className = "ui disable segment"
          //$('#setupModal').modal({
            //  onDeny : function(){

              //},
              //onApprove : function(){
                //  Session.set('currentView','account settings');   
              //}
            //}).modal('show');

      //} else {
        //  Session.set('isSetupFinished',true);
          //$('#dragArea')[0].className = "ui segment"
    
     //}
      
      if(!currentUser || !currentUser.importedSched){
        $('#dragAreaGrid')[0].innerHTML = "";
        return;
      }
          Session.set('schedule', currentUser.importedSched);
          resetSchedule(Session.get('schedule'));
     
           var cellWidth = $('#dragArea')[0].offsetWidth / 3 - 10,
              //cellHeight = Number.parseInt($('.ui.three.column.celled.table')[0].offsetHeight / 6),
              cellHeight = 37,
              yearCount = currentUser.endYear - currentUser.startYear + 1;

      
        jQuery(function($){
           var schedule = Session.get('schedule');
           var originalGridX, originalGridY, originalYear, originalValue;
           var $div = $('#dragAreaGrid');
           var z = 1;
           var gridCoords = function(x,y){
              var gridX, gridY, gridZ;

              gridX = Math.round( x / cellWidth);
              gridY = Math.round( y / cellHeight);
              gridZ = Math.floor(gridY / 6);

              gridY = gridY - 6*gridZ;
              if (gridY == 5)
                gridZ = -1;
              if (gridX > 0)
                gridZ++;
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

                if(coords.z >= 0 && coords.z < yearCount && schedule[coords.z][coords.x][coords.y] == "") {
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
          });
        });


  }


  Template.schedule.helpers({
    subtractOne : function(year){
      var prevYear = Number(year) - 1;
      return prevYear + "";
    },
    yearsWithTitles: function () {
      var arr = [];
      var user = Session.get('currentUser');
      if(!user)
        return [1];
      var startYear = 2000;
      if(user.startSem == 'Fall')
        startYear = user.startYear++;

      for(var i = 0; i <= user.endYear - startYear; i++){
          arr[i] = Number(user.startYear) + i;
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

  Template.schedule.events({

  });

}