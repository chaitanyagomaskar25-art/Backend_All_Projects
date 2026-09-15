# Updating Data in MongoDB with PUT

In this lesson, we complete another important part of our backend API: **updating existing data** in MongoDB.

We will use:

* Node.js
* Express.js
* MongoDB
* Mongoose
* HTTP `PUT`
* `findByIdAndUpdate()`

---

# 1. What Does Updating Data Mean?

Suppose our database contains this task:

```json
{
  "_id": "64abc123...",
  "title": "Learn MongoDB",
  "description": "Learn basic MongoDB concepts",
  "completed": false,
  "priority": "medium"
}
```

Later, the user completes the task.

We want to change:

```json
"completed": false
```

to:

```json
"completed": true
```

This is called an **UPDATE operation**.

The complete CRUD flow is:

```text
C → Create  → POST
R → Read    → GET
U → Update  → PUT / PATCH
D → Delete  → DELETE
```

We have already learned:

```text
CREATE ✅
READ   ✅
UPDATE ⬅️ Current lesson
DELETE ⏳
```

---

# 2. PUT Request

For updating an existing resource, we can use the HTTP `PUT` method.

Our route will look like:

```text
PUT /tasks/:id
```

For example:

```text
PUT /tasks/64abc123
```

Here:

```text
/tasks
```

is the resource.

```text
/:id
```

identifies which task we want to update.

---

# 3. Why Do We Need the ID?

Suppose our database contains:

```text
Task 1 → Learn MongoDB
Task 2 → Learn Express
Task 3 → Learn Node.js
```

If the client says:

```text
Update task
```

the server doesn't know **which task** should be updated.

Therefore, we provide the task ID:

```text
PUT /tasks/64abc123
```

Now the server knows:

```text
I need to update the task whose _id is 64abc123.
```

---

# 4. Route Parameters

Our Express route:

```js
app.put("/tasks/:id", async (req, res) => {
```

The `:id` is a **route parameter**.

We access it using:

```js
req.params.id
```

For example:

```text
PUT /tasks/64abc123
```

Then:

```js
req.params.id
```

will contain:

```text
64abc123
```

---

# 5. Mongoose `findByIdAndUpdate()`

Mongoose provides a convenient method:

```js
findByIdAndUpdate()
```

It allows us to:

1. Find a document using its `_id`
2. Update its values
3. Return the updated document if requested

Basic syntax:

```js
Model.findByIdAndUpdate(id, updateData, options)
```

For our Task model:

```js
Task.findByIdAndUpdate(
  id,
  updateData,
  options
);
```

---

# 6. Understanding the Three Arguments

Consider:

```js
const task = await Task.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);
```

There are three important arguments.

## Argument 1 — ID

```js
req.params.id
```

This tells Mongoose which document to find.

---

## Argument 2 — Updated Data

```js
req.body
```

This contains the new values.

For example:

```json
{
  "title": "Learn Mongoose",
  "completed": true,
  "priority": "high"
}
```

---

## Argument 3 — Options

```js
{ new: true }
```

This tells Mongoose:

> Return the updated document instead of the old document.

---

# 7. Why `{ new: true }`?

This is very important.

Suppose the database contains:

```json
{
  "title": "Learn MongoDB",
  "completed": false
}
```

We send:

```json
{
  "completed": true
}
```

Without:

```js
{ new: true }
```

Mongoose normally returns the **document before the update**.

With:

```js
{ new: true }
```

Mongoose returns:

```json
{
  "title": "Learn MongoDB",
  "completed": true
}
```

So remember:

```js
{ new: true }
```

means:

```text
Give me the updated document.
```

---

# 8. Complete PUT Route

Here is the basic implementation:

```js
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
```

---

# 9. Let's Understand It Line by Line

## Step 1 — Create PUT Route

```js
app.put("/tasks/:id", async (req, res) => {
```

This means:

```text
PUT /tasks/:id
```

will execute this function.

---

## Step 2 — Start try-catch

```js
try {
```

Database operations can fail.

For example:

* Invalid MongoDB ID
* Database connection problem
* Validation error
* Other Mongoose errors

So we use:

```js
try {
   // database operation
} catch (error) {
   // handle error
}
```

