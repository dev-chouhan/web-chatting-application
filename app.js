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

app.use(bodyParser.json());

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

const messageSchema = {
    name: String,
    time: String,
    message: {
        type: String,
        // minlength: 6,
        // maxlength: 20,
    }
}

const personDetail = mongoose.model("personDetail", personSchema);
const personMessage = mongoose.model("personMessage", messageSchema);

// DataBase creation Ended here.

var currentUser;
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
var homePermanentDisplayContent = "Hello! " + currentUser + ". Welcome to my Online Web Chatting Application, for using this WebApp you need to follow some rules. So, plz checkOut About application tag in Header before procceding. Scroll Down for viewing latest messages. "

//! Get Requests
app.get("/", function (req, res) {
    res.render("signIn");
});

app.get("/registerUser", function (req, res) {
    res.render("registerUser");
});

app.get("/termsAndConditions", function (req, res) {
    res.render("termsAndConditions");
});

app.get("/home", function (req, res) {
    // console.log(currentUser);
    personMessage.find({}, function(err, found){
        // console.log(found);
        res.render("home", {
            parmanentPost: homePermanentDisplayContent,
            userSignInTime: formatAMPM(new Date),
            posts: found,
        });
    });
    
});

app.get("/replyMsg", function (req, res) {
    res.render("replyMsg", {
        SignedUserName: currentUser,
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
            currentUser = signUserName;
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
    // console.log(regUserName + "  " + regUserEmail + "  " + regUserPassword);
    const regPerson = new personDetail({
        name: regUserName,
        email: regUserEmail,
        password: regUserPassword
    });
    currentUser = regUserName;
    regPerson.save();
    res.redirect("/home");
})

app.post("/replyMsg", function (req, res) {
    const signUserMessage = req.body.signUserMessage;
    const msgTime = new Date();
    const msgOfPerson = new personMessage({
        name: currentUser,
        message: signUserMessage,
        time: formatAMPM(new Date),
    });
    msgOfPerson.save();
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