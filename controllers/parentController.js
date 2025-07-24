const { Parent, User } = require("../models/SchoolDB");
//
const bcrypt = require("bcryptjs");

// add a parent
exports.addParent = async (req, res) => {
  try {
    // destructure the request body to check if parent exixts
    const { email, nationalID, name } = req.body;
    // check if parent already exists
    const existingParent = await User.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ message: "Parent already exists" });
    }
    // check using the id
    const existingParentById = await Parent.findOne({ nationalID });
    if (existingParentById) {
      return res
        .status(400)
        .json({ message: "Parent with this National ID already exists" });
    }
    // when all checks are passed, create a new parent
    const newParent = new Parent(req.body);
    const savedParent = await newParent.save();

    // create a corresponding user document
    const defaultPassword = "parent1234";
    const password = await bcrypt.hash(defaultPassword, 10);

    // create a new user with the parent details
    // and the hashed password
    const newUser = new User({
      name: savedParent.name,
      email: savedParent.email,
      password,
      role: "parent",
      parent: savedParent._id,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "Parent registered successfully", parent: savedParent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all parents
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find();
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update parent
exports.updateParent = async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json(updatedParent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete parent
exports.deleteParent = async (req, res) => {
  try {
    const deletedParent = await Parent.findByIdAndDelete(req.params.id);
    if (!deletedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const deletedUser = await User.deleteOne({ parent: req.params.id });
    
    res.status(200).json({ 
      message: `Parent ${deletedParent.name} deleted successfully${deletedUser.deletedCount ? ' along with associated user' : ''}.`
    });
  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).json({ message: "An error occurred while deleting the parent." });
  }
};


// get parent by ID
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json({
      message: `Parent ${parent.name} retrieved successfully`,
      parent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
