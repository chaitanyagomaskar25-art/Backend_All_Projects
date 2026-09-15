# Introduction to Express.js

**Express.js** is a minimal and flexible web framework built on top of **Node.js**.

It simplifies backend development by providing a structured way to create:

* Web servers
* REST APIs
* Backend applications
* API endpoints
* Middleware-based request processing

Instead of manually handling everything with Node.js's native `http` module, Express provides convenient tools for routing, middleware, request handling, and responses.

---

# 1. Role and Purpose of Express.js

Express.js helps developers build **server-side applications and backend APIs** more easily.

It acts as a central place where incoming client requests are received, processed, and converted into appropriate responses.

### Basic Request Flow

```text
Client
  ↓
HTTP Request
  ↓
Express Server
  ↓
Middleware
  ↓
Route
  ↓
Backend Logic
  ↓
Response
  ↓
Client
```

For example, a frontend application might send:

```http
GET /users
```

Express receives this request and finds the corresponding route:

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Users fetched successfully"
    });
});
```

The server then sends a response back to the client.

---

# 2. Express.js as a Node.js Framework

Express.js does **not replace Node.js**.

Instead, Express runs on Node.js and provides additional functionality that makes backend development easier.

```text
Node.js
   ↓
JavaScript Runtime
   ↓
Express.js
   ↓
Web/API Framework
   ↓
Routes + Middleware + Request/Response Handling
```

### Node.js

Node.js provides the environment needed to execute JavaScript on the server.

### Express.js

Express provides a convenient framework for building web applications and APIs using Node.js.

---

# 3. Minimal and Flexible Framework

Express is often described as **minimal and flexible**.

### Minimal

Express does not force developers to use a huge number of built-in features.

It provides the essential tools needed for web and API development.

### Flexible

Developers can choose how to organize their application.

For example:

```text
backend/
│
├── routes/
├── controllers/
├── models/
├── middleware/
├── services/
└── server.js
```

Or a smaller project might simply use:

```text
backend/
│
└── server.js
```

This flexibility makes Express suitable for both small and large projects.

---

# 4. Express Application Instance

An Express application usually starts by creating an **application instance**.

```js
const express = require("express");

const app = express();
```

Here:

```js
express()
```

creates an Express application.

We store that application in:

```js
app
```

The `app` object is used to configure the server.

For example:

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get users"
    });
});
```

And:

```js
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

---

# 5. Route Handlers

A **route handler** defines what should happen when a client sends a request to a particular endpoint.

Example:

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get all users"
    });
});
```

This route means:

```text
GET /users
     ↓
Execute route handler
     ↓
Send JSON response
```

Express supports different HTTP methods.

### GET

Used to retrieve data.

```js
app.get("/users", (req, res) => {
    res.json({
        message: "Get users"
    });
});
```

### POST

Used to create data.

```js
app.post("/users", (req, res) => {
    res.json({
        message: "Create user"
    });
});
```

### PUT

Used to update data.

```js
app.put("/users/:id", (req, res) => {
    res.json({
        message: "Update user"
    });
});
```

### DELETE

Used to delete data.

```js
app.delete("/users/:id", (req, res) => {
    res.json({
        message: "Delete user"
    });
});
```

---

# 6. Middleware

**Middleware** is one of the most important concepts in Express.js.

Middleware functions run during the request-response cycle.

They can:

* Execute code
* Modify the request
* Modify the response
* Validate data
* Authenticate users
* Log requests
* Handle errors
* Pass control to the next middleware or route

Basic structure:

```js
const middleware = (req, res, next) => {
    // Perform some operation

    next();
};
```

The `next()` function tells Express:

> "This middleware is finished. Continue to the next step."

---

# 7. Example of Middleware

Consider a logging middleware:

```js
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    next();
};

app.use(logger);
```

Now when the client sends:

```http
GET /users
```

The flow becomes:

```text
Request
   ↓
Logger Middleware
   ↓
/users Route
   ↓
Response
```

---

# 8. Common Uses of Middleware

Middleware can be used for many backend tasks.

### Logging

```text
GET /users
POST /users
DELETE /users/10
```

### Authentication

Check whether the user is logged in.

```text
Request
   ↓
Authentication Middleware
   ↓
Authenticated?
   ↓
Yes → Route
No  → Error Response
```

### Validation

Check whether incoming data is valid.

```text
Request
   ↓
Validation Middleware
   ↓
Valid?
   ↓
Yes → Controller
No  → 400 Bad Request
```

### Error Handling

Handle errors consistently across the application.

---

# 9. Express in API-Based Backend Systems

Modern applications commonly use APIs to allow different applications to communicate with a backend.

For example:

