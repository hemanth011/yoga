const express = require('express');
const app = express();
const cors = require('cors');
// const stripe = require("stripe")(process.env.PAYMENT)
app.use(cors());
app.use(express.json());
require('dotenv').config();
//39iiqrLEqoFlNgRP
//hemanthtech143
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://hemanthtech143:39iiqrLEqoFlNgRP@cluster0.xtifwx3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("yoga-master");
    // const classcollections = database.collection("class");
    const usercollections =database.collection("users")
    const classcollections = database.collection("class")
    const cartcollections  = database.collection("cart")
    const paymentcollections = database.collection("payment")
    const enrollmentcollections =database.collection("enrollment")
   const appliedcollections = database.collection("applied")
   app.post("/new-class",async(req,res)=>{
    const newclass = req.body
    const result = await classcollections.insertOne(newclass)
   res.send(result)
   
  })
    // app.get('/classes', async (req, res) => {
    //   try {
    //     const query = { status: 'approved' };
    //     const result = await classcollections.find(query).toArray();
    //     res.send(result);
    //   } catch (err) {
    //     console.error("Error fetching classes:", err);
    //     res.status(500).send("Error fetching classes");
    //   }
    // });
//     app.get('/classes/:email',async(req,res)=>{
//     const email = req.params.email;
//     const query = {instructorEmail:email}
//     const result = await classcollections.find(query).toArray()
//  res.send(result)
//     })
//     //manage
//     app.get('/classes-manage', async(req,res)=>{
//       const result = await classcollections.find().toArray()
//       res.send(result)
//     })
//     //updata
// app.patch('/change-status', async(req,res)=>{
//   const id = req.params.id
//   const status = req.body.status
//   const reason = req.body.reason
//  const filter ={_id: new ObjectId}
//  const options ={upsert:true}
//  const updataDoc = {
//   $set:{
//     status:status,
//     reason:reason
//   }
  
//  }
//  const  result=await classcollections.updateOne(filter,updataDoc,options)
// res.send(result)
// })
// //approvend
// app.get('/approved-classes',  async(req,res)=>{
    
//   const query= {status:'approved'}
//   const result =  await classcollections.find(query).toArray()
// res.send(result)
// })
// // get singal data
// app.get('/classes/:id',async(req,res)=>{
//   const id = req.params.id
//   const query ={ _id : new ObjectId(id)}
//   const result = await classcollections.findOne(query)
//   res.send(result)
// })
// // upadat all
// app.put('/update-class/:id',async(req,res)=>{
//   const id =req.params.id
//   const updateClass=req.body
//   const filter={_id:new ObjectId(id)}
//   const options ={upsert:true}
//   const updataDoc ={
//     $set:{
//       name:updateClass.name,
//       description:updateClass.description,
//       price:updateClass.price,
//       availableSeats:parseInt(updateClass.availableSeats),
//       videLink:updateClass.videLink,
//       status:'pending',
//     }
    
//   }
//   const  result = await classcollections.updateOne(filter,updataDoc,options)
// res.send(result)
// })

//    //cart collections
//    app.post('/add-to-cart',async(req,res)=>{
//     const newCart=req.body
//     const result =await cartcollections.insertOne(newCart)
//   res.send(result)
  
//   })
//   // get cart items
//   app.get('/cart-item/:id',async (req,res)=>{
//      const id =req.params.id;
//      const email = req.body.email;
//      const query ={
//       classId:id,
//       email:email,
//      }
//      const projection = {classId:1}
//      const result = await cartcollections.findOne(query,{projection:projection})
 
//  res.send(result)
//    })

// // cart info by user email
// app.get('/cart/:email',async(req,res)=>{
//   const email = req.params.email  
//   const query={userMail:email}
//   const projection ={classId:1}
//   const cart = await cartcollections.find(query,{projection:projection}) 
// const classIds = cart.map((cart)=>new ObjectId(cart.classId))
// const query2 = {_id : {$in : classIds}}
// const result =await classcollections.find(query2).toArray()
// res.send(result)
// })
// //delect cart item
// app.delete("/del-from-cart", async (req,res)=>{
//   const id =req.params.id
//   const query = {classId:id}
//   const result =await cartcollections.deleteOne(query)
//   res.send(result)
// })

// app.post('/create-payment-intent',async(req,res)=>{
//   const {price}=req.body
//   const amount=parseInt(price)*100
//   const paymentIntent = await stripe.paymentIntents.create({

//     amount:amount,
//     payment_method_types:[
//       "card",
      
//     ],
//   })
//   res.send({
//     clientSecret:paymentIntent.client_secret,
//   })
// })

// // post payment info to db
// app.post('/payment-info',async(req,res)=>{
//   const paymentInfo = req.body
//   const classesId = paymentInfo.classId
//   const userEmail = paymentInfo.userEmail
//   const signleClassId =req.query.classId
//   let query;
//   if(signleClassId){
//     query = {classesId: signleClassId,usermail:userEmail}
//   }else{
// query={classesId:{$in:classesId}}
//   }
// })




    // app.get('/classes/:name', async(req,res)=>{
    //       const name = req.params.instructorName
    //       const query = {instructorName:name} 
    //       const result = await classcollections.find(query).toArray()
    //       res.send(result)
    // })
    const PORT = process.env.PORT || 5678;
    app.listen(PORT, () => {
      console.log(`Express server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongoDB();
