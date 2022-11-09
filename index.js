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

    const reviewCollection = client.db("sh-traveldb").collection("add-review");

    app.post("/addServices", async (req, res) => {
      const services = req.body;
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
      console.log(query, "form services....");
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectID(id) };
      const newReview = req.body.reviews;
      const service = req.body.service;

      const option = { upsert: true };

      const addReview = {
        $set: {
          reviews: [newReview, ...service.reviews],
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        addReview,
        option
      );
      res.send(result);
    });

    // for review addd /////
    app.post("/addreviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });


    // get review by service  id ////
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`sh server running on ${port}`);
});
