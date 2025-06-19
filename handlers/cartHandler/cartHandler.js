const express = require('express');
const { database } = require('../../utilites/dbProvider/dbProvider');
const { ObjectId } = require('mongodb');
const dotEnv = require('dotenv');
const SSLCommerzPayment=require("sslcommerz-lts");


dotEnv.config();


const is_live=false;


const carts = express.Router();
const cartCollection = database.collection('carts')
const orderCollection = database.collection('orders')
const tran_id=new ObjectId().toString();

carts.get('/', async (req, res) => {
    const email = req.query.email;
    const data = await cartCollection.find({ userEmail: email }).toArray();
    res.send(data);
});

carts.post('/', async (req, res) => {
    const cartObject = req.body;
    const result = await cartCollection.insertOne(cartObject);
    res.send(result);
});



//delete all carts
carts.delete('/delete/all', async (req, res) => {
    const email = req.query.email;
    const result = cartCollection.deleteMany({ userEmail: email });
    res.send(result);
});

//delete single carts
carts.delete('/delete/singleCart', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id;
    const result = cartCollection.deleteOne({ userEmail: email, _id: new ObjectId(id) });
    res.send(result);
});

carts.post('/create-payment/:email', async (req, res) => {
    const orderData = req.body;
    const { orders, shippingFee, userinfo, CashOnDelivery, currency, totalPrice } = orderData
    const paymentData = {
      
        total_amount:  150,
        currency: currency || "BDT",
        tran_id,
        success_url: `http://localhost:3000/carts/payment-success?val_id=${tran_id}`,
        fail_url: "https://sheba-clint.vercel.app/carts/checkout",
        cancel_url: "https://sheba-clint.vercel.app/carts",
        cus_name: userinfo?.name || "nafis iqbal",
        cus_email: userinfo?.email || "nafisiqbal.net2002@gmail.com" ,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: userinfo?.name || "nafis",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
        multi_card_name: "mastercard,visacard,amexcard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
        product_name:"medicine",
        product_category: "medicine",
        product_profile: "physical-goods",
        emi_option: 0,
        shipping_method: "ubar",
        num_of_item: 1,
        weight_of_items:1,
        logistic_pickup_id: "JDIVD1234",
        logistic_delivery_type: "COD",

    };

    // const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: paymentData
    // })
    
    const sslcz=new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,is_live);
    const apiReaponse=await sslcz.init(paymentData);
    console.log(apiReaponse);
    res.send(apiReaponse)
});

carts.post("/payment-success", async (req, res) => {
    const {val_id} = req.body;

  return  res.redirect("http://localhost:5173/payment-success")
})



module.exports = carts;