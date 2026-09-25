import express from 'express'
import { getProfile, loginUser, logoutUser, registerUser } from '../controller/userController.js'

export const route = express.Router()


route.post("/register", registerUser)
route.post("/login", loginUser)
route.post("/logout", logoutUser) 
route.get("/profile", getProfile)