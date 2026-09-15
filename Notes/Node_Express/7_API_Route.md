# Creating Multiple API Routes in Express.js

## 1. Introduction

In Express.js, **routing** allows us to define how our server responds to different URLs and HTTP methods.

For example:

```text
GET /
     ↓
Home page

GET /api
     ↓
API information

GET /api/tasks
     ↓
Task data

GET /api/users
     ↓
User data
```

Each route can return different information depending on the URL requested.

---

# 2. What is a Route?

A **route** defines how the server responds when a client makes a request to a particular URL using a particular HTTP method.

Basic structure:

```js
app.get("/path", (req, res) => {

    // Response

});
```

For example:

```js
app.get("/", (req, res) => {

    res.send("Welcome to the server");

});
```

Here:

```text
app.get()
    ↓
HTTP method

"/"
    ↓
URL path

(req, res)
    ↓
Request and Response

res.send()
    ↓
Server response
```

---

# 3. Setting Up Express

First, install Express:

```bash
npm install express
```

Create a file:

```text
roots-demo.js
```

Then import Express:

```js
const express = require("express");
```

Create an Express application:

```js
const app = express();
```

Set the port:

```js
const PORT = 3000;
```

---

# 4. Creating the Home Route

Let's create our first route:

```js
app.get("/", (req, res) => {

    res.send("Welcome to the Express server");

});
```

When we visit:

```text
http://localhost:3000/
```

the server responds:

```text
Welcome to the Express server
```

This route is useful for confirming that the server is running.

---

# 5. Creating an API Information Route

Now let's create:

```text
/api
```

We can return JSON information about our API.

```js
app.get("/api", (req, res) => {

    res.json({
        name: "Task API",
        version: "1.0.0",
        description: "A simple Task Management API"
    });

});
```

When we visit:

```text
http://localhost:3000/api
```

we receive:

```json
{
    "name": "Task API",
    "version": "1.0.0",
    "description": "A simple Task Management API"
}
```

---

# 6. Why Use JSON for APIs?

APIs commonly communicate using **JSON**.

JSON stands for:

```text
JavaScript Object Notation
```

Example:

```json
{
    "id": 1,
    "name": "Chaitanya"
}
```

JSON is easy for both frontend and backend applications to understand.

For example:

```text
React Frontend
      ↓
HTTP Request
      ↓
Express Backend
      ↓
JSON Response
      ↓
React Frontend
```

---

# 7. Creating the `/api/tasks` Route

Now let's create a route that returns task data.

```js
app.get("/api/tasks", (req, res) => {

    res.json([
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
    ]);

});
```

Now visit:

```text
http://localhost:3000/api/tasks
```

The server returns:

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

# 8. Creating the `/api/users` Route

We can create another route for users.

```js
app.get("/api/users", (req, res) => {

    res.json([
        {
            id: 1,
            name: "Rahul",
            email: "rahul@example.com"
        },
        {
            id: 2,
            name: "Priya",
            email: "priya@example.com"
        },
        {
            id: 3,
            name: "Amit",
            email: "amit@example.com"
        }
    ]);

});
```

Now visit:

```text
http://localhost:3000/api/users
```

The response will be:

```json
[
    {
        "id": 1,
        "name": "Rahul",
        "email": "rahul@example.com"
    },
    {
        "id": 2,
        "name": "Priya",
        "email": "priya@example.com"
    },
    {
        "id": 3,
        "name": "Amit",
        "email": "amit@example.com"
    }
]
```

---

# 9. Complete Example

Our complete `roots-demo.js` file:

```js
const express = require("express");

const app = express();

const PORT = 3000;

// Home route
app.get("/", (req, res) => {

    res.send("Welcome to the Express server");

});

// API information
app.get("/api", (req, res) => {

    res.json({
        name: "Task API",
        version: "1.0.0",
        description: "A simple Task Management API"
    });

});

// Tasks API
app.get("/api/tasks", (req, res) => {

    res.json([
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
    ]);

});

// Users API
app.get("/api/users", (req, res) => {

    res.json([
        {
            id: 1,
            name: "Rahul",
            email: "rahul@example.com"
        },
        {
            id: 2,
            name: "Priya",
            email: "priya@example.com"
        },
        {
            id: 3,
            name: "Amit",
            email: "amit@example.com"
        }
    ]);

});

// Start server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

# 10. Running the Server

Run:

```bash
node roots-demo.js
```

You should see:

```text
Server running on port 3000
```

Now the server is available at:

```text
http://localhost:3000
```

---

# 11. Testing Each Route

You can test these routes directly in your browser.

### Home

```text
GET /
```

URL:

```text
http://localhost:3000/
```

Response:

```text
Welcome to the Express server
```

---

### API Information

```text
GET /api
```

URL:

```text
http://localhost:3000/api
```

Response:

```json
{
    "name": "Task API",
    "version": "1.0.0",
    "description": "A simple Task Management API"
}
```

---

### Tasks

```text
GET /api/tasks
```

URL:

```text
http://localhost:3000/api/tasks
```

Response:

```json
[
    {
        "id": 1,
        "title": "Learn Node.js",
        "completed": true
    }
]
```

---

### Users

```text
GET /api/users
```

URL:

```text
http://localhost:3000/api/users
```

Response:

```json
[
    {
        "id": 1,
        "name": "Rahul",
        "email": "rahul@example.com"
    }
]
```

---

# 12. Understanding How Express Chooses a Route

Suppose the client sends:

```text
GET /api/tasks
```

Express checks its routes:

```text
GET /
       ❌

