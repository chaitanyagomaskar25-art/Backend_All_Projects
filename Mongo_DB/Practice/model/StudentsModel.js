import mongoose from 'mongoose'
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        return value.length > 2;
      },
      message: "Name should be more that 2 characters",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  age: {
    type: Number,
    required: true,
    min: [18, "Age must be greater than 18"],
    max: [60, "Age must be less that 60"],
  },
  course: {
    type: String,
    required: true,
    enum: ["MERN", "Java", "Python", "Data Science"],
  },
  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Student = mongoose.model("Student", studentSchema)
