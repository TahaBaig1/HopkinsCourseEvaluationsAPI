const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

MongoClient.connect(process.env.DB_URI, (err, database) => {
	if (err) return console.log(err);

	require("./routes/course_routes.js")(app, database)

	app.listen(process.env.PORT || 8000);

});


