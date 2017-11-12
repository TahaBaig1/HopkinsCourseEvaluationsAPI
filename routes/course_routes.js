module.exports = function(app, db) {

	//return JSON data of all courses matched with query string
	//possible query string parameters: semester, number, professor, title (for exact matches), titleAny (non-exact), summary, rating
	//e.g GET /course?=semester=Fall+2016&title=Organic+Chemistry+I
	app.get("/courses", (req, res) => {
		if (Object.keys(req.query).length == 0) res.send([]); //if user supplies no parameters, return no matches

		else {
			var courseQuery = req.query;
			convertToCourseQuery(courseQuery);

			db.collection("Courses").find(courseQuery, { "_id": false }).toArray((err, data) => {
				if (err) {
					res.send([{"error": "Could not return courses"}]);
				} else {
					data.sort(compareCoursesBySemester)
					res.send(data);
				}
			});
		}
	});

	//takes query string object converts it to courseQuery object that can query database
	function convertToCourseQuery(courseQuery) {

		if (courseQuery.hasOwnProperty("titleAny")) {
			//create regex for finding non-exact course title matches
			var regexString = ".*" + escapeRegExp(courseQuery.titleAny) + ".*";
			var re = new RegExp(regexString, "i");
			delete courseQuery.titleAny;
			//if user has included both titleAny and title parameters, titleAny takes precedence (overwrites title)
			courseQuery.title = re; 
		}

		if (courseQuery.hasOwnProperty("professor")) {
			//checking to see if professor specified is full name or first initial/remaining name
			var names = courseQuery.professor.split(" ");
			if (names.length >= 1 && names[0].length == 2 && names[0].endsWith(".")) {
				//construct regex to find matches of first initial and remaining name
				var firstInitial = names.shift().charAt(0);
				var remainingName = escapeRegExp(names.join(" "));
				var regexString = firstInitial + ".* " + remainingName; 
				var re = new RegExp(regexString);
				courseQuery.professor = re;
			} else if (names.length == 1) {
				//regex to search for any matches
				var regexString = ".*" + escapeRegExp(names[0]) + ".*";
				var re = new RegExp(regexString, "i");
				courseQuery.professor = re;
			}
		}

		if (courseQuery.hasOwnProperty("number")) {
			//construct regex for course numbers
			var number = courseQuery.number;
			if (number.length >= 10) { 
				//relevant course number is first 10 characters (excludes section numbers)
				var regexString = escapeRegExp(number.substring(0,10)) + ".*";
				var re = new RegExp(regexString);
				courseQuery.number = re;
			} else { 
				//if non-exact course numbers are supplied (length less than 10), 
				//create regex to find any matches using supplied number
				var regexString = ".*" + escapeRegExp(number) + ".*";
				var re = new RegExp(regexString);
				courseQuery.number = re;
			}
		}

		//convert rating string to float
		if (courseQuery.hasOwnProperty("rating")) {
			courseQuery.rating = parseFloat(courseQuery.rating);
		}

	}

	//escape special regex characters from text
	function escapeRegExp(text) {
 		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}

	//comparison function to sort courses in order by most recent semester first
	function compareCoursesBySemester(c1, c2) {
		if (!c1.hasOwnProperty("semester") || !c2.hasOwnProperty("semester")) return 0;

		if (c1.semester === c2.semester) return 0;

		semester1 = c1.semester.split(" ");
		semester2 = c2.semester.split(" ");

		if (semester1.length != 2 || semester2.length != 2) return 0;

		//comparing year
		if (semester1[1] > semester2[1]) 	  return -1;
		else if (semester1[1] < semester2[1]) return 1;
		else {
			//if years are equal, compare season
			if (semester1[0] === "Fall") return -1;
			else 						 return 1;
		}

	}

}