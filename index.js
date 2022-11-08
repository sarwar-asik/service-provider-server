const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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
}

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`sh server running on ${port}`);
});
