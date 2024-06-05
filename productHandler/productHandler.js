const express = require('express');
const {database}  = require('../dbProvider/dbProvider');
const { ObjectId } = require('mongodb');



const products = express.Router()
const productCollection = database.collection("Drugs");



products.get('/all-drugs', async (req, res)=>{
    const allDrugs = await productCollection.find().toArray();
    res.send(allDrugs);
})
products.get('/most-ordered', async (req, res)=>{
    const query = {generic : "Paracetamol"}
    const allDrugs = await productCollection.find(query).limit(8).toArray();
    res.send(allDrugs);
})


products.get('/category', async (req, res)=>{
    const {brand,dose,form,generic,company_name} = req.query;
    const query = {}

    if(brand) query.brand = brand;
    if(dose) query.dose = dose;
    if(form) query.form = form;
    if(generic) query.generic = new RegExp(`${generic}`,'i');
    if(company_name) query.company_name = new RegExp(`${company_name}`,'i');

    const allDrugs = await productCollection.find(query).toArray();
    res.send(allDrugs);
})


products.get('/:id', async (req, res)=>{
    const id = req.params.id;
    const allDrugs = await productCollection.find({_id: new ObjectId(id)}).toArray();
    res.send(allDrugs);
})







module.exports = products

