import express from 'express'
import 'dotenv/config'
import cors from 'cors'

import { connectDb } from './src/config/db.js'
import { router } from './src/routes/userRoute.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    Credential: true
}))

app.use("/", router)

connectDb()
app.listen(3000, ()=>{
    console.log("Server connected successfully..!!")
})
