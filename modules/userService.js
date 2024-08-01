const mongoose = require('mongoose');
const env = require('dotenv')
env.config();

const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
})

let User; // to be defined on new connection (see initialize) 

function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.MONGODB_URI)

        db.on('error', (err) => {
            console.log(err)
            reject(err)
        })

        db.once('open', () => {
            User = db.model("users", userSchema)
            resolve("MongoDB connection successful.")
        })
    })
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        // add the new user to the database 
        // data.save()

        if (userData.password != userData.password2) {
            reject("User not created - passwords do not match.")
        }

        // Encrypt the plain text: "myPassword123"
        bcrypt
            .hash(userData.password, 10)
            .then((hash) => {
                userData.password = hash
                // Hash the password using a Salt that was generated using 10 rounds
                // TODO: Store the resulting "hash" value in the DB

                let newUser = new User(userData)
                newUser.save().then(() => {
                    resolve("User successfully created.")
                }).catch((err) => {
                    if (err.code === 11000) {
                        console.log(err)
                        reject("User not created - username is already taken.")
                    } else {
                        reject(`User not created - there was an error: ${err}.`)
                    }
                })
            })
            .catch((err) => {
                console.log(err); // Show any errors that occurred during the process
                reject("User not created - encryption error.")

            });

    })
}

function loginUser(userData) {
    return new Promise((resolve, reject) => {
        // go find the existing user in the database
        // Users.findOne()

        User.findOne({username: userData.username})
        .exec()
        .then((user) => {
            bcrypt.compare(userData.password, user.password).then((result) => {
                if (result) {
                    // add loginHistory
                    // let loginHistoryObject = {dataTime: new Date(), userAgent: userData.userAgent}
                    // user.loginHistory.push(loginHistoryObject)
                    // User.updateOne(...)
                    resolve(user)
                } else {
                    reject("Login failed - credentials are incorrect.")
                }
            }).catch((err) => {
                console.log(err)
                reject("Login failed - encryption error.")
            })
        }).catch((err) => {
            console.log(err)
            reject("Login failed - user not found.")
        })
    })
}

module.exports = {
    initialize,
    registerUser,
    loginUser
}