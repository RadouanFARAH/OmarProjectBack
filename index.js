require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var userRouter = require('./routes/user.js');
var villeRouter = require('./routes/ville_quartier.js');
var categoryRouter = require('./routes/categories.js');
var productRouter = require('./routes/product.js');
var orderRouter = require('./routes/orders.js');
var vendeurRouter = require('./routes/vendeur.js');
app.use('/user', userRouter)
app.use('/ville_quartier', villeRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/orders', orderRouter)
app.use('/vendeur_dashboard', vendeurRouter)




app.listen(process.env.PORT, () => {
    console.log('application server running in port : ', process.env.PORT)
})