require('dotenv').config();
const { MongoClient } = require('mongodb');

// module scaffolding 
const dbObject = {}

//mongodb connection string
const connectionString = process.env.CONNECTION_STRING


const client = new MongoClient(connectionString);

async function run(){
    try{
        const database = client.db("sebaDatabase");
        dbObject.database = database;

    }finally{
        //close the server
        // await client.close();
    }
}run().catch(console.log);



module.exports = dbObject;