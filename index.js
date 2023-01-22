const express = require('express')
const cors = require('cors');

require('dotenv').config()
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');

// All imports End here

const app = express()
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT|| 5000 ;


// mongodb connection uri
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.f1yko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async ()=>{
  try {
    await client.connect()
    const productCollection = client.db('inventory').collection('product');
  
    app.get('/product', async(req, res) =>{
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
  });

  app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
  });

  // POST product
  app.post('/product', async(req, res) =>{
      const newproduct = req.body;
      console.log('adding new user', newproduct);
      const result = await productCollection.insertOne(newproduct);
      res.send(result)
  });

  // update product
  app.put('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedProduct = req.body;
      console.log(updatedProduct)
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {

            quantity: updatedProduct.quantity

          }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  })

  // delete a user
  app.delete('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
  })
  
  
  }
  finally {
  
  }
  
  
  
  // function End here
  }
  // function End here
  
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running')
})


app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
