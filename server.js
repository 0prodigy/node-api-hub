const express = require("express");
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

//Connecting DB
const db = require('./config/key').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));



mongoose.connect("mongodb://localhost:27017/traversy", { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
const port = process.env.port || 3000
app.listen(port, err => console.log(`Server is running on ${port}`));

app.get("/", (req, res) => {
    res.send("Working Fine")
})

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);