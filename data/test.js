var fs = require('fs');
var data = require('./catalogdataNEW.js');
//var courseData = fs.readFileSync('catalogdatadelimit.txt','utf8');

var courses = data.courses;
var courseObject = {};

for (var i in courses){
	var s = courses[i].prereqs.match(/[A-Z]{3} [0-9]{4}[CHL]*/g)
	courses[i].reqs = s;
	var c = courses[i].college.split('-');
	courses[i].college = c[0];
	courses[i].dept = c[1];
	courseObject[courses[i].identifier] = courses[i];
}

var list = [];
preReqTree('MAC 2312', list)
console.log(list);

function preReqTree( code, reqList ){

	for (var r in courseObject[code].reqs){
		var req = courseObject[code].reqs[r];
		reqList.push(req);
	}
}