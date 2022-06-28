const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


//! Get Requests
app.get("/", function(req, res){
    res.render("signIn");
});

app.get("/registerUser", function(req, res){
    res.render("registerUser");
});

app.get("/termsAndConditions", function(req, res){
    res.render("termsAndConditions");
});

app.get("/home", function(req, res){
    res.render("home");
});

app.get("/replyMsg", function(req, res){
    res.render("replyMsg");
});

app.get("/aboutApplication", function(req, res){
    res.render("aboutApplication");
});



//! Post Requests
app.post("/", function(req, res){
    username = req.body.userName
    userpassword = req.body.userPassword
    console.log(username + "  " + userpassword);
    res.redirect("home");
});

app.post("/replyMsg", function(req, res){
    res.redirect("/home");
});


//! Listening server
app.listen(3000, function(){
    console.log("Server is responding at port 3000");
});