# Create and Read APIs with Express.js

## 1. Introduction

In a backend API, two of the most basic operations are:

```text
C → Create
R → Read
```

These are part of **CRUD**:

```text
CRUD
│
├── C → Create
├── R → Read
├── U → Update
└── D → Delete
```

In this lesson, we will implement:

```text
GET  /tasks       → Read all tasks
GET  /tasks/:id   → Read one task
POST /tasks       → Create a new task
```

We will use an array as temporary storage instead of MongoDB.

---

# 2. Setting Up the Express Server

First, install Express:

```bash
npm install express
```

Create:

```text
server.js
```

Basic server:

```js
const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 3. Understanding `express.json()`

We use:

```js
app.use(express.json());
```

This is middleware that allows Express to parse incoming JSON request bodies.

For example, Postman might send:

```json
{
    "title": "Learn Express",
    "completed": false
}
```

Express makes this data available through:

```js
req.body
```

Without JSON parsing middleware, Express will not automatically parse JSON request bodies.

---

# 4. Creating Sample Task Data

For now, we'll store tasks inside an array.

```js
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

Our temporary data looks like:

```text
tasks
│
├── Task 1
│   ├── id: 1
│   ├── title: Learn Node.js
│   └── completed: true
│
├── Task 2
│   ├── id: 2
│   ├── title: Learn Express.js
│   └── completed: false
│
└── Task 3
    ├── id: 3
    ├── title: Learn MongoDB
    └── completed: false
```

This array is acting as a **temporary in-memory database**.

---

# 5. Read All Tasks

To retrieve all tasks, create a GET endpoint:

```js
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});
```

The endpoint is:

```http
GET /tasks
```

The server returns the complete task array.

---

# 6. Understanding the GET Request

When the client sends:

```http
GET http://localhost:3000/tasks
```

Express matches:

```js
app.get("/tasks", ...)
```

Then:

```js
res.status(200).json(tasks);
```

sends the tasks back to the client.

Flow:

```text
Client
  ↓
GET /tasks
  ↓
Express
  ↓
/tasks route
  ↓
tasks array
  ↓
200 OK
  ↓
JSON response
```

---

# 7. Example Response

The client receives:

```json
[
    {
        "id": 1,
        "title": "Learn Node.js",
        "completed": true
    },
    {
        "id": 2,
        "title": "Learn Express.js",
        "completed": false
    },
    {
        "id": 3,
        "title": "Learn MongoDB",
        "completed": false
    }
]
```

The status code is:

```text
200 OK
```

because the request was successful.

---

# 8. Read a Single Task

To get one specific task, use a route parameter:

```text
/tasks/:id
```

Example:

```js
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
```

---

# 9. Understanding `req.params`

Suppose the client requests:

```http
GET /tasks/2
```

Our route is:

```js
/tasks/:id
```

Therefore:

```js
req.params.id
```

contains:

```text
"2"
```

Because route parameters are received as strings, we convert it into a number:

```js
const id = Number(req.params.id);
```

Now:

```text
"2"
 ↓
2
```

---

# 10. Finding the Task

We use JavaScript's `find()` method:

```js
const task = tasks.find(task => task.id === id);
```

Suppose:

```text
id = 2
```

The array is searched:

```text
Task 1 → id 1 → No
Task 2 → id 2 → YES
Task 3 → id 3 → No
```

The result is:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

---

# 11. Handling a Missing Task

What if the client requests:

```http
GET /tasks/100
```

There is no task with ID `100`.

The `find()` method returns:

```js
undefined
```

So we check:

```js
if (!task) {

    return res.status(404).json({
        message: "Task not found"
    });

}
```

The server responds:

```text
404 Not Found
```

with:

```json
{
    "message": "Task not found"
}
```

---

# 12. Creating a New Task

Now let's implement the **Create** operation.

We use:

```text
POST /tasks
```

The client sends the new task data in the request body.

Example:

```json
{
    "title": "Learn REST API",
    "completed": false
}
```

---

# 13. POST Route

Create the POST endpoint:

```js
app.post("/tasks", (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});
```

---

# 14. Understanding `req.body`

The client sends:

```json
{
    "title": "Learn REST API",
    "completed": false
}
```

Because we have:

