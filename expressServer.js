const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    name: "session",
    keys: [process.env.SECRET_KEY]
}));
app.set("view engine", "ejs");
app.use(express.static('public'))
const URLDatabase = {
};

const users = {
};

const allURL = (URLDatabase) => {
    let allURLs = {};
    for (let user in URLDatabase) {
        for (let url in URLDatabase[user]) {
            allURLs[url] = URLDatabase[user][url];
        }
    };
    return allURLs;
}

const generateRandomString = () => {
    let uniqueSURL = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        uniqueSURL += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return uniqueSURL;
};

const redirectLogin = (req, res) => {
    if (!req.session.user_id) res.redirect('/login');
};

app.get("/", (req, res) => {
    res.redirect('/login')
});

app.get("/login", (req, res) => {
    const templateVars = {
        sentence: "Before using TinyURL, please sign-in. If you do not have an account, ",
        redirect: "register",
        page: "login"
    }
    res.render("welcome", templateVars);
});

app.post("/login", (req, res) => {
    let authorizedUser = {};
    let resParams = { status: 403, redirect: '/login'};
    for (let userId in users) {
        if (users[userId].email === req.body.email) {
            if (bcrypt.compareSync(req.body.password, users[userId].hashedPassword)) {
                authorizedUser = users[userId];
                resParams.status = 200;
                resParams.redirect = `/${userId}/urls`;
            }
            break;
        }
    }
    req.session.user_id = authorizedUser.id;
    res.status(resParams.status).redirect(resParams.redirect); 
});

app.get("/register", (req, res) => {
    const templateVars = {
        sentence: "If you do not have an account, please register. If you are already registered, ",
        redirect: "login",
        page: "register"
    }
    res.render("welcome", templateVars);
});

app.post("/register", (req, res) => {
    for (let userId in users) {
        if (users[userId].email === req.body.email) {
            res.status(403).redirect("/register");
        }
    }
    let newUserId = generateRandomString();
    users[newUserId] = {
        id: newUserId,
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(req.body.password, 10)
    }
    URLDatabase[newUserId] = {};
    req.session.user_id = newUserId;
    res.redirect(`/${newUserId}/new`);
});

app.get("/:user/new", (req, res) => {
    redirectLogin(req, res);
    res.render("newURL", {user_id: req.session.user_id});
});

app.post("/:user/new", (req, res) => {
    URLDatabase[req.params.user][generateRandomString()] = req.body.longURL;
    res.redirect(`/${req.params.user}/urls`);
});

app.get("/:user/urls", (req, res) => {
    redirectLogin(req, res);
    let userURLs = URLDatabase[req.params.user];
    res.render("userURLs", {urls: userURLs, user_id: req.session.user_id})
});

app.post("/:user/urls/:shortURL/delete", (req, res) => {
    delete URLDatabase[req.params.user][req.params.shortURL];
    res.redirect(`/${req.params.user}/urls`);
});

app.get("/viewURLs", (req, res) => {
    let allURLs = allURL(URLDatabase);
    for (let user in URLDatabase) {
        for (let url in URLDatabase[user]) {
            allURLs[url] = URLDatabase[user][url];
        }
    };
    res.render("viewURLs", {urls: allURLs, user_id: req.session.user_id});
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("/short/:shortURL", (req, res) => {
    let allURLs = allURL(URLDatabase);
    for (let shortURL in allURLs) {
        if (shortURL === req.params.shortURL) {
            res.redirect(allURLs[shortURL]);
            break;
        }
    }
});

app.listen(PORT, () => {
    console.log(`TinyURL Generator listening on port ${PORT}!`);
});
  