# Mongoose Schema and Model for a Task Management API

## 1. What Are We Building?

We already connected our Express application to MongoDB.

Now we need to tell MongoDB:

> "What should a Task look like?"

For example, a task might be:

```json
{
  "title": "Learn Mongoose",
  "description": "Study schemas and models",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-09-05T10:00:00.000Z"
}
```

We define this structure using a **Mongoose Schema**.

---

# 2. What Is a Schema?

A **schema** is a blueprint that defines the structure and rules for documents.

Think of it like a form:

```text
Task
├── title       → String
├── description → String
├── completed   → Boolean
├── priority    → low / medium / high
└── createdAt   → Date
```

The schema tells Mongoose:

* Which fields are allowed
* What type each field should have
* Which fields are required
* Which values are allowed
* What default values should be used

---

# 3. Why Do We Need a Schema?

MongoDB itself is flexible and doesn't require every document in a collection to have exactly the same structure.

For example, MongoDB could technically contain:

```json
{
  "title": "Learn Node.js"
}
```

and another document:

```json
{
  "name": "John",
  "age": 25
}
```

But for a **Task API**, we want consistency.

We want every task to follow predictable rules.

Mongoose Schema gives us that structure.

```text
Without Schema
      ↓
Flexible data
      ↓
Possible inconsistent data

With Schema
      ↓
Defined structure + validation
      ↓
More consistent application data
```

---

# 4. Create the Task Schema

Create a file:

```text
models/Task.js
```

Example:

```js
import mongoose from "mongoose";

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

Let's understand every field.

---

# 5. `title`

```js
title: {
  type: String,
  required: true
}
```

This says:

> Every task must have a title, and the title must be a string.

Valid:

```json
{
  "title": "Learn Express"
}
```

Invalid:

```json
{
  "title": 123
}
```

And this is missing the required field:

```json
{
  "description": "Learn Express routing"
}
```

---

# 6. `description`

```js
description: {
  type: String
}
```

This field is optional.

For example:

```json
{
  "title": "Learn MongoDB"
}
```

is valid.

You can also provide:

```json
{
  "title": "Learn MongoDB",
  "description": "Study CRUD operations"
}
```

Both are acceptable.

---

# 7. `completed`

```js
completed: {
  type: Boolean,
  default: false
}
```

This field stores whether the task has been completed.

Possible values:

```text
true
false
```

For example:

```json
{
  "title": "Learn Mongoose",
  "completed": true
}
```

If we don't provide `completed`:

```json
{
  "title": "Learn Mongoose"
}
```

Mongoose automatically applies:

```js
completed: false
```

because we specified:

```js
default: false
```

---

# 8. What Is a Default Value?

A default value is automatically assigned when the user doesn't provide a value.

For example:

```js
completed: {
  type: Boolean,
  default: false
}
```

If we create:

```js
const task = new Task({
  title: "Learn MongoDB"
});
```

Mongoose automatically gives:

```js
{
  title: "Learn MongoDB",
  completed: false
}
```

Defaults are useful because we don't have to send every field manually.

---

# 9. `priority`

```js
priority: {
  type: String,
  enum: ["low", "medium", "high"],
  default: "medium"
}
```

This field represents task priority.

Only these values are allowed:

```text
low
medium
high
```

Valid:

```json
{
  "title": "Learn Mongoose",
  "priority": "high"
}
```

Invalid:

```json
{
  "title": "Learn Mongoose",
  "priority": "urgent"
}
```

Mongoose will reject `"urgent"` because it isn't included in the enum.

---

# 10. What Is `enum`?

`enum` restricts a field to a predefined set of values.

Example:

```js
enum: ["low", "medium", "high"]
```

Think:

```text
priority
   │
   ├── low       ✅
   ├── medium    ✅
   ├── high      ✅
   └── urgent    ❌
```

Enums are useful when a field should only contain specific values.

Examples:

```js
status: ["pending", "completed", "cancelled"]
```

or:

```js
role: ["student", "mentor", "admin"]
```

---

# 11. `createdAt`

```js
createdAt: {
  type: Date,
  default: Date.now
}
```

This stores when the task was created.

Notice:

```js
Date.now
```

not:

```js
Date.now()
```

We give Mongoose the function so it can call it when the default value is needed.

When a task is created, Mongoose generates the current date.

Example:

```json
{
  "title": "Learn Mongoose",
  "createdAt": "2026-09-05T10:30:00.000Z"
}
```

---

# 12. Schema vs Document

This distinction is extremely important.

### Schema

Defines the structure:

```js
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});
```

Think:

```text
Schema = Blueprint
```

### Document

Actual data stored in MongoDB:

```json
{
  "title": "Learn Mongoose",
  "completed": false
}
```

Think:

```text
Document = Actual object/data
```

So:

```text
Schema
  ↓
