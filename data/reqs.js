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
								["Any", "Communication", "Course"], 
								["SPC1603C"]
							]
			],
		
		B : [
				choices = 	[
								["Any", "Cultural", "& Historical", "Course"]
							]
			],
		
		C : ["MAC 2311C","STA 2023"],

		D : [
				choices = 	[
								["Any", "Social Foundation", "Course"]
							]
			],

		E : [
				choices =	[
								["Any", "Science", "Foundation Course"], 
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