const { Classroom } = require("../models/SchoolDB");

// Add classroom
exports.addClassroom = async (req, res) => {
  try {
    const { name, gradeLevel, classYear, teacher } = req.body;

    if (!name || !gradeLevel) {
      return res.status(400).json({ message: "Class name and grade level are required" });
    }

    const savedClassroom = await new Classroom(req.body).save();
    res.status(201).json({ message: "Classroom saved", classroom: savedClassroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate("teacher", "name email phone")
      .populate("students", "name addmissionNumber");
    res.status(200).json({ classrooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch one classroom
exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("teacher", "name email phone")
      .populate("students", "name addmissionNumber");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ classroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update classroom
exports.updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom updated", classroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete classroom
exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
