const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgpqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})


client.connect(err => {
    const servicesCollection = client.db("dreamMaker").collection("services");
    const bookCollection = client.db("dreamMaker").collection("bookings");
    const adminList = client.db("dreamMaker").collection("admins");
    const reviewCollection = client.db("dreamMaker").collection("reviews");
    app.post('/admin', (req, res) => {
        const email = req.body;
        adminList.insertOne(email)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/addServices', (req, res) => {
        const newService = req.body;
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/services', (req, res) => {
        servicesCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/events/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/checkout', (req, res) => {
        const book = req.body;
        bookCollection.insertOne(book)
            .then(result => {
                res.send(result.insertedCount > 0)

            })
    })

    app.get('/bookingsByID', (req, res) => {
        bookCollection.find()
            .toArray((err, order) => {
                res.send(order)
            })
    })

    app.post('/addReview', (req, res) =>{
        const reviewData = req.body;
        reviewCollection.insertOne(reviewData)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.get('/review', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.get('/bookings',(req,res) =>{
        bookCollection.find()
        .toArray((err,order) =>{
            res.send(order)
        })
    })
    app.delete('/delete/:id',(req,res) =>{
        servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result =>{
          res.send(result.deletedCount > 0)
        })
      })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminList.find({ info: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

});


app.listen(process.env.PORT || port)
