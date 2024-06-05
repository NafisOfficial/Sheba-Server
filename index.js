//dependencies
const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv');
const users = require('./userHandler/userHandler');
const products = require('./productHandler/productHandler');


const app = express()
dotEnv.config();
app.use(cors())
app.use(express.json());

// require from environment variable

const port = process.env.PORT || 5000;




//routing the handler
app.get("/",(req,res)=>{
    res.send("Server in running ok")
})
app.use('/users',users);
app.use('/drugs',products)



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

module.exports = app;