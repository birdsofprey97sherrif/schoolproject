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


const teachersDashboard = require('./routes/teachersDashRoutes');
app.use('/api/teacher/dashboard', teachersDashboard); // Dashboard specific


const teacher = require('./routes/teachersRoute');
app.use('/api/teacher', teacher); // For teacher core routes like profile, etc.


const assingment = require("./routes/assingmentRoutes");
app.use("/api/assingment", assingment);


const parentDashboard = require('./routes/parentDashRoutes');
app.use('/api/parent/dashboard', parentDashboard); // ✅ MOUNT FIRST

const parent = require('./routes/parentRoutes');
app.use('/api/parent', parent); // ✅ MOUNT AFTER

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