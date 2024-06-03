const express = require("express")

const app = express()
const PORT = 8080

const modelService = require("./modules/modelService")
// modelService.testFx()

app.get("/", (req, res) => {
    res.send("hello world")
})

app.get("/models", (req, res) => {
    modelService.getModels().then((models) => {
        res.json(models)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/models/test", (req, res) => {
    modelService.getModelByID(1).then((modelData) => {
        res.send(modelData)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("*", (req, res) => {
    res.send(404)
})

modelService.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})
