/*------------------------------------------
    Developer Info:
    Name: Md Nafis Iqbal
    email: nafisiqbal.net2002@gmail.com
    whatsapp: +8801709912722
-------------------------------------------*/

//dependencies
const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv');
const users = require('./handlers/userHandler/userHandler');
const products = require('./handlers/productHandler/productHandler');
const carts = require('./handlers/cartHandler/cartHandler');
const errorHandler = require('./middlewares/errorHandler/errorHandler');
const sendResponse = require('./utilites/customResponse/customResponse')


const app = express()
dotEnv.config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// require from environment variable

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development"



//routing the handler
app.get("/",(req,res)=>{
    sendResponse(res,200,true,"Server is running");
})

app.use('/users',users);
app.use('/drugs',products);
app.use('/carts',carts);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server is running on port ${port} and ${environment} mode`);
})




module.exports = app;