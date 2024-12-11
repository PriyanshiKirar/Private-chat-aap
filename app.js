require('dotenv').config();
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db= require("./config/db.config");
const userModel=require("./model/user.models");
const { Socket } = require('dgram');
const app = express();

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
function (accessToken, refreshToken, profile, done) {
    console.log('Google Profile:', profile);

    // Store both ID and email in the user object
    const user = {
        id: profile.id,
        email: profile.emails[0].value
    };
    return done(null, user);
}));

// Serialize the user object into the session
passport.serializeUser((user, done) => {
    done(null, user); // Store the entire user object in the session
});

// Deserialize the user object from the session
passport.deserializeUser((user, done) => {
    done(null, user); // Retrieve the user object
});

// Set view engine
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  // res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
  res.render("index")
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/chat');
  }
);



app.get('/profile', (req, res) => {
  res.send(`<h1>Profile</h1><pre>${JSON.stringify(req.user, null, 2)}</pre>`);
});


app.get("/chat",function(req,res){
  res.render("chat");
})


// apply socket io 

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', socket => {
 console.log("connet")

 socket.on("message",masaageData =>{
console.log(masaageData);
 })
});
server.listen(3000,function(){
  console.log("server is working");
});
