const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middle ware
app.use(cors({
    origin: ['http://localhost:5173']
}))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.rjjtc94.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const productsCollection = client.db('jobTask').collection('products')



        // products api
        app.get('/products', async (req, res) => {
            // const page = parseInt(req.query.page) - 1;
            // const size = parseInt(req.query.size);

            const sort = req.query.sort;
            const search = req.query.search;
            const brandName = req.query.brandName;
            const category = req.query.category;
            // const minPrice = req.query.minPrice;
            // const maxPrice = req.query.maxPrice;
            console.log(search)
           

            let query = {}
            if (search) {
                query.ProductName = { $regex: search, $options: 'i' };
            }
            if (brandName) {
                query.BrandName = brandName;
            }
            if (category) {
                query.Category = category;
            }
            // if (minPrice && maxPrice) {
            //     query.Price = { $gte: minPrice, $lte: maxPrice };
            // }

          

            let option = {}
            // if (sort == 'new') {
            //     option = { sort: { Price: 1 } }
            // }
            if (sort == 'asc') {
                option = { sort: { Price: -1 } }
            }
            if (sort == 'dsc') {
                option = { sort: { Price: 1 } }
            }

            // const result = await productsCollection.find(query, option).skip(page * size).limit(size).toArray();
            const result = await productsCollection.find(query, option).skip(2).limit(8).toArray();
            res.send(result)
        })

        app.get('/products-count', async (req, res) => {
            const search = req.query.search;
            console.log(search)
            let query = {}
            if (search) {
                query = { ProductName: { $regex: search, $options: 'i' } }
            }
            const count = await productsCollection.countDocuments(query);
            res.send({ count })
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Job task is running')
})

app.listen(port, () => {
    console.log(`Job task running on port ${port}`)
})