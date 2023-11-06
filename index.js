const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookiePerser = require('cookie-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());
app.use(cookiePerser());

console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etfhytw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const jobCollection = client.db("jobHunter").collection('jobs');
    //job post
    app.post('/addJobs', async (req, res) => {
      const body = req.body;
      const result = await jobCollection.insertOne(body);
      res.send(result);
    })
    app.get('/jobs', async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.findOne(query)
      res.send(result);
    });

    //delete
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }     
      const result = await jobCollection.deleteOne(query)
      res.send(result);
    });
    //put
    app.put('/jobsUpdate/:id', async (req, res) => {
       const id = req.params.id
      const query = { _id: new ObjectId(id) }
       const options = { upsert: true };
      const body = req.body;
       const updateDoc = {
      $set: {
                    jobTitle: body.jobTitle,
                    category: body.category,
                    email: body.email,
                    priceRange: body.priceRange,
                    maxPrice: body.maxPrice,
                    deadline: body.deadline,
                    img: body.img,
                    shortDescription: body.shortDescription
      },
      };
      const result = await movies.updateOne(query, updateDoc, options);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})