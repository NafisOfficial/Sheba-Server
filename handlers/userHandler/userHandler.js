const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider')



const users = express.Router();
//get the collection
const UsersCollection = database.collection('users')


users.get('/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await UsersCollection.findOne({ email: email });
        if(!user){
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }
        res.send(user);
    } catch (error) {
        const err = new Error("Internal server error");
        err.statusCode = 500;
        err.error = error;
        next(err);
    }
})

users.post('/', async (req, res) => {
    const userOjbect = req.body;
    try {
        isUserExists = await UsersCollection.findOne({ email: userOjbect?.email })
        if (isUserExists) {
            res.send("Login successful")
        } else {
            const result = await UsersCollection.insertOne(userOjbect);
            res.send(result);
        }

    } catch (error) {
        const err = new Error("Internal server error");
        err.statusCode = 500;
        err.error = error;
        next(err);
    }
})

users.patch('/update/:email', async (req, res, next) => {
    const userOjbect = req.body;
    const email = req.params.email;
    try {
        const updatedUser = await UsersCollection.updateOne({ email: email }, { $set: userOjbect });

        if (updatedUser.matchedCount === 0) {
            const error = new Error("User not found");
            error.statusCode = 404
            return next(error);
        }

        res.send(updatedUser);
    } catch (error) {
        next(error);
    }
})


module.exports = users;