const express = require("express")

const app = express()
const PORT = 8080
const path = require("path")
const modelService = require("./modules/modelService")
const userService = require("./modules/userService")

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));

const clientSessions = require('client-sessions');

app.use(
    clientSessions({
      cookieName: 'session', // this is the object name that will be added to 'req'
      secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
      duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
      activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    })
  );

app.use(express.static(__dirname + '/public'));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
  }

app.get("/",(req, res) => {
    // res.sendFile(path.join(__dirname, "/views/index.html"))
    modelService.getModels().then((models) => {
        res.render("index", {
            models: models
        })
    })

    
})

app.get("/about", (req, res) => {
    // res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render("about")
})

app.get("/models", ensureLogin, (req, res) => {
    // conditional rendering of req.query.id
    // /models?id=1
    if (req.query.category) {
        modelService.getModelByCategory(req.query.category).then((modelsByCategory) => {
            res.render("index", {
                models: modelsByCategory
            })
        }).catch((err) => {
            console.log(err)
        })
    } else {
        modelService.getModels().then((models) => {
            res.json(models)
        }).catch((err) => {
            console.log(err)
        })
    }

})

app.get("/categories", (req, res) => {
    modelService.getCategories().then((categories) => {
        res.render("categories", {
            categories: categories
        })
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/categories/new", (req, res) => {
    res.render("addCategories")
})

app.post("/categories/new", (req, res) => {
    // res.render("addCategories")
    // res.send(req.body)

    modelService.addCategory(req.body).then(() => {
        res.redirect("/categories")
    }).catch((err) => {
        console.log(err)
    })
})


// app.get( FIRST ARGUMENT: PATH/NAME OF THE ROUTE, OPTIONAL: MIDDLEWARE, OPTIONAL: MIDDLEWARE, OPTIONAL: MIDDLEWARE, ,SECOND ARGUMENT: CALLBACK (req, res) => {
    // res.send etc etc 
//})


// variable route with req.params.id 
app.get("/models/:id",(req, res) => {
    modelService.getModelByID(req.params.id).then((modelData) => {
        res.send(modelData)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/test", (req, res) => {
    let header = req.get("accept-language")
    res.send(header)
})

app.get("/test/:id", (req, res) => {
    res.send(`<h1>your id: ${req.params.id}</h1>`)
})

// app.get("/models/test", (req, res) => {
//     res.send("test")
// })

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    req.body.userAgent = req.get("User-Agent")
    userService.loginUser(req.body).then((user) => {
        // create the session
        // redirect to the home page

        req.session.user = {
            username: user.username,
            email: user.email,
            loginHistory: user.loginHistory
        }

        res.redirect("/")
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/register", (req, res) => {
    res.render("register", {
        errorMsg: "",
        successMsg: ""
    })
})

app.post("/register", (req, res) => {

    console.log(req.body)
    userService.registerUser(req.body).then(() => {
        res.render("register", {
            successMsg: "User successfully registered.",
            errorMsg: ""
        })
    }).catch((err) => {
        res.render("register", {
            errorMsg: err,
            successMsg: ""
        })
    })
})

app.get("/logout", (req, res) => {
    req.session.reset()
    res.redirect("/")
})


app.get("*", (req, res) => {
    res.send("<h1>404 THIS ROUTE DOES NOT EXIST</h1>")
})


modelService.initialize()
.then(userService.initialize)
.then((success) => {
    app.listen(PORT, () => {
        console.log(success)
        // console.log(`listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})
