const modelData = require("../data/models.json")
const categoryData = require("../data/categories.json")
// let models = []
// let categories = []
const env = require('dotenv');
env.config()

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});

const Model = sequelize.define('Model', {
    modelID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    version: Sequelize.INTEGER,
    company: Sequelize.STRING,
    imageURL: Sequelize.STRING,
    website: Sequelize.STRING,
}
)

const Category = sequelize.define('Category', {
    categoryID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: Sequelize.STRING,
    imageURL: Sequelize.STRING,
});

Model.belongsTo(Category, { foreignKey: 'categoryID' });

function initialize() {
    return new Promise((resolve, reject) => {
        //     models = modelData // a whole step combining the two arrays by category ID

        //     if (models) {
        //         resolve("success")
        //     } else {
        //         reject("Error initializing models")
        //     }

        sequelize
            .sync()
            .then(() => {
                console.log('Connection has been established successfully.');
                resolve()
            })
            .catch((err) => {
                console.log('Unable to connect to the database:', err);
                reject()
            })


        // sequelize
        //     .sync()
        //     .then(async () => {
        //         try {
        //             await Category.bulkCreate(categoryData);
        //             await Model.bulkCreate(modelData);
        //             console.log("-----");
        //             console.log("data inserted successfully");
        //         } catch (err) {
        //             console.log("-----");
        //             console.log(err.message);

        //             // NOTE: If you receive the error:

        //             // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

        //             // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

        //             // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
        //         }

        //         process.exit();
        //     })
        //     .catch((err) => {
        //         console.log('Unable to connect to the database:', err);
        //     });
    })

}

function getModels() {
    return new Promise((resolve, reject) => {
        // if (models) {
        //     resolve(models)
        // } else {
        //     reject("No models available")
        // }
        Model.findAll().then((models) => {
            if (models) {
                resolve(models)

            } else { reject("No models available") }
        })
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        // if (categoryData) {
        //     categories = categoryData
        //     resolve(categories)
        // } else {
        //     reject("No categories available")
        // }
        Category.findAll().then((categories) => {
            if (categories) {
                resolve(categories)

            } else { reject("No categories available") }
        })
    })
}


function getModelByID(id) {
    return new Promise((resolve, reject) => {
        // let modelByID = models.find(model => model.id == id)
        // if (modelByID) {
        //     resolve(modelByID)
        // } else {
        //     reject("No model by that ID found")
        // }

        Model.findAll({
            where: {
                id: id
            }
        }).then((models) => {
            if (models) {
                resolve(models)

            } else { reject("No models available") }
        })
        
    })
}

function getModelByCategory(categoryID) {
    return new Promise((resolve, reject) => {
        // let modelByCategory = models.filter(model => model.category == categoryID)
        // if (modelByCategory) {
        //     resolve(modelByCategory)
        // } else {
        //     reject("No model by that Category found")
        // }

        Model.findAll({
            where: {
                CategoryID: categoryID
            }
        }).then((models) => {
            if (models) {
                resolve(models)

            } else { reject("No models available") }
        })
    })
}

function addCategory(categoryData) {
    return new Promise((resolve, reject) => {
        // if (category) {
        //     category.id = categories.length + 1
        //     categoryData.push(category)
        //     resolve()
        // } else {
        //     reject("No category to add")
        // }

        Category.create(categoryData).then((update) => {
            resolve()
        }).catch((err) => {
            reject(err)
        })

    })
}

module.exports = {
    initialize,
    getModels,
    getModelByID,
    getModelByCategory,
    getCategories,
    addCategory
}