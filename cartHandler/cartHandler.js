const express = require('express');
const {database}  = require('../dbProvider/dbProvider');
const { ObjectId } = require('mongodb');


const carts = express.Router();
const cartCollection = database.collection('carts')

carts.get('/',async (req,res)=>{
    const email = req.query.email;
    const data = await cartCollection.find({userEmail: email}).toArray();
    res.send(data);
});

carts.post('/',async (req,res)=>{
    const cartObject = req.body;
    const result = await cartCollection.insertOne(cartObject);
    res.send(result);
});



//delete all carts
carts.delete('/delete/all', async (req,res)=>{
    const email = req.query.email;
    const result = cartCollection.deleteMany({userEmail: email});
    res.send(result);
});

//delete single carts
carts.delete('/delete/singleCart', async (req,res)=>{
    const email = req.query.email;
    const id = req.query.id;
    const result = cartCollection.deleteOne({userEmail: email,_id: new ObjectId(id)});
    res.send(result);
});


module.exports = carts;