GET /api
       ❌

GET /api/tasks
       ✅
```

Express finds the matching route:

```js
app.get("/api/tasks", ...)
```

and executes its callback.

The flow is:

```text
Client
  ↓
GET /api/tasks
  ↓
Express
  ↓
Find matching route
  ↓
Execute route handler
  ↓
Return JSON
```

---

# 13. Different URLs, Different Responses

Our server now behaves differently depending on the URL.

```text
                    Express Server
                         │
        ┌────────────────┼─────────────────┐
        ↓                ↓                 ↓
       "/"             "/api"         "/api/tasks"
        ↓                ↓                 ↓
      Text          API Information      Tasks
                                          
                         │
                         ↓
                    "/api/users"
                         ↓
                       Users
```

This is the basic concept of **routing**.

---

# 14. Route vs Endpoint

These terms are closely related.

### Route

A route is the code that defines how the server handles a request.

```js
app.get("/api/tasks", (req, res) => {

    res.json(tasks);

});
```

### Endpoint

An endpoint is a specific URL + HTTP method that a client can interact with.

```text
GET /api/tasks
```

So:

```text
Route
 ↓
Server-side implementation

Endpoint
 ↓
Client-accessible API location
```

---

# 15. Why `/api` is Commonly Used

You will often see APIs structured like:

```text
/api/users
/api/tasks
/api/products
/api/orders
```

The `/api` prefix makes it clear that these routes are API endpoints.

For example:

```text
/api/users
```

means:

> This endpoint provides user-related API functionality.

While:

```text
/
```

might represent the main website or server home route.

---

# 16. Resource-Based API Structure

Our routes are already moving toward **resource-based API design**.

We have:

```text
/api/tasks
/api/users
```

The resources are:

```text
tasks
users
```

Instead of action-based routes such as:

```text
/api/getTasks
/api/getUsers
```

we use:

```text
GET /api/tasks
GET /api/users
```

The HTTP method describes the operation.

---

# 17. Adding Individual Resources

Later, we can extend:

```text
/api/tasks
```

into:

```text
/api/tasks/:id
```

For example:

```text
GET /api/tasks/1
```

means:

> Get task with ID 1.

Similarly:

```text
GET /api/users/5
```

means:

> Get user with ID 5.

This gives us a predictable resource structure:

```text
/api/tasks
/api/tasks/:id

/api/users
/api/users/:id
```

---

# 18. Multiple HTTP Methods

So far, we have only used:

```js
app.get()
```

But Express supports many HTTP methods.

```text
GET
POST
PUT
PATCH
DELETE
```

For example:

```js
app.get("/api/tasks", ...)
```

Read tasks.

```js
app.post("/api/tasks", ...)
```

Create a task.

```js
app.put("/api/tasks/:id", ...)
```

Update a task.

```js
app.delete("/api/tasks/:id", ...)
```

Delete a task.

Therefore:

```text
HTTP Method + URL
        ↓
     Operation
```

---

# 19. API Route Structure

A common REST API structure looks like:

```text
/api
│
├── /tasks
│    │
│    ├── GET
│    ├── POST
│    │
│    └── /:id
│         ├── GET
│         ├── PUT
│         ├── PATCH
│         └── DELETE
│
└── /users
     │
     ├── GET
     ├── POST
     │
     └── /:id
          ├── GET
          ├── PUT
          ├── PATCH
          └── DELETE
```

This structure becomes extremely useful as an application grows.

---

# 20. Why Routing Matters

Routing is important because it allows us to organize backend functionality.

Without routing, we wouldn't have a clean way to distinguish between:

```text
Users
Tasks
Products
Orders
Authentication
Payments
```

With routing:

```text
/api/users
/api/tasks
/api/products
/api/orders
/api/auth
/api/payments
```

Each route can handle a specific responsibility.

---

# 21. Important Concepts Learned

In this lesson, you learned:

```text
Express Application
        ↓
Routes
        ↓
URL Paths
        ↓
HTTP Methods
        ↓
Route Handlers
        ↓
Responses
        ↓
JSON APIs
```

You also learned how to create:

```text
GET /
GET /api
GET /api/tasks
GET /api/users
```

---

# 22. Quick Revision

### Create Express App

```js
const express = require("express");

const app = express();
```

### Create a GET Route

```js
app.get("/api/tasks", (req, res) => {

    res.json(tasks);

});
```

### Send Text

```js
res.send("Hello");
```

### Send JSON

```js
res.json({
    message: "Hello"
});
```

### Start Server

```js
app.listen(3000, () => {

    console.log("Server running");

});
```

---

# 23. Final Mental Model

Remember:

```text
CLIENT
  │
  │ GET /api/tasks
  ↓
EXPRESS SERVER
  │
  │ Match route
  ↓
ROUTE HANDLER
  │
  │ Process request
  ↓
JSON RESPONSE
  │
  ↓
CLIENT
```

And the most important idea:

> **Routing is the process of deciding which backend code should handle a request based on its HTTP method and URL.**

For example:

```text
GET /api/tasks
        ↓
Tasks route
        ↓
Return tasks
```

```text
GET /api/users
        ↓
Users route
        ↓
Return users
```

That simple mechanism is the foundation on which larger **Express.js REST APIs** are built.
