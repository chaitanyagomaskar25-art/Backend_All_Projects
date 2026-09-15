import express from 'express'
import { router } from './src/routes/userRoute.js'
import { connectDb } from './src/config/db.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

app.use("/auth", router)
connectDb()
 
app.listen(3000, ()=>{
    console.log("Server is runnig..!!")
})
