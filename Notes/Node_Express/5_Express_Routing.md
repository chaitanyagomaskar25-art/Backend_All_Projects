# Express.js Routing

## 1. What is Routing?

**Routing** means deciding **what should happen when a client sends a request to a particular URL using a particular HTTP method**.

In Express.js, routing is used to define how your server responds to requests such as:

```text
GET     /users
POST    /users
GET     /users/10
PUT     /users/10
DELETE  /users/10
```

Each request can perform a different operation.

### Simple Definition

> **Routing is the process of matching an incoming request to the appropriate code that should handle it.**

---

# 2. Why Do We Need Routing?

Imagine your backend has many features:

```text
Users
Products
Orders
Payments
Authentication
Comments
Posts
```

The client might send requests like:

```text
GET     /users
POST    /users
GET     /products
POST    /orders
GET     /orders/10
POST    /login
```

The server needs to know:

> "Which code should execute for this request?"

That's the job of **routing**.

```text
Client Request
      ↓
   Express
      ↓
   Router
      ↓
Find Matching Route
      ↓
Execute Handler
      ↓
Send Response
```

---

# 3. What is an API Endpoint?

An **API endpoint** is a specific address through which a client can interact with a backend resource or functionality.

For example:

```text
/users
/products
/orders
/login
```

But an endpoint is generally understood together with its **HTTP method**.

For example:

```text
GET /users
```

is different from:

```text
POST /users
```

Even though both use `/users`.

### Why?

Because they represent different operations.

```text
GET /users
    ↓
Get users

POST /users
     ↓
Create a new user
```

So you can think of an API endpoint as:

```text
HTTP Method + URL Path
```

---

# 4. Route vs Endpoint

These terms are closely related but are not exactly the same.

### Route

A **route** is the rule you define in your Express application.

Example:

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get users"
    });
});
```

This tells Express:

> "When a GET request comes to `/users`, execute this function."

### Endpoint

The **endpoint** is the API address that the client interacts with.

```text
GET /users
```

### Easy Way to Remember

```text
Route
 ↓
Server-side rule

Endpoint
 ↓
Client-accessible API address
```

---

# 5. Basic Express Route

A basic Express route looks like this:

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get all users"
    });
});
```

Let's break it down:

```js
app.get("/users", handler);
```

### `app`

The Express application instance.

```js
const app = express();
```

### `.get()`

Specifies that the route should respond to a **GET** request.

### `"/users"`

The URL path.

### `(req, res) => {}`

The route handler.

The handler contains the code that runs when the route matches the request.

---

# 6. How Routing Works

Suppose the client sends:

```http
GET /users
```

Express receives the request.

It checks the routes defined in the application.

For example:

```js
app.get("/products", (req, res) => {
    // Product logic
});

app.get("/users", (req, res) => {
    // User logic
});

app.get("/orders", (req, res) => {
    // Order logic
});
```

Express finds:

```text
GET /users
```

and executes:

```js
(req, res) => {
    // User logic
}
```

The complete flow is:

```text
Client
  │
  │ GET /users
  ↓
Express Server
  │
  ↓
Check Routes
  │
  ↓
Match GET /users
  │
  ↓
Execute Handler
  │
  ↓
Send Response
  │
  ↓
Client
```

---

# 7. HTTP Methods in Express Routing

Express supports different HTTP methods.

The most commonly used are:

| Method | Purpose               |
| ------ | --------------------- |
| GET    | Retrieve data         |
| POST   | Create data           |
| PUT    | Replace/update data   |
| PATCH  | Partially update data |
| DELETE | Delete data           |

---

## GET Route

Used to retrieve data.

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get all users"
    });
});
```

Request:

```http
GET /users
```

Response:

```json
{
    "message": "Get all users"
}
```

---

## POST Route

Used to create data.

```js
app.post("/users", (req, res) => {
    res.json({
        message: "User created"
    });
});
```

Request:

```http
POST /users
```

---

## PUT Route

Used to update/replace a resource.

```js
app.put("/users/:id", (req, res) => {
    res.json({
        message: "User updated"
    });
});
```

Request:

```http
PUT /users/10
```

---

## PATCH Route

Used for partial updates.

```js
app.patch("/users/:id", (req, res) => {
    res.json({
        message: "User partially updated"
    });
});
```

Request:

```http
PATCH /users/10
```

---

## DELETE Route

Used to delete data.

```js
app.delete("/users/:id", (req, res) => {
    res.json({
        message: "User deleted"
    });
});
```

Request:

```http
DELETE /users/10
```

---

# 8. Routes and Endpoints Work Together

Let's say we want to build a user API.

We define these routes:

```js
app.get("/users", getUsers);

