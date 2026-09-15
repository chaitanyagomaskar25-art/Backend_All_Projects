# Resource-Based Routes in Express.js

## 1. What are Resource-Based Routes?

**Resource-based routing** means designing API routes around **resources** rather than actions.

A resource represents something meaningful in our application.

Examples:

```text
/users
/tasks
/products
/orders
/students
/posts
```

For a **Task Management API**, the resource is:

```text
tasks
```

So instead of creating routes like:

```text
/getTasks
/getTaskById
/deleteTask
```

we use:

```text
/tasks
/tasks/:id
```

The **HTTP method** tells us what operation we want to perform.

```text
GET    /tasks       → Get tasks
POST   /tasks       → Create task
GET    /tasks/:id   → Get one task
PUT    /tasks/:id   → Update task
DELETE /tasks/:id   → Delete task
```

---

# 2. Collection and Individual Resource

Resource-based APIs usually have two important route patterns.

## Collection Route

```text
/tasks
```

This represents the **entire collection of tasks**.

For example:

```http
GET /tasks
```

means:

> Give me all tasks.

---

## Individual Resource Route

```text
/tasks/:id
```

This represents **one specific task**.

For example:

```http
GET /tasks/2
```

means:

> Give me the task whose ID is 2.

So:

```text
/tasks
    ↓
Collection

/tasks/:id
    ↓
Individual Resource
```

---

# 3. Setting Up the Express Server

First, install Express if you haven't already:

```bash
npm install express
```

Create a file:

```text
server.js
```

Then:

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

# 4. Understanding the Code

### Import Express

```js
const express = require("express");
```

This imports the Express framework.

---

### Create Express Application

```js
const app = express();
```

`app` represents our Express application.

We use it to define:

```text
Routes
Middleware
Server configuration
```

---

### Define Port

```js
const PORT = 3000;
```

Our server will run on port `3000`.

The server URL becomes:

```text
http://localhost:3000
```

---

# 5. Why `express.json()`?

Add:

```js
app.use(express.json());
```

This middleware allows Express to understand JSON request bodies.

For example, a client might send:

```json
{
    "title": "Learn Express",
    "completed": false
}
```

With:

```js
app.use(express.json());
```

we can access it using:

```js
req.body
```

This becomes especially important when creating and updating tasks.

---

# 6. Creating Sample Task Data

For now, instead of using MongoDB, we can use an array.

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

Our data looks like:

```text
tasks
│
├── Task 1
│     id: 1
│     title: Learn Node.js
│     completed: true
│
├── Task 2
│     id: 2
│     title: Learn Express.js
│     completed: false
│
└── Task 3
      id: 3
      title: Learn MongoDB
      completed: false
```

This array is acting like a **temporary database**.

Later, we'll replace it with MongoDB.

---

# 7. Creating the Collection Route

Now let's create:

```text
GET /tasks
```

This route should return all tasks.

```js
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});
```

The complete flow is:

```text
Client
   ↓
GET /tasks
   ↓
Express
   ↓
Find matching route
   ↓
Return tasks
   ↓
JSON Response
```

---

# 8. Complete Code So Far

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

app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 9. Testing the Collection Route

Start the server:

```bash
node server.js
```

You should see:

```text
Server running on port 3000
```

Now open:

```text
http://localhost:3000/tasks
```

You should receive:

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

You can also test the endpoint using Postman.

---

# 10. Creating an Individual Resource Route

Now suppose we want only one task.

We can create:

```text
GET /tasks/:id
```

Here:

```text
:id
```

is a **route parameter**.

Example:

```text
/tasks/1
/tasks/2
/tasks/3
```

The value changes depending on which task we want.

---

# 11. Accessing the Route Parameter

Express gives us route parameters through:

```js
req.params
```

Example:

```js
app.get("/tasks/:id", (req, res) => {

    console.log(req.params);

});
```

If we request:

```text
GET /tasks/2
```

we get:

```js
req.params
```

as:

```js
{
    id: "2"
}
```

Notice that the value is a **string**.

---

# 12. Finding a Task by ID

We can use JavaScript's `find()` method.

```js
app.get("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    res.json(task);

});
```

Let's break this down.

### Get ID

```js
const id = Number(req.params.id);
```

If the URL is:

```text
/tasks/2
```

then:

```js
req.params.id
```

is:

```text
"2"
```

We convert it to:

```text
2
```

using:

```js
Number()
```

---

### Find Task

```js
const task = tasks.find(task => task.id === id);
```

This searches the array.

For:

```text
id = 2
```

it finds:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

---

# 13. Handling a Task That Doesn't Exist

What happens if the user requests:

```text
GET /tasks/100
```

There is no task with ID `100`.

The `find()` method returns:

```js
undefined
```

We should not simply return that.

Instead, return:

```text
404 Not Found
```

---

# 14. Implementing 404 Error Handling

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

Now:

```text
GET /tasks/2
```

returns:

```json
{
    "id": 2,
    "title": "Learn Express.js",
    "completed": false
}
```

But:

```text
GET /tasks/100
```

returns:

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

# 15. Why `return` is Used

Notice:

```js
if (!task) {

    return res.status(404).json({
        message: "Task not found"
    });

}
```

The `return` is important because it stops the function after sending the error response.

Without `return`, the code could continue executing and try to send another response.

Think:

```text
Task doesn't exist
      ↓
Send 404 response
      ↓
STOP
```

---

# 16. Complete Resource-Based Task API

