//dependencies
const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv');


const app = express()
dotEnv.config();
app.use(cors())
app.use(express.json());

// require from environment variable

const port = 5000;






app.get("/user",()=>{

})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})