app.get("/users/:id", getUser);

app.post("/users", createUser);

app.put("/users/:id", updateUser);

app.delete("/users/:id", deleteUser);
```

This creates several API endpoints:

```text
GET     /users
GET     /users/:id
POST    /users
PUT     /users/:id
DELETE  /users/:id
```

### What Each Does

```text
GET /users
     ↓
Get all users


GET /users/10
     ↓
Get user with ID 10


POST /users
     ↓
Create a new user


PUT /users/10
     ↓
Update user 10


DELETE /users/10
     ↓
Delete user 10
```

---

# 9. Route Parameters

A route can contain a **dynamic value** called a route parameter.

Example:

```js
app.get("/users/:id", (req, res) => {

    console.log(req.params.id);

});
```

Here:

```text
:id
```

is a route parameter.

If the client requests:

```http
GET /users/25
```

Then:

```js
req.params.id
```

will contain:

```text
25
```

Another example:

```js
app.get("/products/:productId", (req, res) => {

    console.log(req.params.productId);

});
```

Request:

```http
GET /products/500
```

Result:

```text
req.params.productId
       ↓
      500
```

---

# 10. Route Parameters vs Query Parameters

These are two different ways of sending information through a URL.

### Route Parameter

```text
/users/25
```

Route:

```js
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
});
```

Access:

```js
req.params.id
```

---

### Query Parameter

```text
/users?id=25
```

Route:

```js
app.get("/users", (req, res) => {
    console.log(req.query.id);
});
```

Access:

```js
req.query.id
```

### Difference

```text
Route Parameter
/users/25
     ↑
Identifies a specific resource


Query Parameter
/users?id=25
      ↑
Provides additional information/options
```

---

# 11. Route Handler

A **route handler** is the function that executes when a route matches the incoming request.

Example:

```js
app.get("/users", (req, res) => {

    res.json({
        message: "Users fetched successfully"
    });

});
```

This function:

```js
(req, res) => {
    res.json({
        message: "Users fetched successfully"
    });
}
```

is the route handler.

It receives:

### `req`

The incoming request.

It contains information such as:

```text
req.params
req.query
req.body
req.headers
req.method
req.url
```

### `res`

The response object.

It allows us to send data back to the client.

For example:

```js
res.json(data);
```

or:

```js
res.status(200).json(data);
```

---

# 12. Routing with Request and Response

Example:

```js
app.get("/students", (req, res) => {

    const students = [
        {
            id: 1,
            name: "Rahul"
        },
        {
            id: 2,
            name: "Aman"
        }
    ];

    res.status(200).json(students);
});
```

Request:

```http
GET /students
```

Flow:

```text
GET /students
      ↓
Express Router
      ↓
Matching Route
      ↓
Route Handler
      ↓
Create/Get Student Data
      ↓
res.json()
      ↓
JSON Response
```

---

# 13. Why Routing Matters in Express APIs

Routing is important because it organizes the backend into **clear API endpoints**.

Without proper routing, it becomes difficult to understand what each URL does.

For example:

```text
/users
/products
/orders
/payments
/posts
/comments
```

Each route can have a specific responsibility.

---

## 13.1 Organization

Routing separates different backend features.

```text
User Routes
    ↓
/users

Product Routes
    ↓
/products

Order Routes
    ↓
/orders
```

This makes the API easier to understand.

---

## 13.2 Maintainability

Instead of putting everything into one huge function, routes can be separated.

```text
routes/
│
├── userRoutes.js
├── productRoutes.js
└── orderRoutes.js
```

Now developers can easily find the relevant API logic.

---

## 13.3 Scalability

As your application grows, the number of endpoints increases.

For example:

```text
Small API

/users
/products


Large API

/users
/users/:id
/products
/products/:id
/orders
/orders/:id
/payments
/posts
/posts/:id
/comments
/notifications
```

Good routing structure makes large APIs easier to manage.

---

## 13.4 Separation of Responsibilities

Routing allows us to separate:

```text
Route
  ↓
Controller
  ↓
Business Logic
  ↓
Database
```

For example:

```text
GET /students
       ↓
studentRoutes.js
       ↓
studentController.js
       ↓
Student.find()
       ↓
