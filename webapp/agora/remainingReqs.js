/*
Hey Matt, 

  Entering each of the code segments into Node results in the proper functionality. 
  I'm not sure how to work it into Meteor properly; could you help with that?


Input:  
  completedCourses is an array of calendar years. 
  Each year has 3 arrays representing each semester.
  Each semester array has .length classes.
*/

//function made to replace console.log
//the list is returned by remainingReqs which is called in meteor and the output
// is printed in the remaining courses section of student profile
function addToList(list,data){
  list.push(data);
}

remainingReqs = function (sched){

  var returnList = [];
  /*Start with the original degreeRequirements*/
  degreeRequirements = {
    
    GEP : {
      /*The total number of hours required for the 
      GEP (General Education Program) requirements.*/
      totalHours : 39,

      courses: ["ENC 1101","ENC 1102", "MAC 2311C","STA 2023"],
      choices: 
      {
        A: ["Any Communication Course", "SPC1603C"],
        B: ["Any Cultural & Historical Course"],
        C: [],
        D: ["Any Social Foundation Course"],
        E: ["Any Science Foundation Course", "BSC2010C","PHY2048C"],

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

      courses: ["COP3223", "MAC2311C", "MAC2312", "PHY2048C", "PHY2049C"],
      choices: 
      {
        A: ["BSC2010C","BSC2011C","CHM2045C","CHM2046","PHY3101"],
        hours: {A: 6}
      }
    },

    Core: 
    {
      /*The total number of hours required for the 
      Core (Basic & Advanced) requirements.*/
      totalHours: 45,

      courses: ["STA2023", "COP3330", "COP3502C","COP3503C", "ENC3241", "CDA3103", "COT3100C", "CIS3360", "COP3402", "COT3960", "COP4331C", "EEL4768", "COT4210", "COP4020", "COP4600", "COP4934", "COP4935"],
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
        B: ["MAC2313", "MAP2302", "MAS3105", "MAS3106", "Any 4000-5000 level courses with STA, MAP, MAA, MAD, or MAS prefixes, except independent study hours, internship, or cooperative education hours."],

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
  }/*end original degreeRequirements*/

 

  /* a sample user schedule */
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


  /*  
    Post-conditions:
        degreeRequirements no longer has courses which have already been taken, according to sched.
  */
  for (var yr in sched)
  {
    addToList(returnList,"Year: " + yr);

    /* Iterate through each semester of this yr*/
    for (var semest=0; semest<sched[yr].length; semest++)
    {     

      /* Iterate through each course of this semest*/
      for (var takenCourse=0; takenCourse<sched[yr][semest].length; takenCourse++)
      {        

        /*Iterate through each degreeRequirements.GEP*/
        for (var j=0; j<degreeRequirements.GEP.courses.length; j++)
        {
          /* If the course satisfies a degReq.GEP, remove it from degreeRequirements.GEP*/
          if (sched[yr][semest][takenCourse] == degreeRequirements.GEP.courses[j])
          {
            /* Splice out the satisfied requirement */
            degreeRequirements.GEP.courses.splice(j, 1);

            /* DEBUG */ addToList(returnList,"remainingReqs GEP: " +degreeRequirements.GEP.courses);

          }
        }

        /*Iterate through each degreeRequirements.CPP*/
        for (var j=0; j<degreeRequirements.CPP.courses.length; j++)
        {
          /* If the course satisfies a degReq.CPP, remove it from degreeRequirements.CPP*/
          if (sched[yr][semest][takenCourse] == degreeRequirements.CPP.courses[j])
          {
            /* Splice out the satisfied requirement */
            degreeRequirements.CPP.courses.splice(j, 1);
            /* DEBUG */ addToList(returnList,"remainingReqs CPP: " +degreeRequirements.CPP.courses);
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
            /* DEBUG */ addToList(returnList,"remainingReqs Core: " +degreeRequirements.Core.courses);
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
            /* DEBUG */ addToList(returnList,"remainingReqs Restricted: " +degreeRequirements.Restricted.courses);
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
            /* DEBUG */ addToList(returnList,"remainingReqs Other: " +degreeRequirements.Other.courses);
          }
        }

      }
    }
  }

  return returnList;

}  


