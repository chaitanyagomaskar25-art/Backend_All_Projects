import express from "express";
import {
  createStudent,
  deactivateMernStudents,
  deleteInactiveStudents,
  deleteStudent,
  getStudentByEmail,
  getStudentById,
  getStudents,
  patchStudent,
  updateStudent,
  updateStudentByEmail,
} from "../controller/StudentsController.js";
export const router = express.Router();

router.post("/", createStudent);

router.get("/", getStudents);

router.get("/email/:email", getStudentByEmail);
router.get("/:id", getStudentById);

router.put("/:id", updateStudent);
router.patch("/:id", patchStudent);
router.patch("/email/:email", updateStudentByEmail);
router.patch("/course/mern/deactivate", deactivateMernStudents);
router.delete("/:id", deleteStudent);
router.delete("/inactive/all", deleteInactiveStudents);