module.exports = function(app, db) {

	//return JSON of all courses matched with query string
	//possible query string parameters: semester, number, professor, title
	//e.g GET /course?=semester=Fall+2016&title=Organic+Chemistry+I
	app.get("/courses", (req, res) => {
		db.collection("Courses").find(req.query).toArray((err, data) => {
			if(err) {
				res.send({"error": "Could not return courses"});
			} else {
				res.send(data)
			}
		});
	});
}