const express = require("express");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ta49n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("pottery");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewCollection = database.collection("review");
    const adminCollection = database.collection("admin");

    // all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log("hit the api");
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });

    // single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specifing product", id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });

    // delete
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });

    // orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const order = await cursor.toArray();
      res.send(order);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      //console.log('hit the api');
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    app.get("/ordersEmail", (req, res) => {
      ordersCollection
        .find({ email: req.query.email })
        .toArray((err, documents) => {
          res.send(documents);
        });
    });

    // review
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      //console.log('hit the api');
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    app.delete("/deletePurches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

    app.patch("/updateStatus/:id", (req, res) => {
      const id = ObjectId(req.params.id);
      ordersCollection
        .updateOne(
          { _id: id },
          {
            $set: { purcheStatus: req.body.updateStatus },
          }
        )
        .then((result) => {
          // console.log(result);
        });
    });

    //admin
    app.post("/admin", async (req, res) => {
      const admin = req.body;

      const result = await adminCollection.insertOne(admin);
      // console.log(result);
      res.json(result);
    });
    //admin
    app.get("/admin", async (req, res) => {
      adminCollection.find({ email: req.query.email }).toArray((err, admin) => {
        res.send(admin);
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running pottery Server");
});

app.listen(port, () => {
  console.log("Running server on port", port);
});