Blueprint

Document
  ↓
Actual data created using the blueprint
```

---

# 13. Creating a Mongoose Model

A schema by itself isn't normally what we use to perform CRUD operations.

We create a **Model** from the schema.

```js
const Task = mongoose.model("Task", taskSchema);
```

Now:

```text
taskSchema
     ↓
mongoose.model()
     ↓
Task
```

The model gives us methods for interacting with MongoDB.

For example:

```js
Task.create()
Task.find()
Task.findById()
Task.findByIdAndUpdate()
Task.findByIdAndDelete()
```

---

# 14. Understanding `mongoose.model()`

```js
mongoose.model("Task", taskSchema);
```

There are two important parts:

```js
mongoose.model("Task", taskSchema);
                  ↑          ↑
                name       schema
```

### First argument

```js
"Task"
```

This is the model name.

### Second argument

```js
taskSchema
```

This is the schema that defines the structure.

Then we store the resulting model:

```js
const Task = mongoose.model("Task", taskSchema);
```

Now `Task` is our JavaScript interface for working with Task documents.

---

# 15. Export the Model

We want to use the model in other files.

So:

```js
export default Task;
```

Complete `models/Task.js`:

```js
import mongoose from "mongoose";

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

const Task = mongoose.model("Task", taskSchema);

export default Task;
```

---

# 16. Project Structure

Our project can now look like:

```text
task-api/
│
├── models/
│   └── Task.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

Later, as our application grows, we'll organize it further:

```text
task-api/
│
├── controllers/
│   └── taskController.js
│
├── models/
│   └── Task.js
│
├── routes/
│   └── taskRoutes.js
│
├── middleware/
│   └── errorMiddleware.js
│
├── config/
│   └── db.js
│
├── .env
├── server.js
└── package.json
```

But don't worry about all of that yet.

---

# 17. Testing the Model Without Saving

We can create a Task object using the model:

```js
const task = new Task({
  title: "Learn Mongoose",
  description: "Study schemas and models",
  priority: "high"
});
```

Then:

```js
console.log(task);
```

This creates a Mongoose document in memory.

**It does NOT save it to MongoDB yet.**

This distinction is important.

```text
new Task(...)
      ↓
Mongoose document in memory
      ↓
NOT saved to MongoDB
```

To save it, we would eventually use:

```js
await task.save();
```

or:

```js
await Task.create(...)
```

---

# 18. Test Route

We can create a test route in `server.js`.

```js
import express from "express";
import Task from "./models/Task.js";

const app = express();

app.use(express.json());

app.get("/test-task", (req, res) => {
  const task = new Task({
    title: "Learn Mongoose",
    description: "Study schemas and models",
    priority: "high"
  });

  res.json(task);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

Now send:

```http
GET http://localhost:3000/test-task
```

You should receive something similar to:

```json
{
  "title": "Learn Mongoose",
  "description": "Study schemas and models",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-09-05T10:30:00.000Z",
  "_id": "..."
}
```

Notice that we didn't provide:

```js
completed
```

but it still appears:

```json
"completed": false
```

because of:

```js
default: false
```

We also didn't provide:

```js
createdAt
```

but Mongoose generated it because of:

```js
default: Date.now
```

---

# 19. Why Is `_id` Appearing?

You may notice:

```json
"_id": "68..."
```

We didn't define `_id` ourselves.

MongoDB/Mongoose automatically gives each document a unique identifier.

For example:

```json
{
  "_id": "68babc123...",
  "title": "Learn Mongoose"
}
```

This ID is extremely important when performing operations on a specific task.

For example:

```http
GET /tasks/:id
```

or:

```http
PATCH /tasks/:id
```

The ID tells the API which task we want to work with.

---

# 20. Testing Schema Validation

Let's intentionally provide an invalid priority:

```js
const task = new Task({
  title: "Learn Mongoose",
  priority: "urgent"
});
```

Our schema says:

```js
enum: ["low", "medium", "high"]
```

Therefore:

```text
urgent
  ↓
Not allowed
  ↓
Validation error
```

Similarly, if we don't provide a title:

```js
const task = new Task({
  priority: "high"
});
```

Mongoose knows:

```js
title: {
  required: true
}
```

so the document fails validation when validation/save is performed.

---

# 21. Important: Creating a Document vs Saving a Document

There are two different things:

### Create object

```js
const task = new Task({
  title: "Learn Express"
});
```

This creates a Mongoose document in memory.

### Save document

```js
await task.save();
```

This sends the document to MongoDB.

So:

```text
new Task()
     ↓
