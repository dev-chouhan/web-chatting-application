const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//! DataBase creation
mongoose.connect("mongodb://localhost:27017/chatApp");

const personSchema = {
    name: {
        type: String,
        required: [true, "UserName is not there!"],
        // minlength: 3,
        // maxlength: 20
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        // minlength: 6,
        // maxlength: 20,
    },
};

const personDetail = mongoose.model("personDetail", personSchema);

// DataBase creation Ended here.

const totalList = [];
const personList = [];

//! Get Requests
app.get("/", function (req, res) {
    res.render("signIn");
    // personDetail.find({}, function(err, founddetail){

    // })
});

app.get("/registerUser", function (req, res) {
    res.render("registerUser");
});

app.get("/termsAndConditions", function (req, res) {
    res.render("termsAndConditions");
});

app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/replyMsg", function (req, res) {
    // personDetail.findOne({name: signUserName}, function(err, found){
        
    // })
    res.render("replyMsg", {
        
    });
});

app.get("/aboutApplication", function (req, res) {
    res.render("aboutApplication");
});



//! Post Requests
app.post("/", (req, res) => {
    var signUserName = req.body.signUserName;
    var signUserPassword = req.body.signUserPassword;

    personDetail.findOne({name: signUserName, password: signUserPassword}, function(err, found){
        if(err) {
            console.log(err);
            res.redirect("/");
        }
        else if(found){
            res.redirect('/home');
        }
        else {
            console.log('UserName or password is incorect');
            res.redirect("/");
        }
    });
});

app.post("/registerUser", function (req, res) {
    var regUserName = req.body.regUserName;
    var regUserEmail = req.body.regUserEmail;
    var regUserPassword = req.body.regUserPassword;
    console.log(regUserName + "  " + regUserEmail + "  " + regUserPassword);
    const regPerson = new personDetail({
        name: regUserName,
        email: regUserEmail,
        password: regUserPassword
    });
    regPerson.save();
    res.redirect("/home");
})

app.post("/replyMsg", function (req, res) {
    res.redirect("/home");
});

app.get('*', function(req,res){
    res.send('Bad Route!');
});

//! Listening server

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started Successfully");
});