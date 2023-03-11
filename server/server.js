require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5500",
  })
)

const stripe = require("stripe")(process.env.STRIPE_P_KEY)

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000)
// require('dotenv').config()

// const express= require('express')
// const app= express()
// const cors = require('cors')
// app.use(express.json())
// app.use(cors({
//     origin: 'http://localhost:5500',
// })
// )

// const stripe = require('stripe')(process.env.STRIPE_P_KEY)


// const storeItems = new Map([
//     [1, { priceInCents: 500,  name: '50 Coins'}],
//     [2, { priceInCents: 1000, name: '100 Coins'}],
//     [3, { priceInCents: 2500, name: '250 Coins'}],
//     [4, { priceInCents: 10000, name: '1000 Coins'}],
// ])
// app.post("/create-checkout-session", async (req, res) => {
    
//     const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     mode: 'payment',
//     success_url: `${process.env.SERVER_URL}/success.html`,
//     cancel_url:`${process.env.SERVER_URL}/cancel.html`,
//     line_items: req.body.items.map(item => {
//         const storeItem = storeItems.get(item.id)
//         return {
//             price_data: {
//                 currency: 'eur',
//                 product_data: {
//                    name: storeItem.name
//                 },
//                 unit_amount: storeItem.priceInCents
//             },
//             quantity: item.quantity
//         }
//     }),
// })
// console.log (session)
// })
// app.post('/create-checkout-session', async (req, res)  => {
//     try{
         
//         res.status(200).json ({ url: session.url})
//     }catch (e) {
//        res.status(500).json({ error: e.message})
//     }
// })

// app.listen(3000)