```js
app.use(express.json());
```

we can access:

```js
req.body
```

which contains:

```js
{
    title: "Learn REST API",
    completed: false
}
```

Therefore:

```js
req.body.title
```

gives:

```text
Learn REST API
```

and:

```js
req.body.completed
```

gives:

```text
false
```

---

# 15. Creating the New Task Object

We create:

```js
const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: req.body.completed
};
```

Suppose the array currently contains 3 tasks.

Then:

```js
tasks.length
```

is:

```text
3
```

Therefore:

```js
tasks.length + 1
```

becomes:

```text
4
```

The new task becomes:

```json
{
    "id": 4,
    "title": "Learn REST API",
    "completed": false
}
```

---

# 16. Adding the Task to the Array

We use:

```js
tasks.push(newTask);
```

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
Task 3
Task 4
```

The new task is now stored in memory.

---

# 17. Why Status Code `201`?

When a resource is successfully created, we commonly return:

```text
201 Created
```

So:

```js
res.status(201).json(newTask);
```

means:

> The task was successfully created, and here is the newly created resource.

---

# 18. Complete Create and Read API

Now let's combine everything.

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

// GET - Read all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

// GET - Read one task
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

// POST - Create a task
app.post("/tasks", (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

# 19. Testing with Postman

Now let's test our API.

Start the server:

```bash
node server.js
```

You should see:

```text
Server running on port 3000
```

---

# 20. Test GET All Tasks

In Postman:

```text
Method:
GET

URL:
http://localhost:3000/tasks
```

Click:

```text
Send
```

Expected:

```text
200 OK
```

Response:

```json
[
    {
        "id": 1,
        "title": "Learn Node.js",
        "completed": true
    },
    {
        "id": 2,
        "title": "Learn Express.js",
        "completed": false
    },
    {
        "id": 3,
        "title": "Learn MongoDB",
        "completed": false
    }
]
```

---

# 21. Test GET Single Task

In Postman:

```text
Method:
GET

URL:
http://localhost:3000/tasks/2
```

Expected:

```text
200 OK
```

Response:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

---

# 22. Test Non-Existent Task

Try:

```text
GET http://localhost:3000/tasks/100
```

Expected:

```text
404 Not Found
```

Response:

```json
{
    "message": "Task not found"
}
```

This confirms our error handling works.

---

# 23. Test POST — Create Task

In Postman:

```text
Method:
POST

URL:
http://localhost:3000/tasks
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
    "title": "Learn REST API",
    "completed": false
}
```

Click:

```text
Send
```

Expected:

```text
201 Created
```

Response:

```json
{
    "id": 4,
    "title": "Learn REST API",
    "completed": false
}
```

---

# 24. Verify the New Task

Now send:

```http
GET /tasks
```

You should see:

```json
[
    {
        "id": 1,
        "title": "Learn Node.js",
        "completed": true
    },
    {
        "id": 2,
        "title": "Learn Express.js",
        "completed": false
    },
    {
        "id": 3,
        "title": "Learn MongoDB",
        "completed": false
    },
    {
        "id": 4,
        "title": "Learn REST API",
        "completed": false
    }
]
```

The new task was added to the array.

---

# 25. Complete API Structure

We currently have:

```text
TASK API
│
├── GET /tasks
│      ↓
│   Get all tasks
│
├── GET /tasks/:id
│      ↓
│   Get one task
│
└── POST /tasks
       ↓
    Create task
```

In CRUD terminology:

```text
POST /tasks
     ↓
CREATE

GET /tasks
     ↓
READ ALL

GET /tasks/:id
     ↓
READ ONE
```

We will later add:

```text
PUT /tasks/:id
     ↓
UPDATE

DELETE /tasks/:id
     ↓
DELETE
```

---

# 26. Request Data vs URL Data

There are two important places where our API receives information.

### Route Parameter

```text
/tasks/10
```

Access using:

```js
req.params.id
```

Used to identify a specific resource.

---

### Request Body

```json
{
    "title": "Learn Express",
    "completed": false
}
```

Access using:

```js
req.body
```

Used to send data to the server.

So:

```text
/tasks/10
    ↓
req.params

Request JSON
    ↓
