const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// midddle wire 
app.use(cors());
app.use(express.json())


// mongoDB



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwjhzip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db('bistroDB').collection('users');
    const menuCollection = client.db('bistroDB').collection('menu');
    const reviewsCollection = client.db('bistroDB').collection('reviews');
    const cartCollection = client.db('bistroDB').collection('carts')

    // users related api
    app.post('/users', async(req,res)=>{
      const user = req.body;
      // insert email if user doesn't exists

      const query = {email: user.email}
      const exixtingUser = await userCollection.findOne(query);
      if(exixtingUser){
        return res.send({message: 'user already exists', insertedId: null})
      }
      
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/menu',async(req,res)=>{
        const result = await menuCollection.find().toArray()
        res.send(result)
    })

    app.get('/reviews',async(req,res)=>{
        const result = await reviewsCollection.find().toArray()
        res.send(result)
    })

    // get carts data
    app.get('/carts', async(req,res)=>{
      const email = req.query.email;
      const query = {email : email}
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })
    // carts collection 
    app.post('/carts',async(req,res)=>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result)
    })

    // delete carts data
    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Boss is Running')
})

app.listen(port,()=>{
    console.log(`Bistro Boss in running on port ${port}`)
})