MongoDB
```

This is a common pattern in real-world Express applications.

---

# 14. Routes and Controllers

In small applications, you might write:

```js
app.get("/students", async (req, res) => {

    const students = await Student.find();

    res.json(students);

});
```

But in a larger application, we can separate the logic.

### Route

```js
router.get("/students", getStudents);
```

### Controller

```js
const getStudents = async (req, res) => {

    const students = await Student.find();

    res.json(students);

};
```

Now the responsibilities are clearer:

```text
Route
 ↓
Defines URL + HTTP method

Controller
 ↓
Contains application logic
```

---

# 15. Express Router

Express provides a special object called **Router** for organizing routes.

Example:

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Get users"
    });
});

router.post("/", (req, res) => {
    res.json({
        message: "Create user"
    });
});

module.exports = router;
```

Then in `server.js`:

```js
const userRoutes = require("./routes/userRoutes");

app.use("/users", userRoutes);
```

Now:

```text
GET  /users
POST /users
```

are handled by `userRoutes`.

---

# 16. Complete Routing Architecture

A scalable Express application might look like:

```text
Client
  ↓
HTTP Request
  ↓
Express Server
  ↓
Middleware
  ↓
Router
  ↓
Route
  ↓
Controller
  ↓
Service / Business Logic
  ↓
Database
  ↓
Controller
  ↓
Response
  ↓
Client
```

For example:

```text
GET /students/10
       ↓
Express
       ↓
Middleware
       ↓
Student Router
       ↓
Student Controller
       ↓
Student Model
       ↓
MongoDB
       ↓
Student Data
       ↓
JSON Response
```

---

# 17. Complete Example

Here is a simple Express API with multiple routes:

```js
const express = require("express");

const app = express();

app.use(express.json());

// GET
app.get("/students", (req, res) => {
    res.json({
        message: "Get all students"
    });
});

// GET with route parameter
app.get("/students/:id", (req, res) => {
    res.json({
        message: `Get student ${req.params.id}`
    });
});

// POST
app.post("/students", (req, res) => {
    res.status(201).json({
        message: "Student created",
        data: req.body
    });
});

// PUT
app.put("/students/:id", (req, res) => {
    res.json({
        message: `Student ${req.params.id} updated`
    });
});

// DELETE
app.delete("/students/:id", (req, res) => {
    res.json({
        message: `Student ${req.params.id} deleted`
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

---

# 18. API Endpoints Created by This Code

The above application provides:

| HTTP Method | Endpoint        | Purpose          |
| ----------- | --------------- | ---------------- |
| GET         | `/students`     | Get all students |
| GET         | `/students/:id` | Get one student  |
| POST        | `/students`     | Create a student |
| PUT         | `/students/:id` | Update a student |
| DELETE      | `/students/:id` | Delete a student |

---

# 19. The Big Picture

Think about Express routing like a **reception desk** in a large company.

A visitor arrives and says:

> "I need the Accounts department."

The receptionist looks at the request and sends the visitor to the correct department.

Express routing works similarly:

```text
Client Request
      ↓
Express Router
      ↓
"What does this request want?"
      ↓
Find matching route
      ↓
Send request to correct handler
      ↓
Generate response
```

For example:

```text
GET /students
      ↓
Student Route
      ↓
Student Controller
      ↓
Database
      ↓
Student Data
```

---

# Key Takeaways

### What is Routing?

> Routing is the process of matching an incoming HTTP request to the code responsible for handling it.

### What is an Endpoint?

> An API endpoint is a specific API address, usually understood as an HTTP method + URL path.

Example:

```text
GET /students
```

### What is a Route?

> A route is the rule defined in Express that tells the server what to do when a particular request matches.

Example:

```js
app.get("/students", handler);
```

### How Do Routes and Endpoints Work Together?

```text
Client
  ↓
GET /students
  ↓
Express
  ↓
Match Route
  ↓
app.get("/students", handler)
  ↓
Execute Handler
  ↓
Send Response
```

### Why Does Routing Matter?

Routing provides:

* Organization
* Clear API structure
* Separation of responsibilities
* Maintainability
* Scalability
* Easier debugging
* Better team collaboration

---

# Remember This

```text
                EXPRESS ROUTING

Client
  │
  │ HTTP Request
  │
  │ GET /students
  ↓
Express Server
  │
  ↓
Router
  │
  ↓
Match Method + Path
  │
  ↓
Route Handler
  │
  ↓
Business Logic
  │
  ↓
Database
  │
  ↓
Response
  │
  ↓
Client
```

> **Route = The rule defined by the server.**

> **Endpoint = The API address the client calls.**

> **Routing = The process of connecting incoming requests to the correct backend code.**
