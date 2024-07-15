const express = require("express")

const app = express()
const PORT = 8080
const path = require("path")
const modelService = require("./modules/modelService")
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));

// modelService.testFx()

// let checkModelID = (req, res, next) => {
//     if (req.params.id) {
//         if (isNaN(req.params.id)) {
//             res.status(400).send("ID must be a number")
//             return
//         }
//     }
//     next()
// }

app.use(express.static(__dirname + '/public'));

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

app.get("/models", (req, res) => {
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


app.get("*", (req, res) => {
    res.send("<h1>404 THIS ROUTE DOES NOT EXIST</h1>")
})

modelService.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})
