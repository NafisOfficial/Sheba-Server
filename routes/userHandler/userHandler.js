const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider')



const users = express.Router();
//get the collection
const UsersCollection = database.collection('users')


users.get('/:email', async (req, res) => {
    const email = req.params.email;
    const user = await UsersCollection.findOne({email: email});
    res.send(user);
})

users.post('/', async (req, res) => {
    const userOjbect = req.body;
    isUserExists = await UsersCollection.findOne({ email: userOjbect?.email })
    if (isUserExists) {
        res.send("Login successful")
    } else {
        const result = await UsersCollection.insertOne(userOjbect);
        res.send(result);
    }

})

users.patch('/update/:email', async (req, res) => {
    const userOjbect = req.body;
    const email = req.params.email;
    const updatedUser = await UsersCollection.updateOne({email: email},{$set: userOjbect});
    res.send(updatedUser);
})


module.exports = users;