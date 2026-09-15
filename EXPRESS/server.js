// const express = require("express")
// const app =express()
// app.get("/",(req, res)=>{
//     res.send("Welcome to Developer API...")
// })

// app.get("/about",(req,res)=>{
//     res.send("This API is built using Node.js and Express.js")
// })

// app.get("/developers", (req,res)=>{
//     res.json([
//     {
//         "id": 1,
//         "name": "Chaitanya",
//         "skill": "React"
//     },
//     {
//         "id": 2,
//         "name": "Rahul",
//         "skill": "Node.js"
//     }
// ])
// })

// app.get("/users/:id",(req, res)=>{
//     console.log(req.params)
// })

// const users = [
//     {
//         id: 1,
//         name: "Chaitanya"
//     },
//     {
//         id: 2,
//         name: "Rahul"
//     },
//     {
//         id: 3,
//         name: "Amit"
//     }
// ];

// app.get("/users/:userId/posts/:postId", (req, res) => {
//     console.log(req.params);

//     res.json(req.params);
// });

// app.get("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find(user => user.id === id);

//     res.json(user);
// // });

// app.get("/users", (req, res) => {
//     console.log(req.query);

//     res.json(req.query);
// });
// app.listen(3000)

// const express = require("express");
// const developers = require("./data");
// const app = express();

// app.get("/developers", (req, res) => {
//   const skill = req.query.skill;
//   if (!skill) {
//     return res.json(developers);
//   }
//   const result = developers.filter((d) => d.skill === skill);
//   res.send(result);
// });

// app.get("/developers/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const developer = developers.find((d) => d.id === id);
//   if (!developer) {
//     return res.status(404).json({
//       message: "Developer not found",
//     });
//   }
//   res.json(developer);
// });

// app.get("/search", (req, res) => {
//   const name = req.query.name;
//   if (!name) {
//     return res.status(400).json({
//       message: "Name query parameter is required",
//     });
//   }

//   const result = developers.filter((d) =>
//     d.name.toLowerCase().includes(name.toLowerCase()),
//   );
//   res.json(result);
// });

// app.listen(3000, () => {
//   console.log("started...........");
// });




// ==============middleware=====================


const express = require("express")
const app = express()


app.use((req,res,next)=>{
    console.log("Middle ware executed......")
    next()
})

app.get("/", (req, res)=>{
    res.send("Home page")
})

app.listen(3000, ()=>{
    console.log("started........")
})