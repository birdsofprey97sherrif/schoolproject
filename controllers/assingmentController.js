const {Assingment,User,Classroom}=require('../models/SchoolDB')
// get all assingments(admin view)
//includes classroom and teacher information
exports.getAllAssingment = async (req, res) => {
  try {
   
    const assingments = await Assingment.find()
      .populate("classroom", "name gradeLevel classYear")
      .populate("postedBy", "name email phone");
    res.status(200).json(assingments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// add assingments only teachers 
// validate user and classroom existence 
exports.addAssingment = async (req,res) =>{
    try {
        // get the logged in user 
        const userId =req.user.userId
        // fetch the user and populate the teacher fields if they exist
        const user = await User.findById(userId)
        .populate('teacher')
        // block non teacher from posting
        if(!user||!user.teacher) return res.status(403).json({message:"Only teacher can post"})
            // extract classroomId from the request
        const {classroom:classroomId}=req.body
        const classroomExist = await Classroom.findById(classroomId)
        if (!classroomExist){
            return res.status(404).json({message:"Classroom not found"})
        }
        // prepare the assingment data 
        const assingmentData ={
            ...req.body,
            postedBy:user.teacher._id
        }
        // savethe assingment to the db
        const newAssingment = new Assingment(assingmentData)
        const savedAssingment = await newAssingment.save()
        res.status(201).json(savedAssingment)
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

// single assingment
//include the classroom ND THE TEACHER
exports.getAssingmentById = async (req,res) =>{
    try {

       
        const assingment = await Assignment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')
        if(!assingment){
            return res.status(404).json({message:"Assingment not found"})
        }
        res.json(assingment)
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

exports.updateAssingment =async (req,res) =>{
    try {
        // find the assingment first 
        const updateAssingment = await Assingment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}


        )
        if(!updateAssingment){
          return res.status(404).json({ message: "Assingment not found" });
        }
        res.status(201).json({message:"Assingment Updated Successfully",updateAssingment})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete Assingments
exports.deleteAssingment = async (req,res) =>{
    // find the Assingment and delete by id
    try {
        const deletedAssingment = await Assingment.findByIdAndDelete(
          req.params.id
        );
        if (!deletedAssingment)
          return res.status(500).json({ message: "Assingment Not Found" });
        res.json({ message: "Assingment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
