const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider');
const asyncHandler = require('../../utilites/asyncHandler/asyncHandler');
const sendResponse = require('../../utilites/customResponse/customResponse');
const admin = require("../../utilites/firebase-admin/admin");
const jwt = require('jsonwebtoken');
require("dotenv").config();


const users = express.Router();
//get the collection
const UsersCollection = database.collection('users')

users.get("/all",asyncHandler(async (req,res)=>{
    const allUsers = await UsersCollection.find().toArray();
   sendResponse(res, 200, true, "Successfully fetch all user data", allUsers); 
}))

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


users.post('/login',async (req,res)=>{
    const {email} = req.body;
    
    try {
        const isUserExists = await UsersCollection.findOne({email})
        
        if(!isUserExists){
            sendResponse(res, 404, false, "Invalid email or password")
        }else{
            const {name,email, role} = isUserExists;
            const payload = {name, email, role}
            if(role === "admin"){
                const token = jwt.sign(payload,process.env.JWT_ADMIN_SECRET,{expiresIn: "1h"})
                sendResponse(res,200, true, "login successful",{token})
            }else{
                const token = jwt.sign(payload,process.env.JWT_USER_SECRET,{expiresIn: "1h"});
                sendResponse(res,200, true, "login successful",{token})
            }
            
        }

    } catch (error) {
        console.log(error);
    }
})

users.post('/signup', asyncHandler(async (req, res) => {
    const {name,email,photoURL} = req.body;
    
    isUserExists = await UsersCollection.findOne({email});
    if (isUserExists) {
        sendResponse(res, 400, false, "Email already used to create user",);
    } else {
        const role = "user";
        const userObject = {name,email,photoURL,role};
        const payload = {name,email,role}
        const token = jwt.sign(payload,process.env.JWT_USER_SECRET,{expiresIn: "1h"});
        const result = await UsersCollection.insertOne(userObject);
        sendResponse(res, 200, true, "Successfully created a new user", {token});
    }
}))

users.patch('/update/:email', asyncHandler(async (req, res, next) => {
    const userOjbect = req.body;
    const email = req.params.email;
    delete userOjbect._id;
    const updatedUser = await UsersCollection.updateOne({ email: email }, { $set: userOjbect });
    if (updatedUser.matchedCount === 0) {
        const error = new Error("User not found");
        error.statusCode = 404
        return next(error);
    }

    sendResponse(res, 200, true, "Updated user data", updatedUser);
}))

users.delete('/delete/:email', asyncHandler(async (req, res, next) => {
    const email = req.params.email;
    const user = await admin.auth().getUserByEmail(email);
    const deletedUser = await UsersCollection.deleteOne({ email: email });
    if (deletedUser.deletedCount === 0) {
        const error = new Error("User not found");
        error.statusCode = 404
        return next(error);
    }
    await admin.auth().deleteUser(user.uid);
    sendResponse(res, 200, true, "Deleted user data", result);
}))



module.exports = users;