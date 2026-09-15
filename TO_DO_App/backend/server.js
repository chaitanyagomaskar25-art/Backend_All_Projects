const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data.json";

app.get("/todos", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  res.json(JSON.parse(data));
});

app.post("/todos", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const todos = JSON.parse(data);

  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    desc: req.body.desc,
    completed: false,
  };
  todos.push(newTodo);

  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
  res.status(201).json(todos);
});

app.patch("/todos/:id", (req, res) => {
  const todoId = Number(req.params.id);
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  let todos = JSON.parse(data);
  const todoIndex = todos.findIndex((todo) => Number(todo.id) === todoId);
  if (todoIndex === -1) {
    return res.status(404).json({ error: `Todo with ID ${todoId} not found` });
  }
  todos[todoIndex] = { ...todos[todoIndex], ...req.body };
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
  res.json(todos[todoIndex]);
});

app.delete("/todos/:id", (req,res)=>{
   const todoId = Number(req.params.id)
   const data = fs.readFileSync(FILE_PATH, 'utf-8')
   const todos = JSON.parse(data)
   const updatedTodos = todos.filter((todo)=>todo.id !== todoId )
   fs.writeFileSync(FILE_PATH, JSON.stringify(updatedTodos, null, 2))
   res.json({message: "Todo deleted successfully", id: todoId})
})

app.put("/todos/:id", (req, res)=>{
   const todoId = Number(req.params.id)
   const data = fs.readFileSync(FILE_PATH, 'utf-8')
   const todos = JSON.parse(data)
   const todo = todos.find(todo=>todo.id===todoId)

   todo.title = req.body.title
   todo.desc = req.body.desc

   fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2))
   res.json({
       message: "Todo updated successfully",
       todo: todo
   });
})


app.listen(5000, () => {
  console.log("server is running......");
});
