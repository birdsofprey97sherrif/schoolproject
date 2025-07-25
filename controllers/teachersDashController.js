const {
  User,
  Teacher,
  Assingment,
  Classroom,
  Student,
} = require("../models/SchoolDB");

exports.getTeachersDashboard = async (req, res) => {
  try {
    // Ensure user is logged in and is a teacher
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only teachers can access this dashboard.",
      });
    }

    // Fetch the User profile (excluding password)
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if user is linked to a teacher profile
    const teacherId = user.teacher;
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "This user is not linked to a teacher profile.",
      });
    }

    // Fetch classroom(s) assigned to the teacher
    const classrooms = await Classroom.find({ teacher: teacherId });

    // Fetch assignments posted by the teacher
    const assignments = await Assingment.find({ postedBy: teacherId });

    // Extract classroom IDs to find students
    const classroomIds = classrooms.map((c) => c._id);
    const students = await Student.find({ classroom: { $in: classroomIds } });

    // Summary metrics
    const dashboardStats = {
      totalClasses: classrooms.length,
      totalStudents: students.length,
      totalAssignments: assignments.length,
    };

    // Final structured response
    return res.status(200).json({
      success: true,
      message: "Teacher dashboard loaded successfully.",
      data: {
        user,
        classrooms,
        assignments,
        students,
        dashboardStats,
      },
    });
  } catch (error) {
    console.error("Error fetching teacher's dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while loading the teacher dashboard.",
    });
  }
};