req.body
```

---

# 27. Why This is Resource-Based

Notice that we don't create action-based URLs.

We don't use:

```text
/createTask
/getTasks
/getTaskById
```

Instead:

```text
POST /tasks
GET /tasks
GET /tasks/:id
```

The resource is:

```text
tasks
```

The HTTP method tells us what to do:

```text
POST → Create
GET  → Read
```

This is the foundation of RESTful API design.

---

# 28. Important Limitation of the Array

Our tasks are stored in:

```js
const tasks = [];
```

This is **in-memory storage**.

That means the data exists only while the Node.js process is running.

Suppose we create:

```text
Task 4
```

Then stop the server:

```text
Ctrl + C
```

Start it again:

```bash
node server.js
```

Task 4 will disappear.

Why?

Because the array is recreated from the original code:

```js
const tasks = [
    ...
];
```

---

# 29. In-Memory Storage vs Database

### Current Approach

```text
Express
   ↓
JavaScript Array
   ↓
Memory
```

Problems:

```text
❌ Data disappears when server restarts
❌ Not suitable for real applications
❌ Cannot easily share data between servers
❌ Limited scalability
```

### Real Application

Later we'll use:

```text
Express
   ↓
Mongoose
   ↓
MongoDB
   ↓
Persistent Database
```

Then data survives server restarts.

---

# 30. ID Generation Limitation

We used:

```js
id: tasks.length + 1
```

This is fine for learning, but it has limitations.

For example:

```text
Task 1
Task 2
Task 3
Task 4
```

If Task 4 is deleted:

```text
Task 1
Task 2
Task 3
```

then:

```js
tasks.length + 1
```

gives:

```text
4
```

That may cause ID conflicts depending on how deletion and creation are implemented.

Real databases provide more reliable unique identifiers.

MongoDB, for example, commonly uses:

```text
ObjectId
```

---

# 31. Full Request Flow

### Create Task

```text
Postman
   ↓
POST /tasks
   ↓
Express Router
   ↓
req.body
   ↓
Create newTask
   ↓
tasks.push()
   ↓
201 Created
   ↓
JSON Response
```

### Read All Tasks

```text
Postman
   ↓
GET /tasks
   ↓
Express Router
   ↓
tasks array
   ↓
200 OK
   ↓
JSON Response
```

### Read One Task

```text
Postman
   ↓
GET /tasks/2
   ↓
req.params.id
   ↓
Find task
   ↓
Task exists?
   │
   ├── YES → 200 OK
   │
   └── NO  → 404 Not Found
```

---

# 32. Status Codes Used

| Status Code | Meaning   | Used Here          |
| ----------- | --------- | ------------------ |
| `200`       | OK        | Successful GET     |
| `201`       | Created   | Successful POST    |
| `404`       | Not Found | Task doesn't exist |

Remember:

```text
GET successful
     ↓
200 OK

POST successful
     ↓
201 Created

Resource doesn't exist
     ↓
404 Not Found
```

---

# 33. Key Concepts Learned

This lesson introduced several important concepts:

```text
Express Server
      ↓
express.json()
      ↓
Request Body
      ↓
GET Route
      ↓
POST Route
      ↓
Route Parameters
      ↓
Array.find()
      ↓
Array.push()
      ↓
Status Codes
      ↓
Error Handling
      ↓
Postman Testing
```

---

# 34. Quick Revision

### Read All

```http
GET /tasks
```

```js
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});
```

---

### Read One

```http
GET /tasks/:id
```

```js
const id = Number(req.params.id);

const task = tasks.find(task => task.id === id);
```

---

### Create

```http
POST /tasks
```

```js
const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: req.body.completed
};

tasks.push(newTask);

res.status(201).json(newTask);
```

---

# 35. CRUD Progress

At this stage:

```text
CRUD
│
├── CREATE ✅
│     POST /tasks
│
├── READ   ✅
│     GET /tasks
│     GET /tasks/:id
│
├── UPDATE ⏳
│     PUT /tasks/:id
│
└── DELETE ⏳
      DELETE /tasks/:id
```

So you've now completed the **Create + Read** part of CRUD.

The next logical step is **Update + Delete**, where you'll learn how `PUT`, `PATCH`, and `DELETE` modify the resource and how to handle cases like invalid IDs and missing tasks.
