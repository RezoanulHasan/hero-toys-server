const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
var cors = require('cors');
require ('dotenv').config();
const port = process.env.PORT || 5000;


// use   middleware
app.use(express.json());
app.use(cors());

//const corsConfig = {
  //origin: '*',
  //credentials: true,
 // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //allowedHeaders: ['Content-Type', 'Authorization']
//}
//app.use(cors(corsConfig))




//user and pass
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aatv5yk.mongodb.net/?retryWrites=true&w=majority`;


//Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    //await client.connect();


    const productCollection = client.db('ProductsDB').collection('product');
    const contactCollection = client.db('ProductsDB').collection('contacts');
    const bookingCollection = client.db('ProductsDB').collection('bookings');


//*---------------------------bookings--------------------------*



    //get data bookings  from  client
    app.post('/bookings', async( req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
  })

  //SHOW  bookings DATA   IN SERVER SITE 
  app.get('/bookings', async( req, res) => {
    const cursor = bookingCollection.find();
        const result = await cursor.toArray();
    res.send(result);
})

//SHOW  bookings DATA   IN SERVER SITE  BY ID  
app.get('/bookings/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await bookingCollection.findOne(query);
  res.send(result);
})



//update one data use (patch ). update all use (put ) booking one (confrom status)     IN SERVER SITE  BY ID
  app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await  bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
		
		
//bookings  delete  data one by one 
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await  bookingCollection.deleteOne(query);
            res.send(result);
        })






//*---------------------------contacts--------------------------*

    //get data contacts  from  client
    app.post('/contacts', async( req, res) => {
      const contact = req.body;
      console.log(contact);
      const result = await contactCollection.insertOne(contact);
      res.send(result);
  })
  
  

  //SHOW contacts  allDATA   IN SERVER SITE 
  app.get('/contacts', async( req, res) => {
    const cursor = contactCollection.find();
        const result = await cursor.toArray();
    res.send(result);
})

//SHOW contacts  DATA   IN SERVER SITE  BY ID  
app.get('/contacts/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await contactCollection.findOne(query);
  res.send(result);
})




//*--------------------------product section---------------------*


  //SHOW product allDATA  SERVER SITE 
  //app.get('/product', async (req, res) => {
   // const cursor = productCollection.find();
    //const result = await cursor.toArray();
   // res.send(result);
//})

  // SHOW product by login user
  app.get('/product', async (req, res) => {
    //console.log(req.query.email);
    let query = {};
    if (req.query?.email) {
        query = { email: req.query.email }
    }
    const result = await productCollection.find(query).toArray();
    res.send(result);
})





////SHOW  product DATA   IN SERVER SITE  BY ID  
    app.get('/product/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    })


    ///get product data  from  client
    app.post('/product', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct );
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })
	
	

// product  UPDATE  alldata
    app.put('/product/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
          $set: {
              name: updateProduct.name, 
              quantity: updateProduct.quantity, 
              price: updateProduct.price, 
              rating: updateProduct.rating, 
              category: updateProduct.category, 
              details: updateProduct.details, 
              photo: updateProduct.photo
          }
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
  })

//product  delete  data
  app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
  })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello    Toy  server is  working!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})