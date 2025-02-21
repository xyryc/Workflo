require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

const logger = (req, res, next) => {
  console.log(
    `⏳ Req: ${req.hostname} || ${req.method} - ${
      req.url
    } at ${new Date().toLocaleTimeString()}`
  );
  next();
};

// middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(logger);

// const uri = "mongodb://localhost:27017/";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t08r2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const db = client.db("workfloDB");
  const usersCollection = db.collection("users");
  const tasksCollection = db.collection("tasks");

  // Generate jwt token
  app.post("/jwt", async (req, res) => {
    const email = req.body;
    const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "365d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
  });

  // Logout
  app.get("/logout", async (req, res) => {
    try {
      res
        .clearCookie("token", {
          maxAge: 0,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // task apis
  // save a new task
  app.post("/tasks", async (req, res) => {
    const task = req.body;
    task.createdAt = Date.now();
    task.category = "To-Do";

    const result = await tasksCollection.insertOne(task);
    res.send(result);
  });

  // get all tasks
  app.get("/tasks", async (req, res) => {
    const email = req.query.email;
    const tasks = await tasksCollection.find({ email }).toArray();
    res.send(tasks);
  });

  // update task category
  app.patch("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { category } }
    );
    res.send(result);
  });

  // delete a task
  app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);

    res.send(result);
  });

  // user apis
  // save new user
  app.post("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const user = req.body;

    // check if user exist in db
    const isExist = await usersCollection.findOne(query);
    if (isExist) {
      return res.send(isExist);
    }

    const result = await usersCollection.insertOne({
      ...user,
      createdAt: Date.now(),
    });

    res.send(result);
  });

  // try {
  // Connect the client to the server	(optional starting in v4.7)
  // await client.connect();
  // Send a ping to confirm a successful connection
  // await client.db("admin").command({ ping: 1 });
  // console.log(
  //   "Pinged your deployment. You successfully connected to MongoDB!"
  // );
  // } finally {
  // Ensures that the client will close when you finish/error
  // await client.close();
  // }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
