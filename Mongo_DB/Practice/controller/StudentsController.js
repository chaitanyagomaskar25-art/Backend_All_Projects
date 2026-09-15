import { Student } from "../model/StudentsModel.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      course: req.body.course,
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: "Success",
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentByEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const patchStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
       req.body ,
      { new: true, runValidators: true },
    );
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student partially updated",
      student,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateStudentByEmail = async (req, res) => {
  try {
    const result = await Student.updateOne(
      { email: req.params.email },
      {
        $set: req.body,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


export const deactivateMernStudents = async (req, res) => {
  try {
    const result = await Student.updateMany(
      { course: "MERN" },
      {
        $set: {
          isActive: false,
        },
      }
    );

    res.status(200).json({
      message: "MERN students deactivated",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const result = await Student.deleteOne({
      _id: req.params.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteInactiveStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({
      isActive: false,
    });

    res.status(200).json({
      message: "Inactive students deleted",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};