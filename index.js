const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const cors = require('cors');
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.9akcg.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`;
console.log(uri)

app.get('/', (req, res) => {
    res.send('Server ok 200!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('connection error:', err)
    const ProductCollection = client.db("yomithBuyStore").collection("product");
    const ordersCollection = client.db("yomithBuyStore").collection("orders");


    app.post("/addProducts", (req, res, next) => {
        const products = req.body;
        ProductCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/products', (req, res, next) => {
        ProductCollection.find()
            .toArray((err, item) => {
                res.send(item)

            })
    });


    app.delete('/productDelete/:id', (req, res, next) => {
        const id = ObjectID(req.params.id);
        ProductCollection.findOneAndDelete({ _id: id })
            .then(data => {
                res.json({ success: !!data.value })
            })
    });


    app.get('/product/:id', (req, res, next) => {
        ProductCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    app.post("/addOrderProduct", (req, res, next) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orderProducts', (req, res, next) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, item) => {
                res.send(item)

            })
    });



    console.log('database connection successfully')
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})