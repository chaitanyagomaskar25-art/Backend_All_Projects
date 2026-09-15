# Creating and Saving Data in MongoDB with Express and Mongoose

## 1. What Are We Building?

Previously, we created:

* Express server
* MongoDB connection
* Mongoose schema
* Mongoose model

Now we will create our first real **POST API**.

The goal is:

```text
Postman / Frontend
       ↓
POST /tasks
       ↓
Express
       ↓
req.body
       ↓
Task Model
       ↓
Mongoose validation
       ↓
MongoDB
       ↓
Saved Task
       ↓
Response
```

---

# 2. POST Request for Creating Data

When a client wants to create a new task, it sends:

```http
POST /tasks
```

with JSON data:

```json
{
  "title": "Learn Mongoose",
  "description": "Practice MongoDB CRUD",
  "priority": "high"
}
```

Our backend receives this data through:

```js
req.body
```

---

# 3. Import the Task Model

Suppose our project looks like:

```text
task-api/
│
├── models/
│   └── Task.js
│
├── .env
├── server.js
└── package.json
```

Inside `server.js`:

```js
import Task from "./models/Task.js";
```

Now our Express application can use the Task model.

---

# 4. Enable JSON Request Data

Make sure Express has:

```js
app.use(express.json());
```

Without this middleware, Express won't automatically parse JSON request bodies.

For example, when Postman sends:

```json
{
  "title": "Learn Express"
}
```

we want:

```js
req.body
```

to contain:

```js
{
  title: "Learn Express"
}
```

---

# 5. Create the POST Route

Basic structure:

```js
app.post("/tasks", async (req, res) => {

});
```

Let's break this down:

```text
app.post()
   ↓
POST request

"/tasks"
   ↓
URL endpoint

async (req, res)
   ↓
Route handler
```

---

# 6. Why Do We Use `async`?

Database operations take time.

For example:

```js
await task.save();
```

The application has to communicate with MongoDB over the network.

Therefore, database operations are asynchronous.

We use:

```js
async
```

and:

```js
await
```

to handle them cleanly.

Example:

```js
app.post("/tasks", async (req, res) => {

    const task = new Task(req.body);

    await task.save();

});
```

---

# 7. Creating a Task From `req.body`

The client sends:

```json
{
  "title": "Learn Mongoose",
  "description": "Practice MongoDB",
  "priority": "high"
}
```

Express gives us this through:

```js
req.body
```

We can create a Mongoose document:

```js
const task = new Task(req.body);
```

So:

```text
req.body
   ↓
new Task()
   ↓
Mongoose Document
```

For example:

```js
const task = new Task({
  title: "Learn Mongoose",
  description: "Practice MongoDB",
  priority: "high"
});
```

But instead of hardcoding the values, we use:

```js
const task = new Task(req.body);
```

This allows the client to dynamically provide the data.

---

# 8. Why Is `new Task(req.body)` Powerful?

Imagine 100 different users send requests.

User 1:

```json
{
  "title": "Learn Node.js",
  "priority": "high"
}
```

User 2:

```json
{
  "title": "Practice React",
  "priority": "medium"
}
```

User 3:

```json
{
  "title": "Build Portfolio",
  "priority": "low"
}
```

We don't need to manually write:

```js
const task = new Task({
  title: "Learn Node.js"
});
```

for every request.

Instead:

```js
const task = new Task(req.body);
```

The request determines the data.

---

# 9. Save the Task

Creating:

```js
const task = new Task(req.body);
```

does **not** save the task to MongoDB.

We need:

```js
await task.save();
```

So:

```js
const task = new Task(req.body);

await task.save();
```

Now the document is actually stored in MongoDB.

---

# 10. Very Important Difference

Remember the difference:

### Creating a document

```js
const task = new Task(req.body);
```

means:

> Create a Mongoose document in memory.

### Saving a document

```js
await task.save();
```

means:

> Send the document to MongoDB and store it.

Therefore:

```text
new Task()
     ↓
Document in memory
     ↓
task.save()
     ↓
MongoDB
```

---

# 11. What Happens During `save()`?

Suppose Postman sends:

```json
{
  "title": "Learn Mongoose",
  "priority": "high"
}
```

Our code:

```js
const task = new Task(req.body);

await task.save();
```

Mongoose checks the schema.

Our schema might contain:

```js
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  completed: {
    type: Boolean,
    default: false
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

Mongoose applies the rules.

The resulting document could look like:

```json
{
  "_id": "68b...",
  "title": "Learn Mongoose",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-09-05T10:30:00.000Z"
}
```

Notice:

```text
_id
completed
createdAt
```

were automatically handled.

---

# 12. Mongoose Validation

Before saving, Mongoose validates the document according to the schema.

For example:

```js
title: {
  type: String,
  required: true
}
```

means:

```text
title provided?
     │
   YES → continue
     │
    NO
     ↓
Validation Error
```

Similarly:

```js
priority: {
  type: String,
  enum: ["low", "medium", "high"]
}
```

means:

```text
priority = "high"   ✅

priority = "medium" ✅

priority = "urgent" ❌
```

---

# 13. Complete POST Route

A basic implementation:

```js
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
```

Let's understand the entire route.

---

# 14. `try`

```js
try {
```

We put database operations inside `try`.

Why?

Because operations such as:

```js
await task.save();
```

can fail.

---

# 15. Create the Document

```js
const task = new Task(req.body);
```

The request body becomes a Mongoose document.

---

# 16. Save to MongoDB

```js
await task.save();
```

This actually stores the document.

---

# 17. Return the Created Task

```js
res.status(201).json(task);
```

Why `201`?

Because HTTP status:

```text
201 Created
```

means a new resource was successfully created.

The client receives something like:

```json
{
  "_id": "68b123...",
  "title": "Learn Mongoose",
  "description": "Practice MongoDB CRUD",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-09-05T10:30:00.000Z"
}
```

---

# 18. Why Return the Saved Task?

The database may generate information that the client didn't send.

For example:

```text
_id
createdAt
default values
```

Therefore, returning the saved document allows the frontend to know exactly what was created.

---

# 19. Error Handling

The `catch` block handles errors:

```js
catch (error) {
  res.status(400).json({
    message: error.message
  });
}
```

For example, if the client sends:

```json
{
  "priority": "urgent"
}
```

Mongoose can reject it because:

```js
enum: ["low", "medium", "high"]
```

doesn't allow `"urgent"`.

The API can respond with an error.

---

# 20. Testing With Postman

Start your server:

```bash
node server.js
```

Make sure the terminal shows:

```text
MongoDB connected
Server running on port 3000
```

Then open Postman.

Select:

```text
POST
```

Enter:

```text
http://localhost:3000/tasks
```

Go to:

```text
Body → raw → JSON
```

Send:

```json
{
  "title": "Learn Mongoose",
  "description": "Practice creating documents",
  "priority": "high"
}
```

Click:

```text
Send
```

---

# 21. Expected Response

You should receive something similar to:

```json
{
  "_id": "68b123...",
  "title": "Learn Mongoose",
  "description": "Practice creating documents",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-09-05T10:30:00.000Z"
}
```

The important thing is:

```text
201 Created
```

and the task should now exist in MongoDB.

---

# 22. Verify in MongoDB Atlas

Go to your MongoDB Atlas project.

Open:

```text
Database
   ↓
Browse Collections
```

You should see something similar to:

```text
taskDB
   ↓
tasks
   ↓
Documents
```

And your document:

```json
{
  "_id": "...",
  "title": "Learn Mongoose",
  "description": "Practice creating documents",
  "completed": false,
  "priority": "high",
  "createdAt": "..."
}
```

Now you've successfully stored real data! 🎉

---

# 23. What If We Don't Send `completed`?

Suppose we send:

```json
{
  "title": "Learn MongoDB",
  "priority": "medium"
}
```

We didn't send:

```text
completed
```

But our schema says:

```js
completed: {
  type: Boolean,
  default: false
}
```

So Mongoose automatically adds:

```json
"completed": false
```

---

# 24. What If We Don't Send `priority`?

If our schema says:

```js
priority: {
  type: String,
  enum: ["low", "medium", "high"],
  default: "medium"
}
```

and the client sends:

```json
{
  "title": "Learn MongoDB"
}
```

Mongoose automatically sets:

```json
"priority": "medium"
```

---

# 25. What If We Don't Send `title`?

Our schema says:

```js
title: {
  type: String,
  required: true
}
```

If we send:

```json
{
  "description": "Learn MongoDB"
}
```

Mongoose will reject the document.

The flow becomes:

```text
POST /tasks
     ↓
req.body
     ↓
new Task()
     ↓
Validation
     ↓
title missing
     ↓
Error
     ↓
catch
     ↓
400 Response
```

---

# 26. What If We Send the Wrong Priority?

Request:

```json
{
  "title": "Learn MongoDB",
  "priority": "urgent"
}
```

Schema:

```js
enum: ["low", "medium", "high"]
```

Result:

```text
"urgent"
    ↓
Not in enum
    ↓
Validation Error
    ↓
400 Bad Request
```

This is one of the major benefits of using a schema.

---

# 27. Complete `server.js`

A simple working version:

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";

dotenv.config();

const app = express();

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

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

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
```

---

# 28. Complete Request-Response Flow

When Postman sends:

```http
POST /tasks
```

with:

```json
{
  "title": "Learn Mongoose",
  "priority": "high"
}
```

the complete flow is:

```text
┌─────────────────────┐
│      Postman        │
│                     │
│ POST /tasks         │
│ { title: ... }      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Express        │
│                     │
│ req.body            │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     Task Model      │
│                     │
│ new Task(req.body)  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Mongoose Schema    │
│                     │
│ Validation          │
│ Defaults            │
│ Data types          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      MongoDB        │
│                     │
│ Save document       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Express        │
│                     │
│ 201 + JSON          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Postman        │
│                     │
│ Created Task        │
└─────────────────────┘
```

---

# 29. `new Task()` vs `Task.create()`

There are two common ways to create data.

### Method 1 — `new Task()` + `save()`

```js
const task = new Task(req.body);

await task.save();
```

This is useful when you want to work with the document before saving it.

---

### Method 2 — `Task.create()`

You can also write:

```js
const task = await Task.create(req.body);
```

This creates and saves the document in one operation.

So:

```js
const task = new Task(req.body);
await task.save();
```

is roughly equivalent to:

```js
const task = await Task.create(req.body);
```

For beginners, understanding both is important.

---

# 30. Why Use `save()` Here?

Using:

```js
const task = new Task(req.body);
await task.save();
```

makes the process very clear:

```text
1. Receive data
2. Create document
3. Validate document
4. Save document
5. Return document
```

It helps you understand what Mongoose is doing behind the scenes.

---

# 31. Important Security Note

Although:

```js
new Task(req.body)
```

is convenient, don't blindly accept every field from users in a production application.

For example, if your schema eventually contains:

```js
isAdmin
```

you shouldn't allow users to simply send:

```json
{
  "title": "My Task",
  "isAdmin": true
}
```

and modify fields they aren't supposed to control.

Later, we'll learn about:

* Request validation
* Whitelisting fields
* Authentication
* Authorization
* Sanitization

For our learning Task API, `req.body` is fine because the schema is simple.

---

# 32. Key Concepts to Remember

### `req.body`

Contains data sent by the client.

```js
req.body
```

---

### `new Task(req.body)`

Creates a Mongoose document.

```js
const task = new Task(req.body);
```

---

### `task.save()`

Actually saves the document to MongoDB.

```js
await task.save();
```

---

### `201`

Means:

```text
Created successfully
```

---

### `try/catch`

Handles asynchronous/database errors.

```js
try {
   // database operation
} catch (error) {
   // handle error
}
```

---

# 33. The Big Picture

We've now progressed from:

```text
Express Server
      ↓
MongoDB Connection
```

to:

```text
Express Server
      ↓
MongoDB Connection
      ↓
Schema
      ↓
Model
      ↓
POST /tasks
      ↓
Create Document
      ↓
Save Document
      ↓
MongoDB
```

Our API can now **actually store persistent data**.

---

# 34. Next Step — Reading Data

Creating data is only one part of CRUD.

We've completed:

```text
CREATE ✅
```

Next we'll learn:

```text
READ
```

with:

```http
GET /tasks
```

to retrieve all tasks:

```js
const tasks = await Task.find();
```

and:

```http
GET /tasks/:id
```

to retrieve one task:

```js
const task = await Task.findById(req.params.id);
```

Then we'll complete the full CRUD cycle:

```text
CREATE → POST
READ   → GET
UPDATE → PUT/PATCH
DELETE → DELETE
```

That's when your Task API becomes a proper **MongoDB CRUD backend**.
