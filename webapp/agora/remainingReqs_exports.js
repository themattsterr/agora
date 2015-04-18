//var exports = module.exports = {};

/*
Hey Matt, 

  Entering each of the code segments into Node results in the proper functionality. 
  I'm not sure how to work it into Meteor properly; could you help with that?


Input:  
  completedCourses is an array of calendar years. 
  Each year has 3 arrays representing each semester.
  Each semester array has .length classes.
*/

/*function made to replace console.log
//the list is returned by remainingReqs which is called in meteor and the output
// is printed in the remaining courses section of student profile
exports.addToList = function (list,data){
  if(list.indexOf(data) < 0)
    list.push(data);
}*/

/*Start with the original degreeRequirements. 
TODO: Consider a function that can parse the copy/paste info from the CourseCatalog*/
exports.degReqs = function()
{
  var degreeRequirements = 
  { 
    GEP : {
      /*The total number of hours required for the 
      GEP (General Education Program) requirements.*/
      totalHours : 39,

      courses: ["ENC 1101","ENC 1102", "MAC 2311C","STA 2023"],
      choices: 
      {
        A: ["SPC 1608", "SPC 1603C", "COM 1000"],
        B: 
        [ /*Take a second from either*/
          [/*Take 1 from here*/"EUH 2000", "EUH 2001", "HUM 2210", "HUM 2230", "AMH 2010", "AMH 2020", "WOH 2012", "WOH 2022"], 
          [/*Take 1 from here*/ "ARH 2050", "ARH 2051", "MUL 2010", "MUH 2017", "MUH 2019", "MUH 3212", "MUL 2016", "MUL 2720", "THE 2000", "THE 2020", "FIL 1000", "FIL 2030", "FIL 3036", "FIL 3037", "REL 2300", "PHI 2010", "LIT 2110", "LIT 2120"], 
        ],
        C: [/*Choice C -- is not applicable since CS majors are required to take 7 hours: MAC 2311C & STA 2023
        "MAC 1105C", "MGF 1106", "MGF 1107", "CGS 1060C", "CGS 2100C", "COP 2500C", "COP 3502C", "COT 3100C", "STA 1063C", "STA 2014C", "STA 2023", "STA 3032", "MAC 1114C", "MAC 1140C", "MAC 2233", "MAC 2253", "MAC 2311", "MAC 2312", "MAC 2313" */],
        D: ["ECO 2013", "ECO 2023", "POS 2041", "PSY 2012", "SYG 2000", "ANT 2000"],
        E: ["AST 2002", "PSC 1121", "PHY 2053C", "PHY 2048C", "PHY 2049C", "PHY 2054C", "CHM 1020", "CHM 2045C", "CHM 1032", "CHS 1440", "CHM 2040", "CHM 2041", "BSC 2010C", "BSC 1005", "BSC 1050", "GLY 1030", "GEO 1200", "GEO 2370", "ANT 2511", "MCB 1310", "BSC 2010C","PHY 2048C"],

        hours: {
          A: 3,
          B: 9,
          C: 0,
          D: 6,
          E: 8
        },

        names: {
          A : "Communication Foundations",
          B : "Cultural & Historical Foundations",
          C : "Mathematical Foundations",
          D : "Social Foundations",
          E : "Science Foundations"
        }
      }
    },

    CPP: 
    {
      /*The total number of hours required for the 
      CPP (Common Program Prerequisites) requirements.*/
      totalHours: 17,

      courses: ["COP 3223", "MAC 2311C", "MAC 2312", "PHY 2048C", "PHY 2049C"],
      choices: 
      {
        A: ["BSC 2010C","BSC 2011C","CHM 2045C","CHM 2046","PHY 3101"],
        hours: {A: 6}
      }
    },

    Core: 
    {
      /*The total number of hours required for the 
      Core (Basic & Advanced) requirements.*/
      totalHours: 45,

      courses: ["STA 2023", "COP 3330", "COP 3502C","COP 3503C", "ENC 3241", "CDA 3103", "COT 3100C", "CIS 3360", 
      "COP 3402", "COT 3960", "COP 4331C", "EEL 4768", "COT 4210", "COP 4020", "COP 4600", "COP 4934", "COP 4935"],
      choices: 
      {
        A: [],
        hours: {A: 0}
      }
    },

    Restricted: 
    {
      totalHours: 15,

      courses: [],
      choices: 
      {
        A: ["Any 4000-5000 level Computer Science courses offered by Computer Science at UCF. At most 3 hours of independent study allowed; no internship or cooperative education credits are allowed. Approved IT courses offered by Computer Science may also be used toward this requirement (3 credits)."],
        B: ["MAC 2313", "MAP 2302", "MAS 3105", "MAS 3106", "Any 4000-5000 level courses with STA, MAP, MAA, MAD, or MAS prefixes, except independent study hours, internship, or cooperative education hours."],

        hours: {
          A: 9,
          B: 6
        }
      }
    },

    Other: 
    {
      courses: ["Proficiency exam in a second language, one semester of college level Foreign Language, or 3 credits of multicultural courses approved by Computer Science."],
      choices: 
      {
        A: ["Select primarily from upper level courses after meeting with a departmental advisor. Courses may be outside the department."],
        hours: {A: 0}
      }
    }
  }
  
  return degreeRequirements;
}

