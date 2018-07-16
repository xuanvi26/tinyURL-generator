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
        Ex4mp3: "www.google.com"
    },
    userRandomID2: {
        sup233: "www.lighthouse.com"
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

//LOGIN --> COMPLETE
app.get("/login", (req, res) => {
    const templateVars = {
        sentence: "Before using TinyURL, please sign-in. If you do not have an account, ",
        redirect: "register",
        page: "login"
    }
    res.render("welcome", templateVars);
})

// POSTING TO LOGIN --> COMPLETE
app.post("/login", (req, res) => {
    let authorizedUser = {};
    let resParams = { status: 403, redirect: '/login'};
    for (let userId in users) {
        if (users[userId].email === req.body.email) {
            if (users[userId].password === req.body.password) {
                authorizedUser = users[userId];
                resParams.status = 200;
                resParams.redirect = "/viewURLs";
            }
            break;
        }
    }
    res.cookie("user_id", authorizedUser.id).status(resParams.status).redirect(resParams.redirect); 
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
    // res.redirect("/" + newUserId + "/urls");
    res.redirect("/viewURLs");
})

// NEW URL --> COMPLETE
app.get("/:user/new", (req, res) => {
    redirectLogin(req, res);
    res.render("newURL", {user_id: req.cookies["user_id"]});
})

// POST TO MAKE NEW URL
app.post("/:user/new", (req, res) => {
    URLDatabase[req.params.user][generateRandomString()] = longURL;
    console.log(URLDatabase);
    res.redirect(`/${req.params.user}/urls`);
})

// USER URLs
app.get("/:user/urls", (req, res) => {
    redirectLogin();
    let userURLs = URLDatabase[req.params.id];
    res.render("userURLs", {urls: userURLs, user_id: req.cookies})
})

// POSTING TO EDIT/DELETE URL

// VIEW ALL URLS --> COMPLETE
app.get("/viewURLs", (req, res) => {
    let allURLs = {};
    for (let user in URLDatabase) {
        for (let url in URLDatabase[user]) {
            allURLs[url] = URLDatabase[user][url];
        }
    }
    res.render("viewURLs", {urls: allURLs, user_id: req.cookies["user_id"]});
})

// LOGOUT --> COMPLETE
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/login");
})

app.listen(PORT, () => {
    console.log(`TinyURL Generator listening on port ${PORT}!`);
});
  