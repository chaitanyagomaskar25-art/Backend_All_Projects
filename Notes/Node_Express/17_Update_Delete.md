# Update and Delete APIs with Express.js

## 1. Introduction

In the previous lesson, we implemented:

```text
CREATE → POST /tasks
READ   → GET /tasks
READ   → GET /tasks/:id
```

Now we will implement:

```text
UPDATE → PUT /tasks/:id
DELETE → DELETE /tasks/:id
```

After this, our Task API will support complete **CRUD functionality**.

```text
CRUD
│
├── C → Create → POST
├── R → Read   → GET
├── U → Update → PUT
└── D → Delete → DELETE
```

---

# 2. Complete CRUD API

Our final endpoints will be:

| Method | Endpoint     | Operation     |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| GET    | `/tasks/:id` | Get one task  |
| POST   | `/tasks`     | Create task   |
| PUT    | `/tasks/:id` | Update task   |
| DELETE | `/tasks/:id` | Delete task   |

The resource is:

```text
/tasks
```

The HTTP method determines the operation.

---

# 3. Setting Up the Server

We'll continue using Express and an in-memory array.

```js
const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: true
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: false
    },
    {
        id: 3,
        title: "Learn MongoDB",
        completed: false
    }
];
```

---

# 4. Update Operation

To update an existing task, we'll use:

```http
PUT /tasks/:id
```

For example:

```http
PUT /tasks/2
```

means:

> Update task with ID 2.

The client can send the new information in the JSON request body.

Example:

```json
{
    "title": "Master Express.js",
    "completed": true
}
```

---

# 5. Creating the PUT Route

```js
app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.title = req.body.title;
    task.completed = req.body.completed;

    res.status(200).json(task);

});
```

---

# 6. Understanding the PUT Route

Let's break it down.

### Step 1 — Get the ID

```js
const id = Number(req.params.id);
```

If the request is:

```text
PUT /tasks/2
```

then:

```js
req.params.id
```

contains:

```text
"2"
```

We convert it to:

```text
2
```

---

### Step 2 — Find the Task

```js
const task = tasks.find(task => task.id === id);
```

This searches the array for the task.

For:

```text
id = 2
```

the result is:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

---

# 7. Handling a Missing Task

Suppose the client sends:

```http
PUT /tasks/100
```

There is no task with ID `100`.

So:

```js
task
```

will be:

```js
undefined
```

We handle this using:

```js
if (!task) {

    return res.status(404).json({
        message: "Task not found"
    });

}
```

The client receives:

```text
404 Not Found
```

```json
{
    "message": "Task not found"
}
```

---

# 8. Updating the Task

Once we know the task exists:

```js
task.title = req.body.title;
task.completed = req.body.completed;
```

Suppose the original task is:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

The request body is:

```json
{
    "title": "Master Express.js",
    "completed": true
}
```

After the update:

```json
{
    "id": 2,
    "title": "Master Express.js",
    "completed": true
}
```

---

# 9. Why Use `req.body`?

The URL identifies **which resource** should be updated:

```text
/tasks/2
     ↑
     ID
```

The request body contains **the new data**:

```json
{
    "title": "Master Express.js",
    "completed": true
}
```

So:

```text
URL
 ↓
Which task?

Request Body
 ↓
What should it become?
```

This is a very important pattern in API development.

---

# 10. Delete Operation

To delete a task, we use:

```http
DELETE /tasks/:id
```

For example:

```http
DELETE /tasks/2
```

means:

> Delete task with ID 2.

---

# 11. Creating the DELETE Route

```js
app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });

});
```

---

# 12. Understanding `findIndex()`

For deletion, we need the **position/index** of the task in the array.

We use:

```js
const index = tasks.findIndex(task => task.id === id);
```

Suppose our array is:

```text
Index    ID
  0       1
  1       2
  2       3
```

If we request:

```text
DELETE /tasks/2
```

then:

```js
findIndex()
```

returns:

```text
1
```

