const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

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
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
    },
};

const messageSchema = {
    name: String,
    time: String,
    date: String,
    message: {
        type: String,
        minlength: 2,
        maxlength: 230,
    }
}

const personDetail = mongoose.model("personDetail", personSchema);
const personMessage = mongoose.model("personMessage", messageSchema);

//* DataBase creation Ended here.

//! Variables and Functions Here
var currentUser; 
var userSignInDate; 
var signInError = ''; 

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
function dateInHome(today){
    const options = {
        day: "numeric",
        month: "short",
    };
    return today.toLocaleDateString("en-GB", options);
}
// var homePermanentDisplayContent = "Hello! " + currentUser + ". Welcome to my Online Web Chatting Application, for using this Web App you need to follow some rules. So, plz checkOut About application tag in Header before proceeding. Scroll Down for viewing latest messages. "

//! Get Requests
app.get("/", function (req, res) {
    userSignInDate = dateInHome(new Date);
    res.render("signIn", {
        UserErrorMsg: signInError,
    }) ;
});

app.get("/registerUser", function (req, res) {
    userSignInDate = dateInHome(new Date);
    res.render("registerUser");
});

app.get("/termsAndConditions", function (req, res) {
    res.render("termsAndConditions");
});

app.get("/home", function (req, res) {
    personMessage.find({}, function(err, found){
        // console.log(found);
        res.render("home", {
            permaTodaysDate: userSignInDate,
            signedUserName: currentUser,
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
            res.send(err);
        }
        else if(found){
            currentUser = signUserName;
            res.redirect('/home');
        }
        else {
            // res.send('UserName or password is incorect');
            signInError = 'Username or Password is incorrect';
            res.redirect('/');
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
});

app.post("/replyMsg", function (req, res) {
    const signUserMessage = req.body.signUserMessage;
    const msgOfPerson = new personMessage({
        name: currentUser,
        message: signUserMessage,
        time: formatAMPM(new Date),
        date: dateInHome(new Date),
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