Our complete code now looks like:

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

// Get all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

// Get one task
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

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

# 17. Testing the API

We now have two endpoints.

## Get All Tasks

```http
GET http://localhost:3000/tasks
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

## Get One Task

```http
GET http://localhost:3000/tasks/2
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

## Task Doesn't Exist

```http
GET http://localhost:3000/tasks/100
```

Response:

```http
404 Not Found
```

```json
{
    "message": "Task not found"
}
```

---

# 18. Understanding the Route Structure

Our API has:

```text
/tasks
```

and:

```text
/tasks/:id
```

Think of it like this:

```text
                    TASK RESOURCE
                         │
                 ┌───────┴───────┐
                 ↓               ↓
              /tasks        /tasks/:id
                 │               │
                 ↓               ↓
             Collection       Individual
                 │               │
                 ↓               ↓
             All tasks       One task
```

---

# 19. Why Not Use Action-Based Routes?

You might see APIs like:

```text
/getTasks
/getTask/1
/createTask
/deleteTask/1
```

This approach puts the action inside the URL.

REST-style APIs generally avoid this.

Instead:

```text
GET    /tasks
GET    /tasks/1
POST   /tasks
DELETE /tasks/1
```

The URL identifies the **resource**.

The HTTP method identifies the **operation**.

```text
URL
 ↓
What resource?

HTTP Method
 ↓
What operation?
```

---

# 20. Resource + HTTP Method

This is the key idea.

Suppose our resource is:

```text
/tasks
```

Then:

```text
GET /tasks
```

means:

> Read all tasks.

```text
POST /tasks
```

means:

> Create a task.

```text
GET /tasks/10
```

means:

> Read task 10.

```text
PUT /tasks/10
```

means:

> Update task 10.

```text
DELETE /tasks/10
```

means:

> Delete task 10.

The same resource URL can support multiple operations because the HTTP method changes.

---

# 21. Full CRUD Resource Design

For our Task API, the final structure could be:

| Method | Endpoint     | Purpose                 |
| ------ | ------------ | ----------------------- |
| GET    | `/tasks`     | Get all tasks           |
| POST   | `/tasks`     | Create a task           |
| GET    | `/tasks/:id` | Get one task            |
| PUT    | `/tasks/:id` | Update a task           |
| PATCH  | `/tasks/:id` | Partially update a task |
| DELETE | `/tasks/:id` | Delete a task           |

This is a clean REST-style resource structure.

---

# 22. API Request Flow

When the client sends:

```http
GET /tasks/2
```

the process is:

```text
Client
  ↓
GET /tasks/2
  ↓
Express Router
  ↓
Match /tasks/:id
  ↓
Get req.params.id
  ↓
Find task
  ↓
Task exists?
  │
  ├── YES → 200 + Task
  │
  └── NO  → 404 + Error
```

---

# 23. Why Resource-Based Routing Matters

Resource-based routing provides several benefits.

### 1. Predictability

Developers can easily guess API endpoints.

```text
/tasks
/tasks/:id
```

---

### 2. Consistency

Different resources can follow the same pattern.

```text
/users
/users/:id

/tasks
/tasks/:id

/products
/products/:id
```

---

### 3. Readability

The API clearly communicates what resource is being accessed.

```text
GET /tasks/10
```

is easy to understand.

---

### 4. Scalability

As the application grows, you can add more resources without changing the basic design.

```text
/users
/tasks
/products
/orders
/comments
```

---

### 5. Easier Frontend Integration

Frontend developers can easily understand how to communicate with the backend.

For example:

```text
GET    /tasks
POST   /tasks
DELETE /tasks/10
```

The API behavior is predictable.

---

# 24. Resource-Based API Mental Model

Remember this simple rule:

```text
RESOURCE + HTTP METHOD = API OPERATION
```

For example:

```text
/tasks + GET
       ↓
Get tasks

/tasks + POST
       ↓
Create task

/tasks/10 + GET
       ↓
Get task 10

/tasks/10 + DELETE
       ↓
Delete task 10
```

---

# 25. Important Concepts Learned

From this example, you've learned several important Express concepts:

```text
Express Server
      ↓
express.json()
      ↓
Sample Data
      ↓
Collection Route
      ↓
Individual Resource Route
      ↓
Route Parameters
      ↓
Finding Resources
      ↓
404 Error Handling
      ↓
Testing with Postman
```

---

# Quick Revision

### Resource

A meaningful entity in your application.

```text
tasks
users
products
students
```

### Collection Endpoint

```text
/tasks
```

Represents all tasks.

### Individual Resource Endpoint

```text
/tasks/:id
```

Represents one task.

### Route Parameter

```text
/tasks/:id
        ↑
    route parameter
```

Access it with:

```js
req.params.id
```

### Error Handling

If the resource doesn't exist:

```js
return res.status(404).json({
    message: "Task not found"
});
```

### REST Pattern

```text
GET    /tasks       → Read all
POST   /tasks       → Create
GET    /tasks/:id   → Read one
PUT    /tasks/:id   → Update
PATCH  /tasks/:id   → Partial update
DELETE /tasks/:id   → Delete
```

## The Golden Rule

> **Keep URLs focused on resources, and use HTTP methods to describe the action.**

Instead of:

```text
/getTasks
/createTask
/deleteTask/10
```

prefer:

```text
GET    /tasks
POST   /tasks
DELETE /tasks/10
```

That small design choice is one of the foundations of clean REST APIs.
