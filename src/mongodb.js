const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://yashmeshram239:Yash123@studentdetails.qf7rbm6.mongodb.net/student?retryWrites=true&w=majority")
.then(()=>{
    console.log("Database connected")
})
.catch(()=>{
    console.log("Database not connected")
})

const Schema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    token:{
        type:String,
        required:true
    }
})

const Collection= new mongoose.model("users",Schema);

module.exports=Collection;