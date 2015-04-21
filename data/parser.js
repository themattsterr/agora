var dataFileParser = require('data-file-parser');

/*dataFileParser.parse({
	in: 'data.txt',
	out: 'data.js',
	var: 'courses',
	regex: /(([A-Z]{3})\s(\d{4}[C|H]*))\s([A-Z]{3,4})-([A-Z]{2,4})\s((\d)\((\d)\,(\d)\))\s(.*?):\s((?:PR:|CR:) .*?)\. (.*\. )(Fall|Spring|Summer|Occasional|Odd Spring|, )*\./gm,
	as: '_id|type|number|college|dept|cedits|contact hrs|class hrs|lab hrs|title|prereqs|description'
}).then(function(arr){
	console.log(arr.length+" courses");
});

dataFileParser.parse({
	in: 'data.txt',
	out: 'sem.js',
	var: 'courses',
	regex: /([A-Z]{3}\s\d{4}[C|H]*).*PR: .*\. (\w*)(?:, )*(\w*)(?:, )*(\w*)(?:, )*\./gm,
	as: 'course|semester1|semester2|semester3'
}).then(function(arr){
	console.log(arr.length+" courses");
});*/

dataFileParser.parse({
	in: 'catalogdatadelimit.txt',
	out: 'catalogdataNEW.js',
	var: 'courses',
	regex: /(.*?) # (.*?) # (.*?) # (.*?) # (.*?)# (.*?) #/gm,
	as: 'identifier|college|cedits|title|prereqs|semesters'
}).then(function(arr){
	console.log(arr.length+" courses");
});


/*dataFileParser.parse({
	in: 'catalogdata.txt',
	out: 'catalogdata.js',
	var: 'courses',
	regex: /(([A-Z]{3})\s(\d{4}[C|H|L]*))\s([A-Z]{2,4})-([A-Z|&]{2,5})\s((\d+)\((\d+)\,(\d+)\))\W(.*):\s((?:PR:|CR:) .*?|\w\.\w\.*)\. (.*\. )+(Fall|Spring|Summer|Occasional|Odd Spring|Even Spring|,)*\./gm,
	as: 'identifier|type|number|college|dept|cedits|contact hrs|class hrs|lab hrs|title|prereqs|description'
}).then(function(arr){
	console.log(arr.length+" courses");
});

dataFileParser.parse({
	in: 'catalogdata.txt',
	out: 'catalogsem.js',
	var: 'coursesSemesters',
	regex: /([A-Z]{3}\s\d{4}[C|H|L]*).*PR: .*\. (?:Graded S\/U\. )*(\w*)(?:, *)*(\w*)(?:, *)*(\w*)(?:, *)*\./gm,
	as: 'course|semester1|semester2|semester3'
}).then(function(arr){
	console.log(arr.length+" semester courses");
});*/