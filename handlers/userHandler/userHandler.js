const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider');
const asyncHandler = require('../../utilites/asyncHandler/asyncHandler');
const sendResponse = require('../../utilites/customResponse/customResponse')



const users = express.Router();
//get the collection
const UsersCollection = database.collection('users')


users.get('/:email', asyncHandler(async (req, res) => {
    const email = req.params.email;
    const user = await UsersCollection.findOne({ email: email });
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        return next(err);
    }
    sendResponse(res, 200, true, "Successfully fetch user data", user);
}))

users.post('/', asyncHandler(async (req, res) => {
    const userOjbect = req.body;
    isUserExists = await UsersCollection.findOne({ email: userOjbect?.email })
    if (isUserExists) {
        res.send("Login successful")
    } else {
        const result = await UsersCollection.insertOne(userOjbect);
        sendResponse(res, 200, true, "Successfully created a new user", result);
    }
}))

users.patch('/update/:email', asyncHandler(async (req, res, next) => {
    const userOjbect = req.body;
    const email = req.params.email;

    const updatedUser = await UsersCollection.updateOne({ email: email }, { $set: userOjbect });

    if (updatedUser.matchedCount === 0) {
        const error = new Error("User not found");
        error.statusCode = 404
        return next(error);
    }

    sendResponse(res, 200, true, "Updated user data", updatedUser);
}))


module.exports = users;