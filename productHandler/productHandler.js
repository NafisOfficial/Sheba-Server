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
    const filters = {}
    if(brand){
        const escapedInput =  brand.replace(/([.?*+^$[\]\\(){}|-])/g,"");
        const brands = escapedInput.split(',');
        filters.brand = {$in: brands.map((brand)=>new RegExp(brand,"i"))};
    }
    if(dose){
        const escapedInput =  dose.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const doses= escapedInput.split(',');
        filters.dose = {$in: doses.map((dose)=>new RegExp(dose,"i"))};
    }
    if(form){
        const escapedInput =  form.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const forms= escapedInput.split(',');
        filters.form = {$in: forms.map((forms)=>new RegExp(forms,"i"))};
    }
    if(generic){
        const escapedInput =  generic.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const generics= escapedInput.split(',');
        filters.generic = {$in: generics.map((generic)=>new RegExp(generic,"i"))};
    }
    if(company_name){
        const escapedInput =  company_name.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const companyNames= escapedInput.split(',');
        filters.company_name = {$in: companyNames.map((name)=>new RegExp(name,"i"))};
    };

    const allDrugs = await productCollection.find(filters).toArray();
    res.send(allDrugs);
})

products.get('/options/:name', async(req,res)=>{
    const name = req.params.name;
    const options = await productCollection.distinct(name);
    res.send(options);
})


products.get('/:id', async (req, res)=>{
    const id = req.params.id;
    const allDrugs = await productCollection.find({_id: new ObjectId(id)}).toArray();
    res.send(allDrugs);
})





module.exports = products

