require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://workflo.web.app",
    "https://workflo.firebaseapp.com",
    "http://workflo.surge.sh",
    "https://workflo-server.vercel.app",
  ],
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
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger);

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;

    next();
  });
};

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
  const activityCollection = db.collection("activity");

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
  app.post("/tasks", verifyToken, async (req, res) => {
    const task = req.body;

    // Find the highest order in the "To-Do" category
    const lastTask = await tasksCollection
      .find({ category: "To-Do" })
      .sort({ order: -1 }) // Sort in descending order
      .limit(1)
      .toArray();

    const newOrder = lastTask.length > 0 ? lastTask[0].order + 1 : 1;

    task.order = newOrder;
    task.createdAt = Date.now();
    task.category = "To-Do";

    const result = await tasksCollection.insertOne(task);
    res.send(result);
  });

  // get all tasks
  app.get("/tasks", verifyToken, async (req, res) => {
    const email = req.query.email;

    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "access forbidden" });
    }

    const tasks = await tasksCollection.find({ email }).toArray();
    res.send(tasks);
  });

  // get task by id
  app.get("/tasks/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await tasksCollection.findOne(query);
    res.send(result);
  });

  // update task
  app.put("/update/tasks/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        title,
        description,
        category,
      },
    };

    const result = await tasksCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  // activity log
  app.post("/activity", verifyToken, async (req, res) => {
    const activity = req.body;

    activity.createdAt = Date.now();

    const result = await activityCollection.insertOne(activity);
    res.send(result);
  });

  // get activity data
  app.get("/activity/:email", verifyToken, async (req, res) => {
    const { email } = req.params;
    const query = { email };

    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "access forbidden" });
    }

    const result = await activityCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  });

  app.put("/tasks/update-order-category", verifyToken, async (req, res) => {
    const { taskId, newCategory, tasks } = req.body;

    try {
      // Update task category
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { category: newCategory } }
      );

      // Update orders in the new category
      const bulkOps = tasks.map((task) => ({
        updateOne: {
          filter: { _id: new ObjectId(task._id) },
          update: { $set: { order: task.order } },
        },
      }));

      if (bulkOps.length > 0) {
        await tasksCollection.bulkWrite(bulkOps);
      }

      res.json({ message: "Task updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error updating task", error });
    }
  });

  // delete a task
  app.delete("/tasks/delete/:id", verifyToken, async (req, res) => {
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
