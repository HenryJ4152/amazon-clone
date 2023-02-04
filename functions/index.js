const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors")
const stripe = require('stripe')('sk_test_51Lnr8dIN4ErpUMnWnc7YTxQ7fTDThK9W4kzn7MQTAhWyZRypoAKpbL4GqByLEfrclDk4XpsQKkysYdPQKfyrtYE4002pNTUOB0')

//API

//app config 
const app = express()

//middlewares
app.use(cors({ origin: true }))
app.use(express.json())

//API roots
app.get('/', (request, response) => response.status(200).send('sup bro'))

// WTF this page do????

app.post('/payments/create', async (request, response) => {
    const total = request.query.total

    console.log('Payment request received :) ', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
    })

    response.status(201).send({
        clientSecret: paymentIntent.client_secret
    })
})

//Listener
exports.api = functions.https.onRequest(app)

//example endpoint
//http://localhost:5001/challenge-e4db3/us-central1/api