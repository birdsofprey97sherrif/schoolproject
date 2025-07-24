// database
const {Student,Classroom,Parent} = require('../models/SchoolDB');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// multer configuration for file uploads
const uploads = multer({dest: 'uploads/'});
// Create a new student
exports.uploadStudentPhoto = uploads.single('photo');
exports.createStudent = async (req, res) => {
    try {
        const { name, age, classroomId, parentnationalID,addmissionNumber,gender,dateOfBirth } = req.body;
        // check if parent exists by national ID
        const parentExists = await Parent.findOne({ nationalID: parentnationalID });
        if (!parentExists) {
            return res.status(404).json({ error: 'Parent not found' });
        }
        // check if student already exists by admission number
        const existingStudent = await Student.findOne({ addmissionNumber });
        if (existingStudent) {
            return res.status(400).json({ error: 'Student with this admission number already exists' });
        }
        // check if classroom exists
        const classroomExists = await Classroom.findById(classroomId);
        if (!classroomExists) {
            return res.status(404).json({ error: 'Classroom not found' });
        }
        let photo = null;
        if (req.file) {
            // Move the uploaded file to a permanent location
            const ext = path.extname(req.file.originalname);
            const newfilename = `${Date.now()}${ext}`;
            const uploadPath = path.join('uploads', newfilename);
            fs.renameSync(req.file.path, uploadPath); // Move the file to the uploads directory
            photo = uploadPath.replace(/\\/g,'/') // Store the filename in the database
        }
        //create a new student

        const student = new Student({
            name,
            age,
            photo,
            classroom: classroomId,
            parent: parentExists._id,
            addmissionNumber,
            gender,
            dateOfBirth
        });

        await student.save();
        // adding student to a class using the $addToSet operator to avoid duplicates
        await Classroom.findByIdAndUpdate(
            classroomExists._id,
            { $addToSet: { students: student._id } },
            { new: true }
        )
        res.status(201).json({ message: 'Student created successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('classroom').populate('parent');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('classroom').populate('parent');
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a student by ID
exports.uploadStudentPhotoUpdate = uploads.single('photo');
exports.updateStudent = async (req, res) => {
    try {
        const { name, age, classroomId, parentnationalID,addmissionNumber,dateOfBirth,gender } = req.body;
        // Get the student ID from the request parameters
        if (!req.params.id) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        // Find the student by ID
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // check if parent exists by national ID
        const parentExists = await Parent.findOne({ nationalID: parentnationalID });
        if (!parentExists) {
            return res.status(404).json({ error: 'Parent not found' });
        }
        // check if classroom exists
        const classroomExists = await Classroom.findById(classroomId);
        if (!classroomExists) {
            return res.status(404).json({ error: 'Classroom not found' });
        }
        let photo = student.photo; // keep the existing photo if not updated
        if (req.file) {
            // Move the uploaded file to a permanent location
            const ext = path.extname(req.file.originalname);
            const newfilename = `${Date.now()}${ext}`;
            const uploadPath = path.join('uploads', newfilename);
            fs.renameSync(req.file.path, uploadPath); // Move the file to the uploads directory
            photo = uploadPath.replace(/\\/g,'/'); // Store the filename in the database
        }
        // Update the student details
        student.name = name || student.name;
        student.age = age || student.age;
        student.photo = photo;
        student.classroom = classroomId || student.classroom;
        student.parent = parentExists._id || student.parent;
        student.addmissionNumber = addmissionNumber || student.addmissionNumber;
        student.dateOfBirth = dateOfBirth || student.dateOfBirth;
        student.gender = gender || student.gender;
        await student.save();
        // Update the classroom's students array if the classroom has changed
        if (classroomId && classroomId !== student.classroom.toString()) {
            // Remove the student from the old classroom
            await Classroom.findByIdAndUpdate(
                student.classroom,
                { $pull: { students: student._id } },
                { new: true }
            );
            // Add the student to the new classroom
            await Classroom.findByIdAndUpdate(
                classroomId,
                { $addToSet: { students: student._id } },
                { new: true }
            );
        }
        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Delete a student by ID
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // Remove the student from the classroom's students array
        await Classroom.findByIdAndUpdate(
            student.classroom,
            { $pull: { students: student._id } },
            { new: true }
        );
        // Delete the student
        await Student.findByIdAndDelete(id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get students by classroom ID
exports.getStudentsByClassroom = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const students = await Student.find({ classroom: classroomId }).populate('classroom').populate('parent');
        if (students.length === 0) {
            return res.status(404).json({ error: 'No students found for this classroom' });
        }
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
