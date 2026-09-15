import Student from '../model/studentModel.js'

export const createStudent = async (req, res) => {
  try {
    const student = Student.create({
      name: req.body.name,
      age: req.body.age,
      email:req.body.age,
      course: req.body.course
    })

    res.status(201).json(student)
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}


