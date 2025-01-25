// importing the express js  
const express=require("express");
// importing fs module 
const fs=require("fs");
// importing mongoose 
const mongoose=require("mongoose");

const app=express();
const PORT=8000;

// connecting with mongoose 
mongoose
.connect("mongodb://localhost:27017/users")
.then(()=>console.log("MongoDB Connected!"))
.catch((err)=>console.log("MongoDB Error",err))

// Schema 
const userSchema=new mongoose.Schema({
  firstName: {
    type:String,
    require:true,
  },
   lastName: {
    type:String,
   }, 
   email:{
    type:String,
    required: true,
    unique:true,
   },
   jobTitle:{
    type:String,
   },
   gender:{
    type:String,
   },

});

// Model
const User=mongoose.model("user",userSchema);

// middleware 
app.use(express.urlencoded({extended:false}));

app.get("/api/users", (req,res)=>{
  return res.json(allDBusers);
});
app.get("/users", async (req,res)=>{
  const allDBusers = await User.find({});
  const html=  `
  <ul>
  ${allDBusers.map((user)=>`<li>${user.firstName} - ${user.email}</li>`).join("")}
  </ul>`;
  res.send(html);
});
// defining the route ("/api/users/:id") for get, patch, and delete request 
app
.route("/api/users/:id")
.get(async(req,res)=>{
  const user= await User.findById(req.params.id);
  return res.send(user);
})
.patch(async(req,res)=>{
   await User.findByIdAndUpdate(req.params.id,{lastName:"changed"});
  
  return res.send({status:"Success"});
})
.delete(async(req,res)=>{
  await User.findByIdAndDelete(req.params.id); 
  return res.send({status:"Success"});
})

app.post("/api/users", async (req,res)=>{
  const body=req.body;
  if(!body || !body.first_name || !body.last_name || !body.email || !body.job_title || !body.gender){
    return res.status(400).json({msg:"All fields are required!"})
  }
  const result=await User.create({
    firstName:body.first_name,
    lastName:body.last_name,
    email:body.email, 
    jobTitle:body.job_title,
    gender: body.gender,
  })
  console.log("result",result);
  
  return res.status(201).json({msg:"success"});
})

app.listen(PORT, ()=> console.log(`Server has started listening on the port: ${PORT}`));
