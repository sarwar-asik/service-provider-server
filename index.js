const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectID } = require("bson");

const app = express();
const port = process.env.PORT || 5000;

// middleware use

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("sh tourist server is running");
});

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.ysfeeva.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client
      .db("sh-traveldb")
      .collection("add-services");

    app.post("/addServices", async (req, res) => {
      const services = req.body;
      // console.log(services);
      const result = await servicesCollection.insertOne(services);

      res.send(result);
    });

    app.get("/serviceslimit", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectID(id) };
      const newReview = req.body.reviews;
      const service = req.body.service;

      const option = { upsert: true };

      console.log(service);

      const addReview = {
        $set: {
          reviews: [newReview,...service.reviews],
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        addReview,
        option
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`sh server running on ${port}`);
});
