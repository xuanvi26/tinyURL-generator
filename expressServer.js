const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const URLDatabase = {
    userRandomID1: {
        "www.google.com": "Ex4mp3"
    },
    userRandomID2: {
        "www.lighthouse.com": "sup233"
    }
};
const users = {
    userRandomID: {
        id: "userRandomID", 
        email: "user@example.com", 
        password: "purple-monkey-dinosaur"
      }
};

const generateRandomString = () => {
    let uniqueSURL = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        uniqueSURL += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return uniqueSURL;
}

const redirectLogin = (req, res) => {
    if (!req.cookies["user_id"]) res.redirect('/login');
}

// DEFAULT --> COMPLETE
app.get("/", (req, res) => {
    res.redirect('/login')
})

//LOGIN
app.get("/login", (req, res) => {
    const templateVars = {
        sentence: "Before using TinyURL, please sign-in. If you do not have an account, ",
        redirect: "register",
        page: "login"
    }
    res.render("welcome", templateVars);
})

// REGISTER --> COMPLETE
app.get("/register", (req, res) => {
    const templateVars = {
        sentence: "If you do not have an account, please register. If you are already registered, ",
        redirect: "login",
        page: "register"
    }
    res.render("welcome", templateVars);
})

// POSTING TO REGISTER
app.post("/register", (req, res) => {
    let newUserId = generateRandomString();
    users[newUserId] = {
        id: newUserId,
        email: req.body.email,
        password: req.body.password
    }
    res.cookie("user_id", newUserId);
    console.log(users);
    res.redirect("/viewURLs");
})

// NEW URL GENERATION 
app.get("/:u/new", (req, res) => {

})

// USER URLs
app.get("/:user/urls", (req, res) => {

})

// VIEW ALL URLS --> COMPLETE
app.get("/viewURLs", (req, res) => {
    let allURLs = {}
    for (let user in URLDatabase) {
        for (let url in URLDatabase[user]) {
            allURLs[url] = URLDatabase[user][url];
        }
    }
    res.render("viewURLs", {urls: allURLs, user_id: req.cookie});
})

// LOGOUT --> COMPLETE
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/login");
})

app.listen(PORT, () => {
    console.log(`TinyURL Generator listening on port ${PORT}!`);
});
  