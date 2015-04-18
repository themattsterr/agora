


var sampleSched = 
  [
    /*First Year*/
    [ 
      ["COP 3223", "ECO 2013",/* "MAC 2311C",*/ "MAC 2312", "PHY 2053C"/*, "ENC 1101"*/],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""] 
    ],

    /*Second Year*/
    [   
        ["BSC 2010C", "COP 3330", "COP 3502C", "COT 3100C", "", ""],
        ["PHY 2048C", "ENC 1102", "STA 2023", "REL 2300", "", ""],
        ["", "", "", "", "", ""] 
    ],

    /*Third Year*/
    [   
        ["CIS 3360", "COP 3402", "MAS 3105", "PHY 3101", "", ""],
        ["COP 3503C", "PHI 2010", "PHY 2049C", "PSY 2012", "SPC 1608", "WOH 2022"],
        ["CDA 3103", "MAC 2313", "", "", "", ""]
    ],

    /*Fourth Year*/
    [   
        ["COP 4710", "COP 4934", "ENC 3241", "", "", ""],
        ["CAP 4053", "COP 4020", "COP 4600", "EEL 4768", "", ""],
        ["COP 4331C", "COT 4210", "", "", "", ""]  
    ],

    /*Fifth Year*/
    [   
        ["", "", "", "", "", ""],
        ["CEN 5016", "COP 4935", "SPN 1120C", "", "", ""],
        ["", "", "", "", "", ""]  
    ]
  ];

//returns object of lists of classes complete the semesters before 'course'
// and another list of classes taken at the same time
// var ret = {
//    previous : [],
//    current : []
// }

function previousClassesCompleted( sched, course){
    var courseList = scheduleToCourseObjectList(sched);
    var returnValue = {
        previous : [],
        current : []
    };

    var curSemester = -1;
    var courseFound = false;
    var curSemesterList = [];
    for (var i in courseList){
        var curCourse = courseList[i];
        if (curCourse.semester != curSemester && curSemesterList.length > 0) {//next semester is found start push current list and start new
            if (!courseFound)
                Array.prototype.push.apply(returnValue.previous,curSemesterList);
            else {
                Array.prototype.push.apply(returnValue.current,curSemesterList);
                return returnValue;
            }
            curSemesterList = [curCourse.course];
        } else //push onto current semester list
            curSemesterList.push(curCourse.course);

        if(curCourse.course == course){ //found continue until next semester
            courseFound = true;
        }
        curSemester = curCourse.semester;
    }
    return returnValue;
}


// coordinates are the coordinates of the position in sched chosen
// coordinates = {z:0, x:0, y:0}
function previousClassesCompletedByCoords( sched, coords){
    var courseList = scheduleToCourseObjectList(sched);
    var returnValue = {
        previous : [],
        current : []
    };

    var curSemester = -1;
    var spotFound = false;
    var curSemesterList = [];
    for (var i in courseList){
        var curCourse = courseList[i];
        if (curCourse.semester != curSemester && curSemesterList.length > 0) {//next semester is found start push current list and start new
            if (!spotFound)
                Array.prototype.push.apply(returnValue.previous,curSemesterList);
            else {
                Array.prototype.push.apply(returnValue.current,curSemesterList);
                return returnValue;
            }
            curSemesterList = [curCourse.course];
        } else //push onto current semester list
            curSemesterList.push(curCourse.course);

        if(courseList[i].year == coords.z && courseList[i].semester == semesterDisplayToChronological(coords.x) ){ //found continue until next semester
            spotFound = true;
        }
        curSemester = curCourse.semester;
    }
    return returnValue;
}


// converts the display order of a semester [ Fall 10, Spring 11, Summer 11] to
// the chronological order for sorting
function semesterDisplayToChronological( sem ){
    switch( Number(sem) ) {
        case 0:
            return 2;
            break;
        case 1:
            return 0;
            break;
        case 2:
            return 1;
            break;
        default:
            return -1;
            break;
    }
} 

