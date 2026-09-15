import express from 'express'
import { router } from './src/routing/userRoute.js'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './src/config/db.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

connectDB()

app.get("/", (req, res)=>{
    res.redirect("/users")
})

app.use("/users", router)

app.listen(3000, ()=>{
    console.log("Server is running..!!")
})