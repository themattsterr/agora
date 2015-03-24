'use strict';
var
  
  dataArr     = require( './data'),
  mongodb     = require( 'mongodb' ),
  mongoServer = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
  ),
  dbHandle    = new mongodb.Db(
    'agora', mongoServer, { safe : true }
  );

function insertCourse( course_map, callback) {
  var courseCol = dbHandle.collection('courses');

  

      var options_map = { safe: true };
      courseCol.insert(
        course_map,
        options_map,
        function ( inner_err, result_map ) {
          console.log(course_map._id);
          if (inner_err)
            callback("Error: "+inner_err);
          else
            callback( result_map );
        }
      );
};

console.log(dataArr.courses[0]);

for (var i=0; i < dataArr.courses.length; i++){

/*  insertCourse( dataArr.courses[i], function(result){
    console.log(result);
  });*/
};