// returns a list of course objects from the schedule object passed in
/* courseObject = {
    year : 0,           the year the course was taken
    semester : 0,       the semester the course was taken: 0=Spring, 1=Summer, 2=Fall
    course : 'COP3223'  the course code of the course
}*/
function scheduleToCourseObjectList( sched ){

    var courseList = [];
    for (var yr in sched){
        for(var sem in sched[yr]){
            for(var i in sched[yr][sem]){
                    var courseObject = {
                        year : yr,
                        semester : semesterDisplayToChronological(sem),
                        course : sched[yr][sem][i]
                    }
                if(courseObject.course != '') courseList.push(courseObject);
            }
        }
    }
    courseList.sort(function(a,b){
        if ( a.year < b.year) return -1;
        if ( a.year > b.year) return 1;
        if ( a.year == b.year){
            if(a.semester < b.semester) return -1;
            if(a.semester > b.semester) return 1;
            if(a.semester == b.semester) return 0;
        }
    })
    return courseList;
}


// prereqs = list of classes required before
// coreqs = list of classes required before or in the same semester
// completedClass = object returned by previousClassesCompleted()

// returns null if all requirements met
// returns object of requirements needed if not all met
/* returns reqsLeft = {
    before : [],        classes that must be taken before
    during : []         classes that must be taken before or the same time
}*/
function allRequirementsFullfilled( prereqs, coreqs, completedClasses) {
    // set return object to all requirements and remove them as they are found
    var reqsLeft = {
        before : prereqs,
        during : coreqs
    };
    // loop through all courses previously taken
    for (var i in completedClasses.previous){
        if( reqsLeft.before.indexOf( completedClasses.previous[i])  >= 0 ) {//found remove from reqsLeft
            reqsLeft.before.splice( reqsLeft.before.indexOf( completedClasses.previous[i]), 1 );
        }
    }
    // loop through all taking now
    for (var i in completedClasses.current){
        if( reqsLeft.during.indexOf( completedClasses.current[i])  >= 0 ){
            reqsLeft.during.splice(reqsLeft.before.indexOf( completedClasses.current[i]), 1 );
            break;
        }
        else if( reqsLeft.before.indexOf( completedClasses.current[i])  >= 0 )
            reqsLeft.before.splice(reqsLeft.before.indexOf( completedClasses.current[i]), 1 );
    }
    if(reqsLeft.before.length > 0 || reqsLeft.during.length > 0)
        return reqsLeft;
    else
        return null;

}

//sample prereqs and coreqs for Operating Systems COP 4600
//COP 4600 - COP 3503C, COP 3402, COT 3960
//  COP 3402 - CDA 3103, COP 3502C
//      CDA 3103 - PR: COP 3223, CR: COT 3100C
//          COT 3100C - MAC 1105C, MAC 1104C
//  COT 3960 - COP 3502C, COT 3100C
//  COP 3503C - COP 3502C, COP 3330
//      COP 3502C - COP 3223, MAC 1105C
//  COP 3330 - COP 3223
//      COP 3223 - none

var osPreReqs = ['COT 3960','COP 3223','COP 3330','COP 3502C','COP 3503C','COT 3100C','CDA 3103','COP 3402'];
var osCoReqs = [];
var osCompletedCourses = previousClassesCompleted(sampleSched, "COP 4600");

var fallThirteen = previousClassesCompletedByCoords(sampleSched, {z: 2, x: 0, y:0} )
var fallTwelve = previousClassesCompletedByCoords(sampleSched, {z: 1, x: 0, y:0} )
console.log(osCompletedCourses, fallThirteen, fallTwelve)


console.log(osPreReqs);

console.log(
    allRequirementsFullfilled( osPreReqs, osCoReqs, osCompletedCourses)
);

osPreReqs = ['COT 3960','COP 3223','COP 3330','COP 3502C','COP 3503C','COT 3100C','CDA 3103','COP 3402'];
console.log(
    allRequirementsFullfilled( osPreReqs, osCoReqs, fallThirteen)
);
osPreReqs = ['COT 3960','COP 3223','COP 3330','COP 3502C','COP 3503C','COT 3100C','CDA 3103','COP 3402'];
console.log(
    allRequirementsFullfilled( osPreReqs, osCoReqs, fallTwelve)
);





