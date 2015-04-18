requirements = {
	
	GEP : {
		/*The total number of hours required for the 
		GEP (General Education Program) requirements.*/
		totalHours : 39,

		/*The courses required for each Foundation of the GEP. 
		In cases where the student can choose between a selection of courses, the last element in the Foundation's object will be an array of size <= 2, listing the course choices:
			choices[0] will be an array of all courses that satisfy this req.
			choices[1] will be an array of preferred courses, if applicable.*/
		A : ["ENC 1101","ENC 1102", 
				choices = 	[
								["Any Communication Course"], 
								["SPC1603C"]
							]
			],
		
		B : [
				choices = 	[
								["Any Cultural & Historical Course"]
							]
			],
		
		C : ["MAC 2311C","STA 2023"],

		D : [
				choices = 	[
								["Any Social Foundation Course"]
							]
			],

		E : [
				choices =	[
								["Any Science Foundation Course"], 
								["BSC2010C","PHY2048C"]
							]
			],

		hours: {
			A: 9,
			B: 9,
			C: 7,
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
	},

	CPP: {
		totalHours: 17,

		A: ["COP3223", "MAC2311C", "MAC2312", "PHY2048C", "PHY2049C"],
		
		B: [
				choices = 	[
								["BSC2010C","BSC2011C","CHM2045C","CHM2046","PHY3101"]
							]
			],

		hours: {
			A: 11,
			B: 6
		}
	},

	Core: {
		totalHours: 45,

		basic: ["STA2023", "COP3330", "COP3502C","COP3503C", "ENC3241", "CDA3103", "COT3100C", "CIS3360", "COP3402", "COT3960"],

		advanced: ["COP4331C", "EEL4768", "COT4210", "COP4020", "COP4600", "COP4934", "COP4935"],

		hours: {
			basic: 24,
			advanced: 21
		}
	},

	Restricted: {
		totalHours: 15,

		A: [
				choices = 	[
								["Any 4000-5000 level Computer Science courses offered by Computer Science at UCF. At most 3 hours of independent study allowed; no internship or cooperative education credits are allowed. Approved IT courses offered by Computer Science may also be used toward this requirement (3 credits)."]
							]
			],

		B: [
				choices = 	[
								["MAC2313", "MAP2302", "MAS3105", "MAS3106", "Any 4000-5000 level courses with STA, MAP, MAA, MAD, or MAS prefixes, except independent study hours, internship, or cooperative education hours."]
							]
			],

		hours: {
			A: 9,
			B: 6
		}

	},

	ForeignLang: {
		A: ["Proficiency exam in a second language, one semester of college level Foreign Language, or 3 credits of multicultural courses approved by Computer Science."]
	},

	Electives: {
		totalHours: 4,

		A: ["Select primarily from upper level courses after meeting with a departmental advisor. Courses may be outside the department."]
	}
}


// its a litte weird because the order shown on the website is actually Fall 2011, Spring 2012, Summer 2012
		var sched = 
		[
		  [ 
		      ["COP 3223", "ECO 2013", "MAC 2311C", "MAC 2312", "PHY 2053C", "ENC 1101"], 
		      ["", "", "", "", "", ""], 
		      ["", "", "", "", "", ""]  
		  ],
		  [   
		      ["BSC 2010C", "COP 3330", "COP 3502C", "COT 3100C", "", ""], 
		      ["PHY 2048C", "ENC 1102", "STA 2023", "REL 2300", "", ""], 
		      ["", "", "", "", "", ""]  
		  ],
		  [   
		      ["CIS 3360", "COP 3402", "MAS 3105", "PHY 3101", "", ""], 
		      ["COP 3503C", "PHI 2010", "PHY 2049C", "PSY 2012", "SPC 1608", "WOH 2022"],
		      ["CDA 3103", "MAC 2313", "", "", "", ""]
		  ],
		  [   
		      ["COP 4710", "COP 4934", "ENC 3241", "", "", ""],
		      ["CAP 4053", "COP 4020", "COP 4600", "EEL 4768", "", ""],
		      ["COP 4331C", "COT 4210", "", "", "", ""]  
		  ],
		  [   
		      ["", "", "", "", "", ""],
		      ["CEN 5016", "COP 4935", "SPN 1120C", "", "", ""],
		      ["", "", "", "", "", ""]  
		  ]
		];

