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

const assingment = require("./routes/assingmentRoutes");
app.use("/api/assingment", assingment);


const parent = require('./routes/parentRoutes')
app.use('/api/parent',parent)

const student = require('./routes/studentRoutes')
app.use('/api/student',student)

const adminDashboard = require('./routes/admindashRoute')
app.use('/api/admin',adminDashboard)

// mongoose connection to the db 
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to mongodb"))
.catch(err => console.log("mongoDB connection error",err))


const port = 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})