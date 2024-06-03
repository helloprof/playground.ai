const modelData = require("../data/models.json")
const categoryData = require("../data/categories.json")
let models = []

function initialize() {
    return new Promise((resolve, reject) => {
        models = modelData // a whole step combining the two arrays by category ID

        if (models) {
            resolve("success")
        } else {
            reject("Error initializing models")
        }
    })
}

function getModels() {
    return new Promise((resolve, reject) => {
        if (models) {
            resolve(models)
        } else {
            reject("No models available")
        }
    })
}

function getModelByID(id) {
    return new Promise((resolve, reject) => {
        let modelByID = models.find(model => model.id == id)
        if (modelByID) {
            resolve(modelByID)
        } else {
            reject("No model by that ID found")
        }
    })
}

module.exports = {
    initialize,
    getModels,
    getModelByID
}