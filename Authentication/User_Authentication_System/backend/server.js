import express from 'express'
import { connectDb } from './src/config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import { route } from './src/routes/userRoute.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    credentials: true
}))

app.use("/api", route)

connectDb()
app.listen(3000, ()=>{
    console.log("Server is running..!!")
})