---

# 10. Find and Update the Task

```js
const task = await Task.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);
```

Let's break it down:

```js
req.params.id
```

→ Which task?

```js
req.body
```

→ What should change?

```js
{ new: true }
```

→ Return the updated task.

The complete flow is:

```text
Request
   ↓
Get ID from req.params
   ↓
Get new values from req.body
   ↓
findByIdAndUpdate()
   ↓
MongoDB
   ↓
Updated document
```

---

# 11. Checking If the Task Exists

After updating:

```js
if (!task) {
```

Why?

Because `findByIdAndUpdate()` returns:

```text
document
```

if the task exists, but:

```text
null
```

if no document matches the ID.

So we check:

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

---

# 12. Why 404?

HTTP status:

```text
404 Not Found
```

means the requested resource doesn't exist.

For example:

```text
PUT /tasks/123456789
```

If there is no task with that ID:

```json
{
  "message": "Task not found"
}
```

Response:

```text
404
```

This is better than returning:

```text
200 OK
```

because the requested resource wasn't found.

---

# 13. Returning the Updated Task

If the task exists:

```js
res.status(200).json(task);
```

We send:

```text
200 OK
```

and return the updated task.

Example:

```json
{
  "_id": "64abc123",
  "title": "Learn Mongoose",
  "description": "Practice CRUD",
  "completed": true,
  "priority": "high"
}
```

---

# 14. Error Handling

Our route uses:

```js
catch (error) {
  res.status(400).json({
    message: error.message
  });
}
```

If something goes wrong, the error is caught.

For example, an invalid MongoDB ID could cause a Mongoose casting error.

The API can return:

```json
{
  "message": "Cast to ObjectId failed..."
}
```

with:

```text
400 Bad Request
```

For a production API, we would usually improve this by using **centralized error handling** and distinguishing validation errors, invalid IDs, and database/server failures.

---

# 15. Testing PUT in Postman

Let's test our API.

Suppose we have:

```text
Task ID:
64abc123456789
```

In Postman:

### Method

```text
PUT
```

### URL

```text
http://localhost:3000/tasks/64abc123456789
```

### Body

Select:

```text
Body
→ raw
→ JSON
```

Send:

```json
{
  "title": "Learn Mongoose",
  "completed": true,
  "priority": "high"
}
```

Then click:

```text
Send
```

---

# 16. Request Flow

The complete request looks like:

```text
Postman
   │
   │ PUT /tasks/64abc123
   │
   │ JSON body
   ↓
Express
   │
   ↓
PUT /tasks/:id
   │
   ├── req.params.id
   │
   └── req.body
   ↓
Task.findByIdAndUpdate()
   ↓
Mongoose
   ↓
MongoDB
   ↓
Updated document
   ↓
Express
   ↓
JSON Response
   ↓
Postman
```

---

# 17. PUT vs PATCH

This is an important concept.

Both can be used to update data, but they have different meanings.

## PUT

Generally means:

> Replace/update the resource with the provided representation.

Example:

```http
PUT /tasks/123
```

```json
{
  "title": "Learn MongoDB",
  "description": "Learn CRUD",
  "completed": true,
  "priority": "high"
}
```

---

## PATCH

Generally means:

> Update only specific fields.

Example:

```http
PATCH /tasks/123
```

```json
{
  "completed": true
}
```

Only `completed` needs to change.

---

# 18. Important Note About `findByIdAndUpdate()`

By default, Mongoose does not necessarily run all schema validators during update in the same way as document creation.

If you want update validation, you should use:

```js
{
  new: true,
  runValidators: true
}
```

Example:

```js
const task = await Task.findByIdAndUpdate(
  req.params.id,
  req.body,
  {
    new: true,
    runValidators: true
  }
);
```

This is a better approach when your schema contains rules such as:

```js
priority: {
  type: String,
  enum: ["low", "medium", "high"]
}
```

Now an invalid value such as:

```json
{
  "priority": "super-high"
}
```

can be rejected by Mongoose validation.

---

# 19. Recommended PUT Route

A more robust version is:

```js
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
```

---

# 20. CRUD API So Far

We now have:

| Operation | HTTP Method | Route        | Mongoose              |
| --------- | ----------- | ------------ | --------------------- |
| Create    | POST        | `/tasks`     | `create()` / `save()` |
| Read all  | GET         | `/tasks`     | `find()`              |
| Read one  | GET         | `/tasks/:id` | `findById()`          |
| Update    | PUT         | `/tasks/:id` | `findByIdAndUpdate()` |
| Delete    | DELETE      | `/tasks/:id` | Coming next           |

---

# 21. Complete Backend Flow

At this point, we have learned the complete core flow of a backend API.

```text
Client
  ↓
HTTP Request
  ↓
Express Server
  ↓
Route
  ↓
Controller / Handler
  ↓
Mongoose Model
  ↓
MongoDB
  ↓
Mongoose
  ↓
Controller / Handler
  ↓
HTTP Response
  ↓
Client
```

For example:

```text
POST /tasks
     ↓
Create task
     ↓
MongoDB

GET /tasks
     ↓
Read tasks
     ↓
MongoDB

PUT /tasks/:id
     ↓
Update task
     ↓
MongoDB

DELETE /tasks/:id
     ↓
Delete task
     ↓
MongoDB
```

---

# 22. Backend API Development Process

The complete process we've followed is:

### Step 1 — Create Node.js project

```bash
npm init -y
```

### Step 2 — Install dependencies

```bash
npm install express mongoose dotenv
```

### Step 3 — Configure Express

```js
import express from "express";

const app = express();

app.use(express.json());
```

### Step 4 — Configure environment variables

```env
MONGO_URL=your_mongodb_connection_string
PORT=3000
```

### Step 5 — Connect MongoDB

```js
await mongoose.connect(process.env.MONGO_URL);
```

### Step 6 — Create Schema

```js
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  priority: String
});
```

### Step 7 — Create Model

```js
const Task = mongoose.model("Task", taskSchema);
```

### Step 8 — Create Routes

```text
POST   /tasks
GET    /tasks
GET    /tasks/:id
PUT    /tasks/:id
DELETE /tasks/:id
```

### Step 9 — Implement CRUD

```text
CREATE → POST
READ   → GET
UPDATE → PUT/PATCH
DELETE → DELETE
```

### Step 10 — Test with Postman

Test:

```text
Request
   ↓
Express
   ↓
Mongoose
   ↓
MongoDB
   ↓
Response
```

---

# 23. Mental Model

Remember this simple formula:

```text
URL tells WHAT resource
ID tells WHICH resource
HTTP method tells WHAT operation
Body tells WHAT DATA
Mongoose performs database operation
MongoDB stores the data
Response tells the client the result
```

For example:

```http
PUT /tasks/123
```

means:

```text
PUT
 ↓
I want to update something

/tasks
 ↓
The resource is tasks

/123
 ↓
I want task number 123

req.body
 ↓
Here are the new values
```

---

# 24. Key Takeaways

* `PUT` is used for updating an existing resource.
* Route:

```text
PUT /tasks/:id
```

* Route parameters are accessed using:

```js
req.params.id
```

* Request body is accessed using:

```js
req.body
```

* Mongoose provides:

```js
findByIdAndUpdate()
```

* Basic syntax:

```js
Model.findByIdAndUpdate(id, updateData, options)
```

* `{ new: true }` returns the updated document.
* `{ runValidators: true }` enables schema validation during the update.
* If the task doesn't exist, return:

```text
404 Not Found
```

* Handle errors using:

```js
try...catch
```

* `PUT` and `PATCH` are both update methods, but their intended semantics differ.
* We now have **Create + Read + Update** in our MongoDB API.
* The remaining core CRUD operation is **Delete**.

---

# 25. CRUD Mental Map

```text
                CRUD
                 │
      ┌──────────┼──────────┐
      ↓          ↓          ↓
   CREATE       READ       UPDATE       DELETE
      │          │           │             │
     POST        GET      PUT/PATCH       DELETE
      │          │           │             │
      ↓          ↓           ↓             ↓
   create()     find()   findByIdAnd     deleteOne()
                         Update()
```

The next step is:

```text
DELETE /tasks/:id
```

where we'll learn how to remove an existing MongoDB document safely.
