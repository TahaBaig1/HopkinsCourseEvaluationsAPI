module.exports = function(app, db) {

	//return JSON of all courses matched with query string
	//possible query string parameters: semester, number, professor, title, summary, rating
	//e.g GET /course?=semester=Fall+2016&title=Organic+Chemistry+I
	app.get("/courses", (req, res) => {
		var courseQuery = req.query;
		convertToCourseQuery(courseQuery);
		db.collection("Courses").find(courseQuery).toArray((err, data) => {
			if(err) {
				res.send({"error": "Could not return courses"});
			} else {
				res.send(data);
			}
		});
	});

	//takes query string object from GET requests and converts it to courseQuery object that can query database
	function convertToCourseQuery(courseQuery) {

		if (courseQuery.hasOwnProperty("professor")) {
			//checking to see if professor specified is full name or first initial/remaining name
			var names = courseQuery.professor.split(" ");
			if (names.length >= 1 && names[0].endsWith(".")) {
				//construct regex to find matches of first initial and remaining name
				var firstInitial = names.shift().charAt(0);
				var remainingName = names.join(" ");
				var regexString = firstInitial + ".+ " + remainingName; 
				var re = new RegExp(regexString);
				courseQuery.professor = re;
			} 
		}

		if (courseQuery.hasOwnProperty("number")) {
			//construct regex for course numbers

		}

	}


}