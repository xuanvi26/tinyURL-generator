const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const URLDatabase = {
    userRandomID: {
        Ex4mp3: "www.google.com"
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

const redirectLogin = (res) => {
    if (!res.cookie["user_id"]) res.redirect('/login');
}

// DEFAULT
app.get("/", (req, res) => {
    res.redirect('/login')
})

//LOGIN
app.get("/login", (req, res) => {
    res.sendStatus(200);
})

// REGISTER
app.get("/register", (req, res) => {
    redirectLogin(res);
})

// VIEW ALL URLS
app.get("/viewURLs", (req, res) => {
    redirectLogin(res);
})

// LOGOUT
app.post("logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/login");
})

app.listen(PORT, () => {
    console.log(`TinyURL Generator listening on port ${PORT}!`);
});
  