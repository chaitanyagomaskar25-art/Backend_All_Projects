import express from "express"
import dotenv from "dotenv";

import { connectDB } from "./config/db.js"
import { router } from "./routes/studentsRoutes.js"
dotenv.config();
const app = express()
app.use(express.json())

app.use("/students", router)

connectDB()

app.listen(3000, ()=>{
    console.log("Server is running........")
})