because task ID `2` is at array index `1`.

---

# 13. Why Check `index === -1`?

If `findIndex()` cannot find the task, it returns:

```text
-1
```

For example:

```text
DELETE /tasks/100
```

There is no task with ID `100`.

Therefore:

```js
index === -1
```

is true.

We return:

```js
return res.status(404).json({
    message: "Task not found"
});
```

---

# 14. Removing the Task with `splice()`

Once we know the index, we can remove the task:

```js
tasks.splice(index, 1);
```

The first argument:

```text
index
```

tells JavaScript where to start.

The second argument:

```text
1
```

tells JavaScript how many elements to remove.

Example:

```text
Before:

Index 0 → Task 1
Index 1 → Task 2
Index 2 → Task 3
```

Run:

```js
tasks.splice(1, 1);
```

After:

```text
Index 0 → Task 1
Index 1 → Task 3
```

Task 2 has been removed.

---

# 15. Complete PUT and DELETE Routes

### PUT

```js
app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.title = req.body.title;
    task.completed = req.body.completed;

    res.status(200).json(task);

});
```

### DELETE

```js
app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });

});
```

---

# 16. Complete CRUD Server

Now our entire Task API looks like this:

```js
const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: true
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: false
    },
    {
        id: 3,
        title: "Learn MongoDB",
        completed: false
    }
];

// GET - Get all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

// GET - Get one task
app.get("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    res.status(200).json(task);

});

// POST - Create task
app.post("/tasks", (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});

// PUT - Update task
app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.title = req.body.title;
    task.completed = req.body.completed;

    res.status(200).json(task);

});

// DELETE - Delete task
app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

# 17. Testing PUT with Postman

First, check your tasks:

```http
GET http://localhost:3000/tasks
```

Suppose you see:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

Now update it.

### Request

```http
PUT http://localhost:3000/tasks/2
```

Go to:

```text
Body
 ↓
raw
 ↓
JSON
```

Send:

```json
{
    "title": "Master Express.js",
    "completed": true
}
```

Expected response:

```text
200 OK
```

```json
{
    "id": 2,
    "title": "Master Express.js",
    "completed": true
}
```

---

# 18. Verify the Update

Send:

```http
GET http://localhost:3000/tasks/2
```

You should receive:

```json
{
    "id": 2,
    "title": "Master Express.js",
    "completed": true
}
```

This confirms that the update worked.

---

# 19. Testing DELETE with Postman

First, check which tasks exist:

```http
GET http://localhost:3000/tasks
```

Suppose you want to delete task `3`.

Send:

```http
DELETE http://localhost:3000/tasks/3
```

Expected:

```text
200 OK
```

Response:

```json
{
    "message": "Task deleted successfully",
    "task": {
        "id": 3,
        "title": "Learn MongoDB",
        "completed": false
    }
}
```

---

# 20. Verify the Delete

Now send:

```http
GET http://localhost:3000/tasks
```

Task 3 should no longer appear.

Before:

```text
Task 1
Task 2
Task 3
```

After:

```text
Task 1
Task 2
```

---

# 21. Testing Error Handling

Try updating a task that doesn't exist:

```http
PUT /tasks/100
```

Response:

```text
404 Not Found
```

```json
{
    "message": "Task not found"
}
```

Try deleting a task that doesn't exist:

```http
DELETE /tasks/100
```

Response:

```text
404 Not Found
```

```json
{
    "message": "Task not found"
}
```

This makes the API predictable for clients.

---

# 22. Complete CRUD Flow

Now our API supports:

```text
                     TASK API
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
      CREATE            READ            UPDATE
        │                │                │
        ↓                ↓                ↓
 POST /tasks       GET /tasks       PUT /tasks/:id
                   GET /tasks/:id
                         │
                         ↓
                       DELETE
                         │
                         ↓
                  DELETE /tasks/:id
