const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Unified User Schema with role-based optional fields
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "teacher", "parent"],
      required: true,
    },
    isActive: { type: Boolean, default: true },

    // Teacher-specific
    subject: { type: String },

    // Parent-specific
    nationalID: { type: String, unique: true, sparse: true },
    address: { type: String },
  },
  { timestamps: true }
);

// Student Schema
const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },
    photo: { type: String },
    admissionNumber: { type: String },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // parent user
  },
  { timestamps: true }
);

// Classroom Schema
const classroomSchema = new Schema(
  {
    name: { type: String, required: true },
    gradeLevel: { type: String },
    classYear: { type: Number },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher user
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

// Assignment Schema
const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    dueDate: { type: Date },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher user
  },
  { timestamps: true }
);

// Export models
module.exports = {
  User: mongoose.model("User", userSchema),
  Student: mongoose.model("Student", studentSchema),
  Classroom: mongoose.model("Classroom", classroomSchema),
  Assignment: mongoose.model("Assignment", assignmentSchema),
};
