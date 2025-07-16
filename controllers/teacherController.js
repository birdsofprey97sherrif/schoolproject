const {Teacher,User} = require('../models/SchoolDB')
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

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }

    // Authorization: Only admin or the teacher themselves
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== teacher.userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If password is included, update the User (auth-related data)
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(teacher.userId, {
        password: hashedPassword,
        ...(req.body.email && { email: req.body.email }), // optionally update email
      });
    }

    // Update the Teacher schema (profile-related data)
    const updateFields = { ...req.body };
    delete updateFields.password; // avoid accidental overwrite

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};