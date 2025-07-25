const { User, Parent, Classroom, Student,Assingment } = require("../models/SchoolDB");

// get the children beloging to a particular parent


exports.ParentDashboard = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).populate("parent");
  // extract the parent ID from the user object
  const parent = user.parent;
  // find all children associated with the parent
  const children = await Student.find({ parent: parent._id }).populate(
    "classroom"
  );
  console.log("Children:", children);
  res.status(200).json({ parent,children });
};


// get student assingments 
exports.getClassAssingments = async (req, res) => {
try {
    const assignments = await Assingment.find({ classroom: req.params.userId })
    .populate("postedBy")
    .sort({ dueDate: 1 });
    res.status(200).json(assignments);
    
} catch (error) {
    res.status(500).json({ message: error.message });
}
}
