const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require ("cors")
const cookieParser = require("cookie-parser")   
require('dotenv').config();
const port = process.env.PORT

const userRoute = require ("./route/userRoute")
const contactRoute = require ("./route/contactRoute")
const productRoute = require ("./route/productRoute")
const orderRoute = require("./route/orderRoute");
// const AuthMiddleWare = require ("./MiddleWare/AuthMiddlleWare")

const corsOptions = {
     origin:"http://localhost:3000",
     credentials:true,
     optionSuccessStatus:200 
}

app.use(cookieParser())         
app.use(express.json())
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors(corsOptions))  
// app.use(AuthMiddleWare)           

app.use("/user",userRoute)
app.use("/product",productRoute)
app.use("/contact",contactRoute)
app.use("/order", orderRoute);
app.get('/', (req, res) => {
    console.log("Root route hit");
    res.send("API is running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongoose connected"))
.catch(err=>console.log(err))

app.listen(port,()=>{console.log(`connected in ${port}`)})