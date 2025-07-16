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
app.use('/api/user/Auth',userAuth)


// classroom routes 
const classroom =require('./routes/classroomRoutes')
app.use('/api/classroom',classroom)

const teacher = require('./routes/teachersRoute')
app.use('/api/teacher',teacher)

// mongoose connection to the db 
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to mongodb"))
.catch(err => console.log("mongoDB connection error",err))


const port = 3001
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})