/* Returns a sample user schedule */
exports.sched = function()
{
  var sched = 
  [
    /*First Year*/
    [ 
      ["COP 3223", "ECO 2013", "MAC 2311C", "MAC 2312", "PHY 2053C", "ENC 1101"],
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

  /*console.log(sched);*/
  return sched;
}

exports.remainingReqs = function (sched, degreeRequirements){

  var returnList = [];

  /*  
    Post-conditions:
        degreeRequirements no longer has courses which have already been taken, according to sched.
  */
  for (var yr in sched)
  {
    
    /* Iterate through each semester of this yr*/
    for (var semest=0; semest<sched[yr].length; semest++)
    {     

      /* Iterate through each course of this semest*/
      for (var takenCourse=0; takenCourse<sched[yr][semest].length; takenCourse++)
      {        

        /*Iterate through all degreeRequirements.GEP.courses*/
          for (var j=0; j<degreeRequirements.GEP.courses.length; j++)
          {
            /* If the course satisfies a degReq.GEP, remove it from degreeRequirements.GEP*/
            if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.courses[j])
            {
              /* Splice out the satisfied requirement */
              degreeRequirements.GEP.courses.splice(j, 1);
              /* DEBUG  console.log("remainingReqs GEP: " +degreeRequirements.GEP.courses);*/
            }
          }
        /* Iterate through each degReq.GEP.choices[] */
          /* Choice A*/
            for (var k=0; k<degreeRequirements.GEP.choices.A.length; k++)
            {
              /* If the course satisfies the degReq.GEP.choices.A, empty A*/
              if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.A[k])
              {
                degreeRequirements.GEP.choices.A.splice(0, degreeRequirements.GEP.choices.A.length);
                /*DEBUG console.log("remainingReqs.GEP.choices.A: " + degreeRequirements.GEP.choices.A);*/
              }
            }
          /*Choice B*/
            /*Take one first-course from B[0]*/
            if (degreeRequirements.GEP.choices.B[0].length == 8) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.B[0]*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.B[0].length; k++)
              {
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.B[0][k])
                {
                  degreeRequirements.GEP.choices.B[0].splice(k, 1);
                }  
              }
            }
            /*Take one first-course from B[1]*/
            if (degreeRequirements.GEP.choices.B[1].length == 18) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.B[1]*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.B[1].length; k++)
              {
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.B[1][k])
                {
                  degreeRequirements.GEP.choices.B[1].splice(k, 1);
                }  
              }
            }
            /*Take one second-course from B[0] or B[1]*/
            else if (degreeRequirements.GEP.choices.B[0].length < 8 || degreeRequirements.GEP.choices.B[1].length < 18) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.B[0,1]*/
            {          
              for (var k=0; k<degreeRequirements.GEP.choices.B[0].length; k++)
              {
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.B[0][k])
                {
                  degreeRequirements.GEP.choices.B[0].splice(0, degreeRequirements.GEP.choices.B[0].length);
                }  
              }
              for (var k=0; k<degreeRequirements.GEP.choices.B[1].length; k++)
              {
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.B[1][k])
                {
                  degreeRequirements.GEP.choices.B[1].splice(0, degreeRequirements.GEP.choices.B[1].length);
                }  
              }
            }
          /*Choice C -- is not applicable since CS majors are required to take 7 hours: MAC 2311C & STA 2023*/
          /*Choice D - 2 classes required*/
            /*Take one first-course from D*/
            if (degreeRequirements.GEP.choices.D.length == 6) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.D*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.D.length; k++)
              {
                /* If the course satisfies the degReq.GEP.choices.D, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.D[k])
                {
                  degreeRequirements.GEP.choices.D.splice(k, 1);
                  /*DEBUG console.log("remainingReqs.GEP.choices.D: " + degreeRequirements.GEP.choices.D);*/
                }
              }
            }
            /*After taking a second-course, empty D*/
            else if (degreeRequirements.GEP.choices.D.length < 6) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.D*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.D.length; k++)
              {
                /* If the course satisfies the degReq.GEP.choices.D, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.D[k])
                {
                  degreeRequirements.GEP.choices.D.splice(0, degreeRequirements.GEP.choices.D.length);
                  /*DEBUG console.log("remainingReqs.GEP.choices.D: " + degreeRequirements.GEP.choices.D);*/
                }
              }
            }
          /*Choice E*/
            /*Take one first-course from E*/
            if (degreeRequirements.GEP.choices.E.length == 22) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.E*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.E.length; k++)
              {
                /* If the course satisfies the degReq.GEP.choices.E, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.E[k])
                {
                  degreeRequirements.GEP.choices.E.splice(k, 1);
                  /*DEBUG console.log("remainingReqs.GEP.choices.E: " + degreeRequirements.GEP.choices.E);*/
                }
              }
            }
            /*After taking a second-course, empty E*/
            else if (degreeRequirements.GEP.choices.E.length < 22) /*TODO: #DEFINE this magicNumber as the original number of degReqs.choices.E*/
            {
              for (var k=0; k<degreeRequirements.GEP.choices.E.length; k++)
              {
                /* If the course satisfies the degReq.GEP.choices.E, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.choices.E[k])
                {
                  degreeRequirements.GEP.choices.E.splice(0, degreeRequirements.GEP.choices.E.length);
                  /*DEBUG console.log("remainingReqs.GEP.choices.E: " + degreeRequirements.GEP.choices.E);*/
                }
              }
            }


        /*Iterate through each degreeRequirements.CPP*/
          for (var j=0; j<degreeRequirements.CPP.courses.length; j++)
          {
            /* DEBUG  console.log("in CPP, comparing " + sched[yr][semest][takenCourse] + " to " + degreeRequirements.CPP.courses[j] +" ==> " + (sched[yr][semest][takenCourse] == degreeRequirements.CPP.courses[j]));*/
            /* If the course satisfies a degReq.CPP, remove it from degreeRequirements.CPP*/
            if (sched[yr][semest][takenCourse] == degreeRequirements.CPP.courses[j])
            {
              /* Splice out the satisfied requirement */
              degreeRequirements.CPP.courses.splice(j, 1);
              /* DEBUG  console.log("remainingReqs CPP: " +degreeRequirements.CPP.courses);*/
            }
          }
        /* Iterate through all degReq.CPP.choices.A[] */
          /*Take one CPP first-choice*/
            if (degreeRequirements.CPP.choices.A.length == 5) /*TODO: #DEFINE this magicNumber as the original number of degReqs.CPP.choices.A*/
            {
              for (var k=0; k<degreeRequirements.CPP.choices.A.length; k++)
              {
                /* If the course satisfies the degReq.CPP.choices.A, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.CPP.choices.A[k])
                {
                  degreeRequirements.CPP.choices.A.splice(k, 1);
                  /*DEBUG console.log("remainingReqs.CPP.choices.A: " + degreeRequirements.CPP.choices.A);*/
                }
              }
            }
            /*After taking a second-course, empty A*/
            else if (degreeRequirements.CPP.choices.A.length < 5) /*TODO: #DEFINE this magicNumber as the original number of degReqs.CPP.choices.A*/
            {
              for (var k=0; k<degreeRequirements.CPP.choices.A.length; k++)
              {
                /* If the course satisfies the degReq.CPP.choices.A, remove it*/
                if (sched[yr][semest][takenCourse] == degreeRequirements.CPP.choices.A[k])
                {
                  degreeRequirements.CPP.choices.A.splice(0, degreeRequirements.CPP.choices.A.length);
                  /*DEBUG console.log("remainingReqs.CPP.choices.A: " + degreeRequirements.CPP.choices.A);*/
                }
              }
            }

        /*Iterate through each degreeRequirements.Core*/
        for (var j=0; j<degreeRequirements.Core.courses.length; j++)
        {
          /* If the course satisfies a degReq.Core, remove it from degreeRequirements.Core*/
          if (sched[yr][semest][takenCourse] == degreeRequirements.Core.courses[j])
          {
            /* Splice out the satisfied requirement */
            degreeRequirements.Core.courses.splice(j, 1);
            /* DEBUG  console.log("remainingReqs Core: " +degreeRequirements.Core.courses);*/
            /*addToList(returnList,degreeRequirements.Core.courses);*/
          }
        }

        /*Iterate through each degreeRequirements.Restricted*/
        for (var j=0; j<degreeRequirements.Restricted.courses.length; j++)
        {
          /* If the course satisfies a degReq.Restricted, remove it from degreeRequirements.Restricted*/
          if (sched[yr][semest][takenCourse] == degreeRequirements.Restricted.courses[j])
          {
            /* Splice out the satisfied requirement */
            degreeRequirements.Restricted.courses.splice(j, 1);
            /* DEBUG  console.log("remainingReqs Restricted: " +degreeRequirements.Restricted.courses);*/
            /*addToList(returnList,degreeRequirements.Restricted.courses);*/
          }
        }

        /*Iterate through each degreeRequirements.Other*/
        for (var j=0; j<degreeRequirements.Other.courses.length; j++)
        {
          /* If the course satisfies a degReq.Other, remove it from degreeRequirements.Other*/
          if (sched[yr][semest][takenCourse] == degreeRequirements.Other.courses[j])
          {
            /* Splice out the satisfied requirement */
            degreeRequirements.Other.courses.splice(j, 1);
            /* DEBUG  console.log("remainingReqs Other: " +degreeRequirements.Other.courses);*/
            /*addToList(returnList,degreeRequirements.Other.courses);*/
          }
        }
      }
    }
  }

  /*Push the remaining requirements to an output object*/
  var degReqs = 
  {
    gep :{
      courses: [],
      hours : 0
    },
    cpp : {
      courses: [],
      hours : 0
    },
    core : {
      courses: [],
      hours : 0
    },
    restricted : {
      courses: [],
      hours : 0
    },
    other : {
      courses: [],
      hours : 0
    }
  }

  degReqs.gep.courses.push(degreeRequirements.GEP.courses);
  degReqs.gep.courses.push(degreeRequirements.GEP.choices.A);
  degReqs.gep.courses.push(degreeRequirements.GEP.choices.B);
  degReqs.gep.courses.push(degreeRequirements.GEP.choices.C);
  degReqs.gep.courses.push(degreeRequirements.GEP.choices.D);
  degReqs.gep.courses.push(degreeRequirements.GEP.choices.E);

  degReqs.cpp.courses.push(degreeRequirements.CPP.courses);
  degReqs.cpp.courses.push(degreeRequirements.CPP.choices.A);

  degReqs.core.courses.push(degreeRequirements.Core.courses);

  degReqs.restricted.courses.push(degreeRequirements.Restricted.choices.A);  
  degReqs.restricted.courses.push(degreeRequirements.Restricted.choices.B);

  degReqs.other.courses.push(degreeRequirements.Other.courses);
  degReqs.other.courses.push(degreeRequirements.Other.choices.A);

  /*console.log(degReqs);*/

  return degReqs;
} 

/*DEBUG/ console.log(sched);
/*DEBUG/ console.log(remainingReqs(sched));
/*DEBUG/ console.log(degreeRequirements);*/