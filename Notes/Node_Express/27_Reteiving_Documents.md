# Reading Data from MongoDB with Express and Mongoose

## 1. What Are We Learning?

Previously, we created a `POST /tasks` route that stores tasks in MongoDB.

Now we want to retrieve those tasks.

We will build two GET APIs:

```text
GET /tasks
    ↓
Get ALL tasks

GET /tasks/:id
    ↓
Get ONE specific task
```

These correspond to the **Read** operation in CRUD.

```text
CRUD

C → Create → POST
R → Read   → GET
U → Update → PUT/PATCH
D → Delete → DELETE
```

---

# 2. How Does Reading Data Work?

The basic flow is:

```text
Client / Postman
       ↓
GET /tasks
       ↓
Express Route
       ↓
Task.find()
       ↓
Mongoose
       ↓
MongoDB
       ↓
Tasks
       ↓
JSON Response
       ↓
Client
```

For one task:

```text
Client
   ↓
GET /tasks/68abc...
   ↓
Express
   ↓
Task.findById(id)
   ↓
MongoDB
   ↓
One Task
   ↓
JSON Response
```

---

# 3. Retrieving All Tasks

We use:

```js
Task.find()
```

`find()` retrieves documents from the MongoDB collection that match the query.

If we don't provide any conditions:

```js
Task.find()
```

it retrieves all tasks.

---

# 4. Create the GET Route

Basic route:

```js
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

Let's understand it line by line.

---

# 5. `app.get("/tasks")`

```js
app.get("/tasks", async (req, res) => {
```

This means:

> When the client sends a GET request to `/tasks`, execute this function.

For example:

```http
GET http://localhost:3000/tasks
```

---

# 6. `Task.find()`

```js
const tasks = await Task.find();
```

This asks Mongoose:

> Find all documents in the Task collection.

For example, MongoDB might contain:

```json
[
  {
    "_id": "101",
    "title": "Learn Node.js",
    "completed": true
  },
  {
    "_id": "102",
    "title": "Learn Express",
    "completed": false
  },
  {
    "_id": "103",
    "title": "Learn MongoDB",
    "completed": false
  }
]
```

Mongoose returns these documents to our application.

---

# 7. Why `await`?

Database operations are asynchronous.

```js
Task.find()
```

doesn't immediately give us the final data.

Therefore:

```js
const tasks = await Task.find();
```

means:

> Wait until MongoDB returns the tasks, then store the result in `tasks`.

The route is therefore marked:

```js
async
```

because we're using:

```js
await
```

---

# 8. Return the Tasks

After retrieving the tasks:

```js
res.json(tasks);
```

sends them to the client as JSON.

The response might be:

```json
[
  {
    "_id": "101",
    "title": "Learn Node.js",
    "completed": true
  },
  {
    "_id": "102",
    "title": "Learn Express",
    "completed": false
  }
]
```

By default, Express sends a successful HTTP response.

You can also explicitly use:

```js
res.status(200).json(tasks);
```

Both are valid.

---

# 9. Error Handling

Database operations can fail.

So we use:

```js
try {
    // database operation
} catch (error) {
    // handle error
}
```

Example:

```js
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

If MongoDB has a problem, the `catch` block handles it.

---

# 10. Why Status Code `500`?

`500` means:

```text
Internal Server Error
```

It is appropriate when the server/database operation fails unexpectedly.

For example:

```text
Express
   ↓
Task.find()
   ↓
MongoDB error
   ↓
catch
   ↓
500 Internal Server Error
```

---

# 11. Retrieving a Single Task

Sometimes we don't want every task.

We want one specific task.

For example:

```http
GET /tasks/68abc123
```

Here:

```text
/tasks/:id
```

contains a dynamic route parameter.

---

# 12. Dynamic Route Parameter

Define the route:

```js
app.get("/tasks/:id", async (req, res) => {

});
```

The `:id` is a route parameter.

If the client requests:

```http
GET /tasks/123
```

then:

```js
req.params.id
```

contains:

```text
123
```

For example:

```js
console.log(req.params.id);
```

could print:

```text
123
```

---

# 13. Using `findById()`

Mongoose provides:

```js
Task.findById(id)
```

to find one document using its MongoDB `_id`.

Our route:

```js
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    res.json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# 14. Understanding the Important Line

This line:

```js
const task = await Task.findById(req.params.id);
```

contains three important pieces:

```text
Task
 ↓
Mongoose Model

findById()
 ↓
Find a document by _id

req.params.id
 ↓
ID received from URL
```

For example:

```http
GET /tasks/68abc123
```

becomes:

```js
req.params.id
```

→

```text
68abc123
```

then:

```js
Task.findById("68abc123")
```

---

# 15. What If the Task Doesn't Exist?

Suppose the client requests:

```http
GET /tasks/999999
```

but there is no task with that ID.

Mongoose will generally return:

```js
null
```

So we should check:

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

---

# 16. Complete Single-Task Route

```js
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

Now we handle three situations:

### Task exists

```text
200 OK
```

### Task doesn't exist

```text
404 Not Found
```

### Database/server error

```text
500 Internal Server Error
```

---

# 17. Important: `return` in the 404 Check

Notice:

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

Why use `return`?

Because we want to stop the route after sending the response.

Without `return`, the code could continue executing.

Think:

```text
Task doesn't exist
       ↓
Send 404
       ↓
STOP route
```

The `return` makes that intention clear.

---

# 18. Complete GET APIs

Now we have:

```js
// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

and:

```js
// Get one task
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
```

---

# 19. Testing `GET /tasks`

First create some tasks using:

```http
POST /tasks
```

For example:

```json
{
  "title": "Learn Node.js",
  "priority": "high"
}
```

Then:

```http
GET http://localhost:3000/tasks
```

You might receive:

```json
[
  {
    "_id": "68abc001",
    "title": "Learn Node.js",
    "completed": false,
    "priority": "high"
  },
  {
    "_id": "68abc002",
    "title": "Learn Express",
    "completed": false,
    "priority": "medium"
  }
]
```

---

# 20. Testing `GET /tasks/:id`

Copy an actual `_id` from the previous response.

For example:

```text
68abc001
```

Then request:

```http
GET http://localhost:3000/tasks/68abc001
```

You should receive:

```json
{
  "_id": "68abc001",
  "title": "Learn Node.js",
  "completed": false,
  "priority": "high"
}
```

---

# 21. Testing a Non-Existing Task

Try:

```http
GET http://localhost:3000/tasks/doesnotexist
```

Depending on the value, Mongoose may throw a CastError because the ID isn't a valid MongoDB ObjectId.

Our current `catch` handles that as:

```text
500 Internal Server Error
```

A more polished API should eventually distinguish:

```text
Invalid ID
    ↓
400 Bad Request

Valid ID but task doesn't exist
    ↓
404 Not Found
```

We'll improve this later when we build proper centralized error handling.

---

# 22. `find()` vs `findById()`

This distinction is extremely important.

## `find()`

```js
Task.find()
```

Returns multiple documents.

Example:

```js
[
  task1,
  task2,
  task3
]
```

Think:

```text
Find ALL
```

---

## `findById()`

```js
Task.findById(id)
```

Returns one document.

Example:

```js
task1
```

Think:

```text
Find ONE using _id
```

---

# 23. Other Mongoose Read Methods

Mongoose provides several useful methods.

### `find()`

```js
Task.find()
```

Find multiple documents.

### `findOne()`

```js
Task.findOne({ priority: "high" })
```

Find the first matching document.

### `findById()`

```js
Task.findById(id)
```

Find one document by `_id`.

For example:

```js
Task.find({ completed: false });
```

could return:

```text
All incomplete tasks
```

while:

```js
Task.findOne({ priority: "high" });
```

returns the first task with high priority.

---

# 24. Understanding the Database Query

When we write:

```js
const tasks = await Task.find();
```

the request flow is:

```text
Express
   ↓
Task.find()
   ↓
Mongoose
   ↓
MongoDB
   ↓
tasks collection
   ↓
Documents
   ↓
Mongoose
   ↓
Express
   ↓
JSON response
```

Mongoose acts as the bridge between our JavaScript application and MongoDB.

---

# 25. Complete Server Example

Assuming we already have our MongoDB connection and `Task` model:

```js
import express from "express";
import Task from "./models/Task.js";

const app = express();

app.use(express.json());

// CREATE
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();

    res.status(201).json(task);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ - all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// READ - single task
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# 26. CRUD Progress

Look how far we've come:

```text
CREATE
   ↓
POST /tasks
   ↓
Task.create() / save()
   ↓
MongoDB
```

and now:

```text
READ ALL
   ↓
GET /tasks
   ↓
Task.find()
   ↓
MongoDB
```

and:

```text
READ ONE
   ↓
GET /tasks/:id
   ↓
Task.findById()
   ↓
MongoDB
```

So currently:

```text
C → CREATE ✅
R → READ   ✅
U → UPDATE ⏳
D → DELETE ⏳
```

---

# 27. The Most Important Code to Remember

### Get all tasks

```js
const tasks = await Task.find();
```

### Get one task

```js
const task = await Task.findById(req.params.id);
```

### Check if task exists

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

### Handle database errors

```js
try {
  // database operation
} catch (error) {
  res.status(500).json({
    message: error.message
  });
}
```

---

# 28. Mental Model

Remember these four pieces:

```text
GET /tasks
     ↓
Task.find()
     ↓
Many documents
     ↓
Array response
```

and:

```text
GET /tasks/:id
     ↓
req.params.id
     ↓
Task.findById(id)
     ↓
One document
     ↓
Object response
```

That's the core of **READ in Mongoose**.

---

# 29. What's Next?

We've completed:

```text
POST /tasks        → CREATE
GET /tasks         → READ ALL
GET /tasks/:id     → READ ONE
```

Next comes **UPDATE**.

We'll learn:

```http
PUT /tasks/:id
```

and:

```http
PATCH /tasks/:id
```

using Mongoose methods such as:

```js
Task.findByIdAndUpdate()
```

We'll also understand:

* PUT vs PATCH
* `new: true`
* `runValidators: true`
* Updating only selected fields
* Handling a missing task
* Testing updates with Postman

After that, we'll implement:

```http
DELETE /tasks/:id
```

and complete the entire MongoDB CRUD API.
