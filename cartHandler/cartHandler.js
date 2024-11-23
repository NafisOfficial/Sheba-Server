const express = require('express');
const { database } = require('../dbProvider/dbProvider');
const { ObjectId } = require('mongodb');


const carts = express.Router();
const cartCollection = database.collection('carts')
const orderCollection = database.collection('orders')

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
        store_id: "sheba67409f214c7e7",
        store_passwd: "sheba67409f214c7e7@ssl",
        total_amount: totalPrice + 150,
        currency: currency,
        tran_id: "REF123",
        success_url: "http://localhost:3000/carts/payment-success",
        fail_url: "https://sheba-clint.vercel.app/carts/checkout",
        cancel_url: "https://sheba-clint.vercel.app/carts",
        cus_name: userinfo?.name || "nafis iqbal",
        cus_email: userinfo?.email ,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: userinfo?.name,
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

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: paymentData
    })
    res.send(response)
});

carts.post("/payment-success", async (req, res) => {
    const successData = req.body;
    console.log(successData);
    console.log("working");
})



module.exports = carts;