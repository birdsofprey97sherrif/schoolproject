const {Teacher,User, Classroom} = require('../models/SchoolDB')
const bcrypt = require('bcryptjs')
// add teacher
exports.addTeacher = async (req,res)=>{
    try {
      //check if the user exists
      const { email } = req.body;
      const existUserEmail = await Teacher.findOne({ email });
      if (existUserEmail) return res.json({message:"Email of the teacher already taken"})
        //create the teacher
    const newTeacher = new Teacher(req.body)
    const savedTeacher = await newTeacher.save()
    // we create a corresponding user document
    //default password
    const defaultPassword = "teacher1234"
    const password =await bcrypt.hash(defaultPassword,10)
     
    const newUser = new User({
        name:savedTeacher.name,
        email:savedTeacher.email,
        password,
        role:"teacher",
        teacher:savedTeacher._id

    })
    await newUser.save()
    res.status(201).json({message:"Teacher Registered successfully",teacher:savedTeacher})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.getAllTeachers = async (req,res)=>{
    try {
        const teacher = await Teacher.find()
        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getTeacherbyId = async (req,res)=>{
    try {
        const teacher = await Teacher.findById(req.params.id);
         if (!teacher)
           return res.status(404).json({ message: "teacher not found" });
         res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// exports.updateTeacher = async (req, res) => {
//   try {
//     const teacher = await Teacher.findById(req.params.id);

//     if (!teacher) {
//       return res.status(404).json({ message: "Teacher Not Found" });
//     }

//     // Authorization: Only admin or the teacher themselves
//     if (
//       req.user.role !== "admin" &&
//       req.user._id.toString() !== teacher.userId.toString()
//     ) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // If password is included, update the User (auth-related data)
//     if (req.body.password) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       await User.findByIdAndUpdate(teacher.userId, {
//         password: hashedPassword,
//         ...(req.body.email && { email: req.body.email }), // optionally update email
//       });
//     }

//     // Update the Teacher schema (profile-related data)
//     const updateFields = { ...req.body };
//     delete updateFields.password; // avoid accidental overwrite

//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       req.params.id,
//       updateFields,
//       { new: true }
//     );

//     res.status(200).json(updatedTeacher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.updateProfile=async (req,res) =>{
  try {
    const teacherid = req.params.id
    const userId = req.user.userid
    const {email}=req.body
    //check if the email exist
    const existUser =await User.findById(userId)
    if(existUser){
      return res.status(404).json({message:"User not found"})
    }
    const existTeacher = await Teacher.findById(teacherid)
    if(existTeacher){
      return res.status(404).json({message:"Teacher not found"})
    }
    if(updateData.password&&req.user.role=="admin"){
      return res.status(403).json({message:"Forbbiden"})
    }
    if(req.user.role=="teacher"&&existUser.teacher.toString()!==teacher){
      return res.status(403).json({message:"access denied"})
    }
    if(updateData.password){
      const hashpassword =await bcrypt.hash(updateData.password,10)
      updateData.password=hashpassword
    }
    const user = await User.findOne({teacher:teacherid})
    const savedUser=await User.findByIdAndUpdate(
      user._id,updateData,{new:true}
    )
    const savedTeacher = await Teacher.findByIdAndUpdate(teacherid,updateData,{new:true})
    res.json({message:error.message})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.deleteTeacher = async (req,res) =>{
  try {
        const deletedTeacher = await Teacher.findByIdAndDelete(
          req.params.id
        );
        if (!deletedTeacher)
          return res.status(500).json({ message: "Teacher Not Found" });
        // unassing from any classroom
        await Classroom.updateMany({teacher:teacherid},{$set:{teacher:null}})
        res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
}

}

// get Teachers classes
exports.getMyClasses= async (req,res) =>{
  try {
    //loggedin user
    const userId = req.user.userId
    // find all classes for the teacher
    const user =await User.findById(userId)
    .ppopulate('teacher')

    // check if the user exist and is linked to a teacher
    if(!user||!user.teacher) return res.status(401).json({message:"Teacher Not Found"})
      const classes = await Classroom.find({teacher:user.teacher._id})
    .populate('students')
    res.status(200).json(classes)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



exports.getAllAssingment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
    .populate("teacher");
    const assingments = await Assingment.find({postedBy:user.teacher._id})
      .populate("classroom", "name gradeLevel classYear")
      .populate("postedBy", "name email phone");
    res.status(200).json(assingments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
