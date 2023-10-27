const express=require("express");
const Collection=require("./mongodb");
const app=express();

const path=require("path");
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const bcryptjs=require("bcryptjs");

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

const tempelatePath=path.join(__dirname,"../tempelates");
const publicPath=path.join(__dirname,"../public");

app.set('view engine','hbs');

app.set("views",tempelatePath);

app.use(express.static(publicPath));  // linking of css

async function hashPass(password){
    const res=await bcryptjs.hash(password,10);
    return res;
}

async function compare(userPass, hash) {
    const res = await bcryptjs.compare(userPass, hash);
    return res;
}



app.get("/",async (req,res)=>{


    if (req.cookies.jwt) {
        const verify = jwt.verify(req.cookies.jwt, "helloandwelcometotechywebdevtutorialonauthhelloandwelcometotechywebdevtutorialonauth");
        const user = await Collection.findOne({ email: verify.email });
    
        if (user) {
            res.render("home", {
                name: user.name,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
                address: user.address
            });
        } else {
            res.send("User not found");
        }
    }
    
    else
    {
        res.render("login")
    }
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup",async(req,res)=>{
    try{
        const check=await Collection.findOne({email:req.body.email})

        if(check){
            res.send("user already exist")
        }

        else {

            const token=jwt.sign({email: req.body.email},"helloandwelcometotechywebdevtutorialonauthhelloandwelcometotechywebdevtutorialonauth")

            res.cookie("jwt",token,{
                maxAge:500000,
                httpOnly:true
            }) 

            
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: await hashPass(req.body.password),
                dob: req.body.dob,
                gender: req.body.gender,
                address: req.body.address,
                token:token
            }
            await Collection.insertMany([data]);
        }

    }
    catch{

        res.send("wrong details");

    }
})


app.post("/login",async(req,res)=>{
    try{
        const check=await Collection.findOne({email:req.body.email})
        const passCheck=await compare(req.body.password,check.password)

        if(check && passCheck){

            res.cookie("jwt",check.token,{ // name of cookie jwt
                maxAge:500000,
                httpOnly:true
            }) 
            
            res.render("home", {
                name: check.name,
                email: check.email,
                dob: check.dob,
                gender: check.gender,
                address: check.address
            });
        }

        else {

            res.send("wrong details")
            
            
        }

    }
    catch{

        res.send("wrong details");

    }
})
const port=3000;

app.listen(port,()=>{

    console.log("port is listening");
})