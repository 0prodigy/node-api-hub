const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

//Body Parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connecting DB
const db = require('./config/key').mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


mongoose.set("useCreateIndex", true);
const port = process.env.port || 5000
app.listen(port, err => console.log(`Server is running on ${port}`));

app.get("/", (req, res) => {
    res.send("Working Fine")
})
// Password middleware
app.use(passport.initialize());

//  Passport config
require('./config/passport')(passport);


//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);