```text
React Application
       ↓
   HTTP Request
       ↓
 Express API
       ↓
   Business Logic
       ↓
   Database
       ↓
 Express API
       ↓
   JSON Response
       ↓
 React Application
```

The client could be:

* React web application
* Mobile application
* Desktop application
* Another backend service

Express acts as the layer that receives and processes these API requests.

---

# 10. API Endpoints

An **API endpoint** is a specific URL through which a client can interact with backend functionality.

For example:

```text
GET     /users
GET     /users/:id
POST    /users
PUT     /users/:id
DELETE  /users/:id
```

Each endpoint performs a specific operation.

Example:

```js
app.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Rahul"
        },
        {
            id: 2,
            name: "Aman"
        }
    ]);
});
```

A client can request:

```http
GET /users
```

And receive:

```json
[
    {
        "id": 1,
        "name": "Rahul"
    },
    {
        "id": 2,
        "name": "Aman"
    }
]
```

---

# 11. Express and Databases

Express itself is **not a database**.

Instead, Express can communicate with databases through database libraries or drivers.

For example:

```text
Client
   ↓
Express API
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

Example:

```js
app.get("/students", async (req, res) => {

    const students = await Student.find();

    res.json(students);
});
```

Here:

```text
Express
   ↓
Receives request

Student.find()
   ↓
Gets data from MongoDB

res.json()
   ↓
Sends data to client
```

---

# 12. Express and Authentication

Express can also be used with authentication systems.

For example:

```text
Client
   ↓
POST /login
   ↓
Express
   ↓
Check username/password
   ↓
Generate authentication token
   ↓
Send token
   ↓
Client
```

Authentication middleware can then protect private routes.

```text
GET /profile
      ↓
Authentication Middleware
      ↓
Valid Token?
   ↙       ↘
 Yes        No
 ↓          ↓
Profile    401 Error
```

---

# 13. Express and External Services

Backend applications often need to communicate with external services.

For example:

```text
Express API
    ↓
External Payment API
    ↓
Payment Result
    ↓
Express
    ↓
Client
```

Other external services might include:

* Payment services
* Email services
* Cloud storage
* AI APIs
* Maps APIs
* SMS services

Express can act as the central backend layer that coordinates these services.

---

# 14. Why Express Makes Backend Development Easier

Without Express:

```text
Node.js HTTP Module
        ↓
Manual Routing
        ↓
Manual Request Parsing
        ↓
Manual Response Handling
        ↓
Manual Middleware Patterns
        ↓
More Code
```

With Express:

```text
Node.js
   ↓
Express.js
   ↓
Routing
   ↓
Middleware
   ↓
Controllers / Business Logic
   ↓
Database / External Services
   ↓
JSON Response
```

This makes the application easier to organize and maintain.

---

# 15. Real-World Express Architecture

A larger Express application can be organized like this:

```text
backend/
│
├── server.js
│
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── services/
│   ├── paymentService.js
│   └── emailService.js
│
└── config/
    └── db.js
```

Each part has a specific responsibility.

---

# 16. Complete Request-Response Flow

Suppose a user wants to fetch their profile.

The client sends:

```http
GET /profile
```

The request might flow through the backend like this:

```text
Client
  ↓
GET /profile
  ↓
Express Server
  ↓
Authentication Middleware
  ↓
Route
  ↓
Controller
  ↓
Database
  ↓
Controller
  ↓
JSON Response
  ↓
Client
```

Example:

```js
app.get("/profile", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.id);

    res.json(user);
});
```

Here:

* `app.get()` → defines the route
* `authMiddleware` → checks authentication
* `User.findById()` → gets data from the database
* `res.json()` → sends the response

---

# 17. Key Takeaways

* **Express.js is a minimal and flexible web framework for Node.js.**
* It simplifies the development of backend servers and APIs.
* Express uses an **application instance**, commonly called `app`.
* Routes define how the application responds to different HTTP requests.
* **Middleware** processes requests during the request-response cycle.
* Middleware can handle:

  * Authentication
  * Validation
  * Logging
  * Error handling
  * Request parsing
* Express can expose backend functionality through **API endpoints**.
* Express can work with databases such as MongoDB through libraries like Mongoose.
* Express can communicate with external services such as payment, email, AI, and cloud APIs.
* Express helps make backend applications **organized, maintainable, and scalable**.

## Remember This

```text
                EXPRESS.JS
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     Routing    Middleware   Responses
        │           │           │
        ↓           ↓           ↓
     API       Auth/Validation  JSON
   Endpoints      Logging      Data
        │
        ↓
   Controllers
        │
   ┌────┴────┐
   ↓         ↓
Database   External APIs
```

> **Express.js = Node.js + Routing + Middleware + Convenient Request/Response Handling**
