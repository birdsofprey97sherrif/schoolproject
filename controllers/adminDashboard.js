const {
  Student,
  Teacher,
  Classroom,
  Parent,
  User,
} = require("../models/SchoolDB");

// GET: Dashboard Summary + Latest Entries
exports.getDashboardData = async (req, res) => {
  try {
    // Parallel fetching of counts and latest entries
    const [
      studentCount,
      teacherCount,
      classroomCount,
      parentCount,
      userCount,
      latestStudents,
      latestTeachers,
      latestClassrooms,
      latestParents,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Classroom.countDocuments(),
      Parent.countDocuments(),
      User.countDocuments({ isActive: true }),
      Student.find().sort({ createdAt: -1 }).limit(5),
      Teacher.find().sort({ createdAt: -1 }).limit(5),
      Classroom.find().sort({ createdAt: -1 }).limit(5),
      Parent.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      counts: {
        studentCount,
        teacherCount,
        classroomCount,
        parentCount,
        userCount,
      },
      latest: {
        students: latestStudents,
        teachers: latestTeachers,
        classrooms: latestClassrooms,
        parents: latestParents,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch dashboard data",
        details: error.message,
      });
  }
};

// GET: All students with populated references
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("classroom")
      .populate("parent");

    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch students", details: error.message });
  }
};

