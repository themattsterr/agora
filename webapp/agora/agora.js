

if (Meteor.isClient) {

  Template.registerHelper('withIndex', function (array) {
    return _.map(array, function (val, i) {
      return {
        'index': i,
        'value': val
      };
    });
  });

  Template.registerHelper('isSidebarOpen', function () {
    return Session.get('isSidebarOpen');
  });

  Session.setDefault('searchParam', {});
  Session.setDefault('selectedCourse',null);
  Session.setDefault('selectedCard',null);
  Session.setDefault('isSidebarOpen',false);

  Template.courseList.rendered = function(){
      $('#searchResults').css({top: '220px',width:'350px', 'min-height':'740px'});
  }

  Template.courseList.helpers({
    courseArray: function () {
      var searchParam = Session.get('searchParam');
      if (jQuery.isEmptyObject(searchParam))
        return [];
      else
        return AGORACourses.find(searchParam).fetch();
    },
    collegeList: function () {
      var distinctEntries = _.uniq(AGORACourses.find({}, {
          sort: {college: 1}, fields: {college: true}
      }).fetch().map(function(x) {
          return x.college;
      }), true);
      return distinctEntries;
    },
    deptList : function() {
      var searchParam = Session.get('searchParam');
      var distinctEntries = _.uniq(AGORACourses.find({college:searchParam.college}, {
          sort: {dept: 1}, fields: {dept: true}
      }).fetch().map(function(x) {
          return x.dept;
      }), true);
      return distinctEntries;
    }
  });

  Template.courseList.events({
    'blur .ui.dropdown': function (event) {
      var search = Session.get('searchParam');

      if ($('#collegeDropdown').dropdown('get text') != "College")
        search.college = $('#collegeDropdown').dropdown('get text');

      if ($('#deptDropdown').dropdown('get text') != "Dept")
        search.dept = $('#deptDropdown').dropdown('get text');

      Session.set('searchParam', search );

    },
    'click #resetButton' : function(){
      Session.set('searchParam',{});
      $('#collegeDropdown').dropdown('restore defaults');
      $('#deptDropdown').dropdown('restore defaults');
      $('#codeSearchBox').val('');
      $('#titleSearchBox').val('');
      $('#yearDropdown').dropdown('restore defaults');
      $('#semesterDropdown').dropdown('restore defaults');
    },
    'click #searchButton' : function(){
      var search = Session.get('searchParam');

      if ($('#codeSearchBox').val() != "")
        search.identifier = { $regex: $('#codeSearchBox').val() };

      if ($('#titleSearchBox').val() != "")
        search.title = { $regex: $('#titleSearchBox').val() };

      Session.set('searchParam',search);
    },
    'click #refreshButton' : function(event) {
      Template.schedule.rendered();
      Template.courseList.rendered();
    },
    'click #addCourseButton' : function(event){
      var schedule = Session.get('schedule');
      var course = Session.get('selectedCourse');
      var lastCard = Session.get('selectedCard');
      var col = $('#semesterDropdown').dropdown('get value');
      var yr = $('#yearDropdown').dropdown('get value');
      var row = null;

      if (col == 'Sem' || yr == 'Year')
        return false;

      for(var curRow in schedule[yr][col]) {
        if(schedule[yr][col][curRow] == "") {
          row = curRow;
          console.log(yr,col,row);
          break;
        }
      }
      
      if(row && course) {
        schedule[yr][col][row] = course.identifier;

        Session.set('schedule',schedule);
        Session.set('selectedCourse',null);
        Session.set('selectedCard',null);
        $('#'+ lastCard).css('background','rgb(255, 255, 255)');

        console.log('resetting');


      }


    },
    'click .course.card' : function(event){
      console.log(event.currentTarget);

      var lastCard = Session.get('selectedCard');
      var lastCourse = Session.get('selectedCourse');

      if (lastCourse) {
          if (this._id == lastCourse._id){
            Session.set('selectedCourse',null);
            Session.set('selectedCard',null);
            $(event.currentTarget).css('background','rgb(255, 255, 255)');
          } else {
            $('#'+ lastCard).css('background','rgb(255, 255, 255)');
            Session.set('selectedCourse',this);
            Session.set('selectedCard',event.currentTarget.id);
            $(event.currentTarget).css('background','rgb(212, 239, 249)');
          }
      } else {
        Session.set('selectedCourse',this);
        Session.set('selectedCard',event.currentTarget.id);
        $(event.currentTarget).css('background','rgb(212, 239, 249)');
      }

    }
  });

var sched = 
[// schedule[0] is the first year
  [ //schedule[0][0] is the first semester (fall) of the first year 
      ["ACG 4671","CAP 4053","CCE 4810C","CCE 4402",""],
      ["","","","",""],
      ["","","COP 1234","",""]  
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

  Session.setDefault('schedule',sched);

  Session.setDefault('renderOrder', { last: 0 });

  Template.schedule.rendered = function(){

    $('.ui.table').css('margin-top',0);
    $('.ui.table').css('margin-bottom',0);


    var cellWidth = $('.springClass1')[0].offsetLeft,
        cellHeight = $('.fallClass1')[0].offsetTop,
        yearCount = 0;

    var yearOffsets = [];

    for (var i = 0; i < $('.ui.three.column.celled.table').length; i++){
      yearCount = i;
      yearOffsets.push( {top: null, bottom: null, left: null} );
      yearOffsets[i].top = $('.table.ui.three.column.celled.table')[i].offsetTop + cellHeight;
      yearOffsets[i].bottom = yearOffsets[i].top + 5*cellHeight;
      yearOffsets[i].left = $('.table.ui.three.column.celled.table')[i].offsetLeft;
      yearOffsets[i].right = yearOffsets[i].left + 3*cellWidth;
    }

    $('.drop').css({
      top: yearOffsets[0].top,
      left: yearOffsets[0].left,
      width: 3*cellWidth,
      height: 5*cellHeight + (6*(yearCount)*cellHeight)
    })

        var cellWidth = $('.springClass1')[0].offsetLeft,
        cellHeight = $('.fallClass1')[0].offsetTop;
        yearCount = $('.ui.three.column.celled.table').length;

    for (var i = 0; i < $('.drag').length; i++){
      var coordinates = $('.drag')[i].getAttribute('coords'),
          coordsObj = JSON.parse(coordinates);
          col = coordsObj.x,
          row = coordsObj.y,
          yr = coordsObj.z,
          curDiv = $('.drag')[i];

    $(curDiv).css({
        top: row*(cellHeight) + (6*(yr)*cellHeight),
        left: col*(cellWidth),
        width: cellWidth - 2,
        height: cellHeight - 2
      });

    }
    
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
              var coordsAttr = '{ \"z\":' + yr + ', \"x\": '+col+', \"y\": '+row+'}';

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
            $( this ).css({
              background: "#BCE"
            });
      });
    });

  };

  Template.schedule.helpers({

    yearsWithTitles: function () {
      return ['2011','2012','2013','2014','2015'];
    },

    scheduleCourseNameFromCoords: function (coordString) {
      var coords = JSON.parse(coordString);
      var curSched = Session.get('schedule');
      return curSched[coords.z][coords.x][coords.y];
    },

    scheduleHTMLArray: function () {
      var curSched = Session.get('schedule');
      var renderOrder = Session.get('renderOrder');
      var HTMLArray = [];

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
    'click #importButton' : function() {
      $('#importModal').modal({
        closable:false,
        onDeny : function(){

        },
        onApprove : function(){
          var importString = $('#importInfoField').val();
          Meteor.call('parseCourseData','12345Matt',importString,10,15, function(err,result) {
            Session.set('schedule',result);
          });
        }
      }).modal('show');
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

    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.call('insertData',courses);
  });
}
