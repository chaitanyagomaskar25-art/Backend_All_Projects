import express from 'express'

const app = express()

app.get("/", (req,res)=>{
    res.json({
        message: "Hello World",
        status: "Success"
    })
})

app.listen(3000) 