```

Or simply:

```text
POST   /tasks       → CREATE
GET    /tasks       → READ ALL
GET    /tasks/:id   → READ ONE
PUT    /tasks/:id   → UPDATE
DELETE /tasks/:id   → DELETE
```

---

# 23. CRUD Status Codes

| Operation | Method | Endpoint     | Success Status  |
| --------- | ------ | ------------ | --------------- |
| Create    | POST   | `/tasks`     | `201 Created`   |
| Read all  | GET    | `/tasks`     | `200 OK`        |
| Read one  | GET    | `/tasks/:id` | `200 OK`        |
| Update    | PUT    | `/tasks/:id` | `200 OK`        |
| Delete    | DELETE | `/tasks/:id` | `200 OK`        |
| Not found | Any    | `/tasks/:id` | `404 Not Found` |

---

# 24. PUT vs POST vs DELETE

### POST

Used to **create** a new resource.

```http
POST /tasks
```

```text
Create a new task
```

---

### PUT

Used to **update/replace** an existing resource.

```http
PUT /tasks/2
```

```text
Update task 2
```

---

### DELETE

Used to **remove** an existing resource.

```http
DELETE /tasks/2
```

```text
Delete task 2
```

---

# 25. Important Difference: `find()` vs `findIndex()`

### `find()`

Returns the actual object:

```js
const task = tasks.find(task => task.id === id);
```

Example:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

Useful for:

```text
GET
PUT
```

---

### `findIndex()`

Returns the position:

```js
const index = tasks.findIndex(task => task.id === id);
```

Example:

```text
1
```

Useful for:

```text
DELETE
```

because `splice()` needs the array index.

---

# 26. Data Persistence Problem

Our API currently stores data in:

```js
const tasks = [];
```

This is **in-memory storage**.

Therefore, if we:

```text
Create task
     ↓
Update task
     ↓
Delete task
     ↓
Restart server
```

all changes are lost.

When Node.js restarts, the original array is created again.

---

# 27. Why We Need a Database

Real applications need **persistent storage**.

Instead of:

```text
Express
   ↓
Array
   ↓
RAM
```

we eventually want:

```text
Express
   ↓
Mongoose
   ↓
MongoDB
   ↓
Database
```

Then:

```text
Server restart
      ↓
Data still exists
```

This will be the next major step when we connect our Express API to MongoDB.

---

# 28. What You Have Learned

At this point, you've built a complete basic CRUD API.

You now understand:

```text
Express
 ↓
Routes
 ↓
HTTP Methods
 ↓
Route Parameters
 ↓
Request Body
 ↓
CRUD
 ↓
Status Codes
 ↓
Error Handling
 ↓
Postman Testing
```

You've also learned useful JavaScript methods:

```text
find()
 ↓
Find an object

findIndex()
 ↓
Find an object's position

push()
 ↓
Add an object

splice()
 ↓
Remove an object
```

---

# 29. Final Revision

Remember this pattern:

```text
CREATE
POST /tasks
     ↓
req.body
     ↓
tasks.push()
     ↓
201 Created
```

```text
READ
GET /tasks
     ↓
Return all tasks
     ↓
200 OK
```

```text
READ ONE
GET /tasks/:id
     ↓
req.params.id
     ↓
find()
     ↓
200 / 404
```

```text
UPDATE
PUT /tasks/:id
     ↓
req.params.id
     ↓
find()
     ↓
req.body
     ↓
Update task
     ↓
200 / 404
```

```text
DELETE
DELETE /tasks/:id
     ↓
req.params.id
     ↓
findIndex()
     ↓
splice()
     ↓
200 / 404
```

## The Complete CRUD Mental Model

```text
              RESOURCE: /tasks
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      POST           GET          PUT
        ↓            ↓            ↓
     CREATE         READ        UPDATE
        │            │            │
        └────────────┼────────────┘
                     ↓
                   DELETE
                     ↓
                   DELETE
```

> **CRUD is simply the complete lifecycle of a resource: Create it, Read it, Update it, and Delete it.**
