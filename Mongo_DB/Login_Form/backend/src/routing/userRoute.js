import express from 'express'
import { createUser, getAllUers } from '../controller/userController.js'

export const router = express.Router()

router.get("/", getAllUers)
router.post("/", createUser)