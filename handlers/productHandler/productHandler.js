const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../../utilites/asyncHandler/asyncHandler');
const sendResponse = require('../../utilites/customResponse/customResponse');
const multer = require('multer');
const dotEnv = require("dotenv")


dotEnv.config();
const upload = multer();
const products = express.Router()
const productCollection = database.collection("Drugs");



products.get('/all-drugs', asyncHandler(async (req, res) => {
    const allDrugs = await productCollection.find({}, { projection: { id: 1, image: 1, brand: 1, dose: 1, form: 1, company_name: 1, generic: 1, price_per_unit: 1 } }).toArray();
    sendResponse(res, 200, true, "All drugs fetched successfully", allDrugs);
}))


products.post('/all-drugs', upload.single("image"), async (req, res, next) => {

    try {
        const file = req.file;
        const others = req.body;

        if (!file || !file.buffer) {
            return res.status(400).json({ message: "No image file provided." });
        }

        const base64Image = file.buffer.toString("base64");
        const formBody = new URLSearchParams();
        formBody.append("image", base64Image);

        const imageResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMAGE_BB_SECRET}`, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const json = await imageResponse.json();

        if (!json.success === true) {
            const error = new Error();
            error.statusCode = 301;
            error.message = "Failed to upload image"
            next(error);
        }
        const url = json.data.url;
        others.image = url;
        const addedProduct = await productCollection.insertOne(others);

        sendResponse(res, 200, true, "Image upload successfully", addedProduct);

    } catch (error) {
        console.log(error);
        sendResponse(res, 103, false, "Empty Upload resource", error);
    }

})

products.delete('/all-drugs', asyncHandler(async (req, res) => {
    const id = req.params._id;
    const deletedProduct = await productCollection.deletedOne({ _id: ObjectId(id) });
    sendResponse(res, 200, true, `Id: ${id} drug deleted successfully `, deletedProduct);
}))


products.get("/limited-drugs", asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const allDrugs = await productCollection.find({}).skip(skip).limit(limit).toArray();
    const totalDrug = await productCollection.countDocuments();
    const drugData = { allDrugs, totalDrug }
    sendResponse(res, 200, true, "All drugs fetched successfully", drugData)
}))



// filter and search medicine api
products.get('/category', asyncHandler(async (req, res) => {
    const { brand, dose, form, generic, company_name } = req.query;
    const filters = {}
    if (brand) {
        const escapedInput = brand.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const brands = escapedInput.split(',');
        filters.brand = { $in: brands.map((brand) => new RegExp(brand, "i")) };
    }
    if (dose) {
        const escapedInput = dose.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const doses = escapedInput.split(',');
        filters.dose = { $in: doses.map((dose) => new RegExp(dose, "i")) };
    }
    if (form) {
        const escapedInput = form.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const forms = escapedInput.split(',');
        filters.form = { $in: forms.map((forms) => new RegExp(forms, "i")) };
    }
    if (generic) {
        const escapedInput = generic.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const generics = escapedInput.split(',');
        filters.generic = { $in: generics.map((generic) => new RegExp(generic, "i")) };
    }
    if (company_name) {
        const escapedInput = company_name.replace(/([.?*+^$[\]\\(){}|-])/g, "");
        const companyNames = escapedInput.split(',');
        filters.company_name = { $in: companyNames.map((name) => new RegExp(name, "i")) };
    };


    let filteredData = [];
    if (Object.keys(filters).length !== 0) {
        filteredData = await productCollection.find(filters).toArray();
    }

    if (filteredData.length === 0) {
        return sendResponse(res, 200, true, "No data found", filteredData);
    }
    sendResponse(res, 200, true, "Data fetch successfully", filteredData);
}))

// get distinct option name in each field
products.get('/options', asyncHandler(async (req, res) => {
    const { opt1, opt2, opt3 } = req.query;
    const allOptions = {}
    if (opt1) {
        const Options1 = await productCollection.distinct(opt1);
        allOptions.genericOptions = Options1;
    }

    if (opt2) {
        const Options2 = await productCollection.distinct(opt2);
        allOptions.doseOptions = Options2;
    }

    if (opt3) {
        const Options3 = await productCollection.distinct(opt3);
        allOptions.formOptions = Options3;
    }


    if (allOptions.genericOptions.length === 0 && allOptions.doseOptions.length === 0 && allOptions.formOptions.length === 0) {
        return sendResponse(res, 200, true, "No option available", allOptions);
    }
    sendResponse(res, 200, true, "Data fetch successfully", allOptions);
}))


products.get('/single-drug/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const singleDrug = await productCollection.findOne({ _id: new ObjectId(id) });
    sendResponse(res, 200, true, "Data fetch successfully", singleDrug);
}))





module.exports = products