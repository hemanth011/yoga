const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OvbsySJGZTRpG193XGNcCoCbNGysEHH7E32UaffohRSZk3qTsXEytsW9mzyr35sobY3boEwed0ptG8BY8Vb8fWJ00O3KSd24h"
);
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// set token
// SET TOKEN .
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: "Unauthorize access" });
  }
  const token = authorization?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "forbidden user or token has expired" });
    }
    req.decoded = decoded;
    next();
  });
};

const uri = process.env.MONGODB_URI;

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function setupRoutes() {
  const client = await connectToMongoDB();
  const database = client.db("yogo-master");
  const classesCollections = database.collection("classes");
  const friendCollections = database.collection("friends");
  const usercollections = database.collection("users");
  const cartcollections = database.collection("cart");
  const paymentcollections = database.collection("payment");
  const enrollmentcollections = database.collection("enrollment");
  const appliedcollections = database.collection("applied");

  // router token
  app.post("/api/set-token", (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_SECRET, {
      expiresIn: "24h",
    });
    res.send({ token });
  });

  // Verify admin
  const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usercollections.findOne(query);
    if (user.role === "admin") {
      next();
    } else {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorize access" });
    }
  };

  const verifyInstructor = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usercollections.findOne(query);

    if (!user || !user.role) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    if (user.role === "instructor" || user.role === "admin") {
      next();
    } else {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }
  };

  // add user
  app.post("/new-user", async (req, res) => {
    const newUser = req.body;

    const result = await usercollections.insertOne(newUser);
    res.send(result);
  });

  // GET ALL USERS
  app.get("/users", async (req, res) => {
    const users = await usercollections.find({}).toArray();
    res.send(users);
  });

  // GET USER BY ID
  app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const user = await usercollections.findOne(query);
    res.send(user);
  });

  // GET USER BY EMAIL
  app.get("/user/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await usercollections.findOne(query);
    res.send(result);
  });

  // Delete a user

  app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usercollections.deleteOne(query);
    res.send(result);
  });

  // UPDATE USER
  app.put("/update-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.option,
        address: updatedUser.address,
        phone: updatedUser.phone,
        about: updatedUser.about,
        photoUrl: updatedUser.photoUrl,
        skills: updatedUser.skills ? updatedUser.skills : null,
      },
    };
    const result = await usercollections.updateOne(filter, updateDoc, options);
    res.send(result);
  });

  // add new class
  app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
    const newClass = req.body;
    // try {
    //   const result = await classesCollections.insertOne(newClass);
    //   res.json(result);
    // } catch (error) {
    //   console.error("Error inserting document:", error);
    //   res.status(500).json({ error: "Error inserting document" });
    // }
    const result = await classesCollections.insertOne(newClass);
    res.send(result);
  });

  // Other routes and logic here
  app.get("/classes", async (req, res) => {
    const qurey = { status: "approved" };
    const result = await classesCollections.find(qurey).toArray();
    res.send(result);
  });

  app.post("/friend-new", async (req, res) => {
    const add = req.body;
    const result = await friendCollections.insertOne(add);
    res.send(result);
  });
  app.get("/friends", async (req, res) => {
    // const qurey = {status:"yes"}
    const result = await friendCollections.find().toArray();
    res.send(result);
  });
  // classes instructorEmail
  app.get("/classes/:email", verifyJWT, verifyInstructor, async (req, res) => {
    const email = req.params.email;
    const qurey = {
      instructorEmail: email,
    };
    const result = await classesCollections.find(qurey).toArray();
    res.send(result);
  });
  // mange classes
  app.get("/manage-classes", async (req, res) => {
    const result = await classesCollections.find().toArray();
    res.send(result);
  });
  //update classes
  app.put("/change-status/:id", verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const reason = req.body.reason;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        status: status,
        reason: reason,
      },
    };
    const result = await classesCollections.updateOne(
      filter,
      updateDoc,
      options
    );
    res.send(result);
  });
  //approvend
  app.get("/approved-classes", async (req, res) => {
    const query = { status: "approved" };
    const result = await classesCollections.find(query).toArray();
    res.send(result);
  });
  // get signle class
  app.get("/class/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await classesCollections.findOne(query);
    res.send(result);
  });
  // update clasese all data
  app.put(
    "/update-class/:id",
    verifyJWT,
    verifyInstructor,
    async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updataDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videLink: updateClass.videLink,
          status: "pending",
        },
      };
      const result = await classesCollections.updateOne(
        filter,
        updataDoc,
        options
      );
      res.send(result);
    }
  );
  // Update a class
  app.put("/update-class/:id", async (req, res) => {
    const id = req.params.id;
    const updatedClass = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: updatedClass.name,
        description: updatedClass.description,
        price: updatedClass.price,
        availableSeats: parseInt(updatedClass.availableSeats),
        videoLink: updatedClass.videoLink,
        status: "pending",
      },
    };
    const result = await classesCollections.updateOne(
      filter,
      updateDoc,
      options
    );
    res.send(result);
  });

  // ! CART ROUTES

  // ADD TO CART
  app.post("/add-to-cart", verifyJWT, async (req, res) => {
    const newCartItem = req.body;
    const result = await cartcollections.insertOne(newCartItem);
    res.send(result);
  });
  // Get cart item id for checking if a class is already in cart
  app.get("/cart-item/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const email = req.query.email;
    const query = { classId: id, userMail: email };
    const projection = { classId: 1 };
    const result = await cartcollections.findOne(query, {
      projection: projection,
    });
    res.send(result);
  });

  // cart info by user email
  app.get("/cart/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const query = { userMail: email };
    const projection = { classId: 1 };
    const carts = await cartcollections
      .find(query, { projection: projection })
      .toArray();
    const classIds = carts.map((cart) => new ObjectId(cart.classId));
    const query2 = { _id: { $in: classIds } };
    const result = await classesCollections.find(query2).toArray();
    res.send(result);
  });

  // Delete a item form cart
  app.delete("/delete-cart-item/:id", verifyJWT, async (req, res) => {
    const id = req.params.id;
    const query = { classId: id };
    const result = await cartcollections.deleteOne(query);
    res.send(result);
  });

  // PAYMENT ROUTES
  app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price) * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  // POST PAYMENT INFO
  app.post("/payment-info", verifyJWT, async (req, res) => {
    const paymentInfo = req.body;
    const classesId = paymentInfo.classesId;
    const userEmail = paymentInfo.userEmail;
    const singleClassId = req.query.classId;
    let query;
    // const query = { classId: { $in: classesId } };
    if (singleClassId) {
      query = { classId: singleClassId, userMail: userEmail };
    } else {
      query = { classId: { $in: classesId } };
    }
    const classesQuery = {
      _id: { $in: classesId.map((id) => new ObjectId(id)) },
    };
    const classes = await classesCollections.find(classesQuery).toArray();
    const newEnrolledData = {
      userEmail: userEmail,
      classesId: classesId.map((id) => new ObjectId(id)),
      transactionId: paymentInfo.transactionId,
    };
    const updatedDoc = {
      $set: {
        totalEnrolled:
          classes.reduce((total, current) => total + current.totalEnrolled, 0) +
            1 || 0,
        availableSeats:
          classes.reduce(
            (total, current) => total + current.availableSeats,
            0
          ) - 1 || 0,
      },
    };
    // const updatedInstructor = await userCollection.find()
    const updatedResult = await classesCollections.updateMany(
      classesQuery,
      updatedDoc,
      { upsert: true }
    );
    const enrolledResult = await enrollmentcollections.insertOne(
      newEnrolledData
    );
    const deletedResult = await cartcollections.deleteMany(query);
    const paymentResult = await paymentcollections.insertOne(paymentInfo);
    res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
  });

  // get payment info
  app.get("/payment-history/:email", async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const result = await paymentcollections
      .find(query)
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });
  // payment length

  app.get("/payment-history-length/:email", async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const total = await paymentcollections.countDocuments(query);
    res.send({ total });
  });

  // ! ENROLLED ROUTES

  app.get("/popular_classes", async (req, res) => {
    const result = await classesCollections
      .find()
      .sort({ totalEnrolled: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  });

  app.get("/popular-instructors", async (req, res) => {
    const pipeline = [
      {
        $group: {
          _id: "$instructorEmail",
          totalEnrolled: { $sum: "$totalEnrolled" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $match: {
          "instructor.role": "instructor",
        },
      },
      {
        $project: {
          _id: 0,
          instructor: {
            $arrayElemAt: ["$instructor", 0],
          },
          totalEnrolled: 1,
        },
      },
      {
        $sort: {
          totalEnrolled: -1,
        },
      },
      {
        $limit: 6,
      },
    ];
    const result = await classesCollections.aggregate(pipeline).toArray();
    res.send(result);
  });

  // Admins stats
  app.get("/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
    // Get approved classes and pending classes and instructors
    const approvedClasses = (
      await classesCollections.find({ status: "approved" }).toArray()
    ).length;
    const pendingClasses = (
      await classesCollections.find({ status: "pending" }).toArray()
    ).length;
    const instructors = (
      await usercollections.find({ role: "instructor" }).toArray()
    ).length;
    const totalClasses = (await classesCollections.find().toArray()).length;
    const totalEnrolled = (await enrollmentcollections.find().toArray()).length;
    // const totalRevenue = await paymentCollection.find().toArray();
    // const totalRevenueAmount = totalRevenue.reduce((total, current) => total + parseInt(current.price), 0);
    const result = {
      approvedClasses,
      pendingClasses,
      instructors,
      totalClasses,
      totalEnrolled,
      // totalRevenueAmount
    };
    res.send(result);
  });

  // !GET ALL INSTrUCTOR

  app.get("/instructors", async (req, res) => {
    const result = await usercollections.find({ role: "instructor" }).toArray();
    res.send(result);
  });

  app.get("/enrolled-classes/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const pipeline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "classes",
          localField: "classesId",
          foreignField: "_id",
          as: "classes",
        },
      },
      {
        $unwind: "$classes",
      },
      {
        $lookup: {
          from: "users",
          localField: "classes.instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $project: {
          _id: 0,
          classes: 1,
          instructor: {
            $arrayElemAt: ["$instructor", 0],
          },
        },
      },
    ];
    const result = await enrollmentcollections.aggregate(pipeline).toArray();
    // const result = await enrolledCollection.find(query).toArray();
    res.send(result);
  });

  // Applied route
  app.post("/as-instructor", async (req, res) => {
    const data = req.body;
    const result = await appliedcollections.insertOne(data);
    res.send(result);
  });
  app.get("/applied-instructors/:email", async (req, res) => {
    const email = req.params.email;
    const result = await appliedcollections.findOne({ email });
    res.send(result);
  });
}

setupRoutes()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Hello W!");
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch(console.error);
