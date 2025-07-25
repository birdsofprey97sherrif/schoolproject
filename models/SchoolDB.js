const mongoose =require('mongoose')
const Schema = mongoose.Schema

// define user schema 
const userSchema = new Schema({
    name :{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    role:{type:String,enum:['admin','teacher','parent'],required:true},
    teacher:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher',default:null},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent',default:null}
},{timestamps:true})

// teachers schema
const teacherSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:String},
    subject:{type:String}
},{timestamps:true})

// parent Schema
const parentSchema = new Schema({
    name :{type:String,required:true},
    email:{type:String},
    phone:{type:String,required:true},
    nationalID:{type:String,required:true,unique:true},
    address:{type:String}
},{timestamps:true})

// classroom schema
const classroomSchema = new Schema(
  {
    name: { type: String, required: true },
    gradeLevel: { type: String },
    classYear: { type: Number },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

// student Schema 
const studentSchema = new Schema(
  {
    name: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },
    photo: { type: String },
    addmissionNumber: { type: String },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      
    },
  },
  { timestamps: true }
);

// assingments 
const assingmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      
    },
    dueDate: { type: Date },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      
    },
  },
  { timestamps: true }
);

// prepare exports 
const User = mongoose.model("User",userSchema)
const Teacher = mongoose.model("Teacher",teacherSchema)
const Classroom = mongoose.model("Classroom",classroomSchema)
const Parent = mongoose.model("Parent",parentSchema)
const Student = mongoose.model("Student",studentSchema)
const Assingment = mongoose.model("Assingment",assingmentSchema)

module.exports = {User,Teacher,Classroom,Parent,Student,Assingment}