Create document in memory
     ↓
task.save()
     ↓
MongoDB
```

Alternatively:

```js
await Task.create({
  title: "Learn Express"
});
```

does creation + saving in one operation.

---

# 22. `new Task()` vs `Task.create()`

### `new Task()`

```js
const task = new Task({
  title: "Learn MongoDB"
});

await task.save();
```

Two steps:

```text
1. Create document
2. Save document
```

### `Task.create()`

```js
const task = await Task.create({
  title: "Learn MongoDB"
});
```

One operation:

```text
Create + Save
```

For normal API creation, you'll frequently see:

```js
await Task.create(req.body);
```

---

# 23. Complete Test Example With Database Connection

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

app.get("/test-task", (req, res) => {
  const task = new Task({
    title: "Learn Mongoose",
    description: "Study schemas and models",
    priority: "high"
  });

  res.json(task);
});

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
```

Test:

```http
GET http://localhost:3000/test-task
```

This demonstrates that:

```text
Express
   ↓
Task Model
   ↓
Task Schema
   ↓
Validation + Defaults
   ↓
JSON Response
```

---

# 24. But Is the Task Stored in MongoDB?

**No.**

This route:

```js
app.get("/test-task", (req, res) => {
  const task = new Task({
    title: "Learn Mongoose"
  });

  res.json(task);
});
```

only creates a document in memory.

It does not execute:

```js
await task.save();
```

Therefore MongoDB doesn't receive the document.

This is useful for testing our schema/model.

---

# 25. When We Actually Save It

Later, our POST route will look like:

```js
app.post("/tasks", async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json(task);
});
```

Now:

```text
POST /tasks
     ↓
req.body
     ↓
Task.create()
     ↓
Mongoose Schema
     ↓
Validation
     ↓
MongoDB
     ↓
Saved document
     ↓
JSON response
```

This is the beginning of our real CRUD API.

---

# 26. MongoDB Collection

When we use:

```js
const Task = mongoose.model("Task", taskSchema);
```

Mongoose uses the model to work with a MongoDB collection, conventionally based on the model name.

For a model named:

```text
Task
```

the collection will typically be:

```text
tasks
```

So the relationship is:

```text
Task Schema
     ↓
Task Model
     ↓
tasks collection
     ↓
MongoDB documents
```

---

# 27. Schema → Model → Document

This is one of the most important concepts in Mongoose.

Remember:

```text
SCHEMA
   ↓
Defines structure
   ↓
MODEL
   ↓
Provides database interface
   ↓
DOCUMENT
   ↓
Actual task data
   ↓
MONGODB
```

Example:

```js
const taskSchema = new mongoose.Schema({
  title: String
});
```

↓

```js
const Task = mongoose.model("Task", taskSchema);
```

↓

```js
const task = new Task({
  title: "Learn Mongoose"
});
```

↓

```text
MongoDB
```

---

# 28. Final Mental Model

Think about it like this:

```text
Schema
= Rules / Blueprint

Model
= Tool / Interface

Document
= Actual Data

MongoDB
= Where the data lives
```

Or even simpler:

```text
Schema → "What should a task look like?"

Model → "How do I work with tasks?"

Document → "Here is one actual task."

MongoDB → "Store the task here."
```

---

# 29. Key Takeaways

### Schema

Defines:

* Fields
* Data types
* Required fields
* Defaults
* Enums
* Validation rules

### Model

Created from the schema:

```js
const Task = mongoose.model("Task", taskSchema);
```

Used for database operations:

```js
Task.create()
Task.find()
Task.findById()
Task.findByIdAndUpdate()
Task.findByIdAndDelete()
```

### Document

An actual instance of the model:

```js
const task = new Task({
  title: "Learn Mongoose"
});
```

### Save

Actually sends the document to MongoDB:

```js
await task.save();
```

or:

```js
await Task.create({...});
```

---

# 30. What Comes Next?

Now we have:

```text
✅ Express
✅ MongoDB connection
✅ Mongoose
✅ Task Schema
✅ Task Model
```

The next logical step is to build the actual **Create + Read API**:

```text
POST /tasks
     ↓
Create task
     ↓
MongoDB

GET /tasks
     ↓
Get all tasks
     ↓
MongoDB

GET /tasks/:id
     ↓
Get one task
     ↓
MongoDB
```

After that we'll add:

```text
PATCH /tasks/:id
DELETE /tasks/:id
```

and finally have our complete **MongoDB-backed CRUD Task API**.
