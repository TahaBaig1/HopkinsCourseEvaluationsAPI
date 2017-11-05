const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const db = require("./config/db")

const app = express();
const port = 8000;

MongoClient.connect(db.URI, (err, database) => {
	if(err) return console.log(err);

	require("./routes/course_routes.js")(app, database)

	app.listen(port, () => {
		console.log("Succesful connecton!")
	});

});


