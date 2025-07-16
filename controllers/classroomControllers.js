const { Classroom } = require("../models/SchoolDB");

//all classroom

exports.addClassroom = async (req, res) => {
  try {
    //recive data from the clinets
    const newClassroom = req.body;
    const savedClassroom = new Classroom(newClassroom)
      await savedClassroom.save()
      res.json({ message: "saved classroom",savedClassroom })
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// fetching classroom 
exports.getAllclassrooms = async (req,res)=>{
    try {
        const classrooms =await Classroom.find()
        .populate('teacher','name email phone')
        .populate('students','name addmissionNumber')
        res.json(classrooms)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get a single classroom 
exports.getClassroomById = async (req,res)=>{
    try {
        const classroom = await Classroom.findById(req.params.id)
          .populate("teacher", "name email phone")
          .populate("students", "name addmissionNumber");
          if (!classroom) return res.status(404).json({message:"Classroom not found"})
            res.status(200).json(classroom)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//update the classroom
exports.updateClassroom = async(req,res)=>{
    try {
        const updateClassroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if (!updateClassroom) return res.status(404).json({message:"Classroom Not Found"})
            res.status(201).json(updateClassroom)
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

// delete classrooms
exports.deleteClassroom = async (req,res) =>{
    // find the classroom and delete by id
    try {
        const deletedClassroom = await Classroom.findByIdAndDelete(
          req.params.id
        );
        if (!deletedClassroom)
          return res.status(500).json({ message: "Classroom Not Found" });
        res.json({ message: "Classroom deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}