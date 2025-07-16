const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { access } = require('fs')
require('dotenv').config()


// middleware 
const app = express()
app.use(express.json())
app.use(cors())

// static file access 
app.use("/uploads",express.static('uploads'))

//login/register routes
const userAuth = require('./routes/loginRoute')
app.use('/user/Auth',userAuth)


// mongoose connection to the db 
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to mongodb"))
.catch(err => console.log("mongoDB connection error",err))


const port = 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})