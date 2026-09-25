import express from 'express'
import { router } from './src/routes/userRoute.js'
import { connectDb } from './src/config/db.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import cors from "cors";

const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true 
}));

app.use(express.json())
app.use(cookieParser())

app.use("/auth", router)

connectDb()
 
app.listen(3000, ()=>{
    console.log("Server is runnig..!!")
})
