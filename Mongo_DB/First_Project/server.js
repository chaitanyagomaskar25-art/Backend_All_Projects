import express from 'express';
import 'dotenv/config'; 
import connectDB from './src/config/db.js';
import studentRoutes from './src/routes/studentRoutes.js';


connectDB()

const app = express()
app.use(express.json())

app.use("/students", studentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("Server is runnig")
})