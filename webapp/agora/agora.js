

if (Meteor.isClient) {

  Template.registerHelper('withIndexYear', function (array, year) {
    return _.map(array, function (val, i) {
      return {
        'index': i,
        'value': val,
        'year' : year
      };
    });
  });

  Template.courseList.rendered = function(){

  }

  Session.setDefault('searchParam', {});
  Session.setDefault('selectedCourse',null);
  Session.setDefault('selectedCard',null);

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
    },
    'click #addCourseButton' : function(event){
      var grid = Session.get('scheduleGrid');
      var sched = Session.get('schedule');
      var course = Session.get('selectedCourse');
      var lastCard = Session.get('selectedCard');
      var col = $('#semesterDropdown').dropdown('get value');
      var yr = $('#yearDropdown').dropdown('get value');
      var gridRow = null;

      if (col == 'Sem' || yr == 'Year')
        return false;

      for(var row in grid[yr][col]) {
        if(grid[yr][col][row]) {
          gridRow = row;
          console.log(yr,col,row);
          break;
        }
      }
      
      if(gridRow && course) {
        if (col == 0)
          sched[yr].fall[gridRow] = course.identifier;
        if (col == 1)
          sched[yr].spring[gridRow] = course.identifier;
        if (col == 2)
          sched[yr].summer[gridRow] = course.identifier;

        grid[yr][col][gridRow] = 0;
        Session.set('scheduleGrid',grid);
        Session.set('schedule',sched);
        Session.set('selectedCourse',null);
        Session.set('selectedCard',null);
        $('#'+ lastCard).css('background','rgb(255, 255, 255)');

        console.log('resetting');
        Template.schedule.rendered();

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

/*  var schedule = [
  {
    year : 0,
    fall : ["ACG 4671","CAP 4053","CCE 4810C","CCE 4402"],
    spring : ["CAP 5610","CAP 5510","CAP 5100"],
    summer : ["CAP 5015","CAP 4104","CAP 4453","CAP 4720"]
  },
  {
    year : 1,
    fall : ["ACG 4671","CAP 4053","CCE 4810C","CCE 4402"],
    spring : ["CAP 5610","CAP 5510","CAP 5100"],
    summer : ["CAP 5015","CAP 4104","CAP 4453","CAP 4720"]
  },
  {
    year : 2,
    fall : ["ACG 4671","CAP 4053","CCE 4810C","CCE 4402"],
    spring : ["CAP 5610","CAP 5510","CAP 5100"],
    summer : ["CAP 5015","CAP 4104","CAP 4453","CAP 4720"]
  },
  {
    year : 3,
    fall : ["ACG 4671","CAP 4053","CCE 4810C","CCE 4402"],
    spring : ["CAP 5610","CAP 5510","CAP 5100"],
    summer : ["CAP 5015","CAP 4104","CAP 4453","CAP 4720"]
  }];*/

    var schedule = [
  {
    year : 0,
    fall : [],
    spring : [],
    summer : []
  },
  {
    year : 1,
    fall : [],
    spring : [],
    summer : []
  },
  {
    year : 2,
    fall : [],
    spring : [],
    summer : []
  },
  {
    year : 3,
    fall : [],
    spring : [],
    summer : []
  }];

  var scheduleGrid = [
              [   [1,1,1,1,1],
                  [1,1,1,1,1],
                  [1,1,1,1,1]  ],

              [   [1,1,1,1,1],
                  [1,1,1,1,1],
                  [1,1,1,1,1]  ],

              [   [1,1,1,1,1],
                  [1,1,1,1,1],
                  [1,1,1,1,1]  ],

              [   [1,1,1,1,1],
                  [1,1,1,1,1],
                  [1,1,1,1,1]  ]
    ];

  Session.setDefault('schedule',schedule);
  Session.setDefault('scheduleGrid',scheduleGrid);



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
      var col = $('.drag')[i].getAttribute('col'),
          row = $('.drag')[i].getAttribute('row'),
          yr = $('.drag')[i].getAttribute('yr'),
          curDiv = $('.drag')[i];

      scheduleGrid[yr][col][row] = 0;

    $(curDiv).css({
        top: row*(cellHeight) + (6*(yr)*cellHeight),
        left: col*(cellWidth),
        width: cellWidth - 2,
        height: cellHeight - 2
      });

    }
    Session.set('scheduleGrid',scheduleGrid);
    
jQuery(function($){
       var grid = Session.get('scheduleGrid');
       var originalGridX, originalGridY, originalYear;
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
            grid = Session.get('scheduleGrid');
            var coords = gridCoords($(this)[0].offsetLeft,$(this)[0].offsetTop);

            originalGridX = coords.x;
            originalGridY = coords.y;
            originalYear = coords.z;
            grid[originalYear][originalGridX][originalGridY] = 1;

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

            if(coords.z >= 0 && coords.z < yearCount && grid[coords.z][coords.x][coords.y] == 1) {
              grid[coords.z][coords.x][coords.y] = 0;
              $(this)[0].setAttribute('col',coords.x);
              $(this)[0].setAttribute('row',coords.y);
              $(this)[0].setAttribute('yr',coords.z);

            } else {
              $( this ).css('visibility','visible')
              $( this ).animate({
                  top: dd.originalY,
                  left: dd.originalX
               }, 420 );
              grid[originalYear][originalGridX][originalGridY] = 0;
            }

            Session.set('scheduleGrid',grid);
            $( this ).css({
              background: "#BCE"
            });
      });
    });

  };

  Template.schedule.helpers({

    schedule: function () {
      return Session.get('schedule');
    }
  });

  Template.schedule.events({
    'click #openSidebar': function () {

      //$('.ui.sidebar').sidebar('toggle');
      //Meteor.call('insertData', courses);
      var initialElement = $('.center-pane');
      var openedElement = $('.center-pane-out');

      if (!initialElement.length) {
        openedElement[0].className = 'center-pane';
        $('.left-pane-out')[0].className = 'left-pane'
      }

      if(!openedElement.length) {
        initialElement[0].className = 'center-pane-out';
        $('.left-pane')[0].className = 'left-pane-out';
      }

    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
