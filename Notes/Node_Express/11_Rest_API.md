# REST Architecture and Resource-Based API Design

## 1. What is REST?

**REST** stands for:

> **Representational State Transfer**

REST is an **architectural style** for designing web APIs.

It provides guidelines for designing APIs so that they are:

* Simple
* Predictable
* Consistent
* Scalable
* Easy to understand
* Easy to maintain

REST is not a programming language, library, or framework.

For example:

```text
Node.js
   ↓
Runtime

Express.js
   ↓
Framework

REST
   ↓
API Design Architecture
```

So Express helps you **build** an API, while REST helps you **design** the API properly.

---

# 2. Why Do We Need REST?

Imagine an API designed like this:

```text
/getUsers
/createUser
/deleteUser
/updateUser
/getProducts
/createProduct
/deleteProduct
```

It works, but there is a problem.

The endpoint names contain **actions**.

REST encourages us to think about **resources** instead.

Instead of:

```text
/getUsers
/createUser
/deleteUser
```

we use:

```text
/users
```

Then the HTTP method tells us what action to perform.

```text
GET    /users
POST   /users
DELETE /users/:id
PUT    /users/:id
```

This makes the API more predictable.

---

# 3. What is a Resource?

A **resource** is a meaningful object or piece of data that your application manages.

Examples:

```text
Users
Products
Orders
Students
Courses
Posts
Comments
Tasks
Payments
```

In REST API design, resources are generally represented using **nouns**.

For example:

```text
/users
/products
/orders
/students
/tasks
```

Instead of action-based names:

```text
/getUsers
/createProduct
/deleteOrder
```

---

# 4. Resource-Based API Design

REST organizes APIs around **resources**.

Suppose we are building a student management system.

Our main resource is:

```text
students
```

We can create endpoints around that resource:

```text
GET     /students
POST    /students
GET     /students/:id
PUT     /students/:id
PATCH   /students/:id
DELETE  /students/:id
```

The resource is:

```text
/students
```

The HTTP method tells us what operation we want to perform.

---

# 5. HTTP Methods Define the Action

REST avoids putting actions directly into endpoint names because HTTP methods already describe the intended operation.

| HTTP Method | Meaning          | Example               |
| ----------- | ---------------- | --------------------- |
| GET         | Retrieve         | `GET /students`       |
| POST        | Create           | `POST /students`      |
| PUT         | Replace/update   | `PUT /students/10`    |
| PATCH       | Partially update | `PATCH /students/10`  |
| DELETE      | Delete           | `DELETE /students/10` |

Notice that the URL remains focused on the resource:

```text
/students
```

The HTTP method changes.

---

# 6. Example: Student API

Suppose our application manages students.

### Get all students

```http
GET /students
```

Meaning:

> Give me all students.

---

### Create a student

```http
POST /students
```

Meaning:

> Create a new student.

Request body:

```json
{
    "name": "Rahul",
    "age": 22,
    "course": "Backend"
}
```

---

### Get one student

```http
GET /students/10
```

Meaning:

> Give me student with ID 10.

---

### Update a student

```http
PUT /students/10
```

Meaning:

> Replace/update student 10.

---

### Partially update a student

```http
PATCH /students/10
```

Meaning:

> Update part of student 10.

---

### Delete a student

```http
DELETE /students/10
```

Meaning:

> Delete student 10.

---

# 7. Resource vs Action

This is one of the most important REST concepts.

### ❌ Action-Based API

```text
/getStudents
/createStudent
/updateStudent
/deleteStudent
```

The endpoint tells us the action.

---

### ✅ Resource-Based API

```text
GET    /students
POST   /students
PUT    /students/:id
DELETE /students/:id
```

The endpoint identifies the resource.

The HTTP method identifies the action.

```text
HTTP Method
     +
Resource
     ↓
Operation
```

---

# 8. REST and Express.js

Express makes it easy to implement REST-style APIs.

Example:

```js
const express = require("express");

const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
    res.json({
        message: "Get all students"
    });
});

app.post("/students", (req, res) => {
    res.status(201).json({
        message: "Student created"
    });
});

app.get("/students/:id", (req, res) => {
    res.json({
        message: `Get student ${req.params.id}`
    });
});

app.put("/students/:id", (req, res) => {
    res.json({
        message: `Update student ${req.params.id}`
    });
});

app.delete("/students/:id", (req, res) => {
    res.json({
        message: `Delete student ${req.params.id}`
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

This is a basic REST-style API.

---

# 9. REST Separates Client and Server

One important REST principle is **separation of client and server responsibilities**.

The client and server have different jobs.

### Client

The client is responsible for:

* User interface
* Sending requests
* Displaying responses
* User interactions

Examples:

```text
React
Mobile App
Web Browser
```

### Server

The server is responsible for:

* Business logic
* Authentication
* Database operations
* Processing requests
* Sending responses

Examples:

```text
Node.js
Express.js
MongoDB
```

---

# 10. Client-Server Architecture

The communication looks like:

```text
                CLIENT
                  │
                  │ HTTP Request
                  ↓
             EXPRESS API
                  │
                  ↓
            Business Logic
                  │
                  ↓
              DATABASE
                  │
                  ↓
             Business Logic
                  │
                  ↓
             EXPRESS API
                  │
                  │ HTTP Response
                  ↓
                CLIENT
```

The client doesn't need to know how the database works.

The server doesn't need to know how the frontend displays the data.

They communicate through the API.

---

# 11. Example: React + Express + MongoDB

Imagine you have a React frontend.

The user opens the student page.

React sends:

```http
GET /students
```

Express receives the request:

```js
app.get("/students", async (req, res) => {

    const students = await Student.find();

    res.json(students);

});
```

Mongoose communicates with MongoDB:

```text
React
  ↓
GET /students
  ↓
Express
  ↓
Mongoose
  ↓
MongoDB
  ↓
Student Data
  ↓
Express
  ↓
JSON
  ↓
React
```

This is a typical REST-style backend flow.

---

# 12. Resource Naming Conventions

Good REST APIs use consistent naming conventions.

## Use Nouns

Prefer:

```text
/users
/products
/orders
/students
```

Avoid:

```text
/getUsers
/createProduct
/deleteOrder
```

---

## Use Plural Nouns

A common convention is to use plural resource names.

Prefer:

```text
/users
/products
/orders
/students
```

rather than:

```text
/user
/product
/order
/student
```

Why?

Because the collection endpoint represents a group of resources.

```text
/users
   ↓
Collection of users
```

And:

```text
/users/10
   ↓
One specific user
```

---

# 13. Resource Hierarchies and Relationships

Resources can have relationships with other resources.

For example:

```text
User
 └── Posts
```

A user's posts could be represented as:

```text
/users/10/posts
```

Meaning:

> Get posts belonging to user 10.

Another example:

```text
/orders/100/items
```

Meaning:

> Get items belonging to order 100.

This creates a clear resource relationship.

---

# 14. Nested Resources

Suppose we have:

```text
Users
Posts
```

and every post belongs to a user.

We could define:

```text
GET /users/10/posts
```

This means:

> Get all posts created by user 10.

Another example:

```text
GET /users/10/posts/50
```

Meaning:

> Get post 50 belonging to user 10.

The structure is:

```text
/users/:userId/posts/:postId
```

Express:

```js
app.get("/users/:userId/posts/:postId", (req, res) => {

    const userId = req.params.userId;
    const postId = req.params.postId;

    res.json({
        userId,
        postId
    });

});
```

---

# 15. Avoid Action-Heavy URLs

### ❌ Avoid

```text
GET /getAllUsers
POST /createUser
POST /deleteUser
POST /updateUser
```

These URLs describe actions.

---

### ✅ Prefer

```text
GET    /users
POST   /users
DELETE /users/:id
PUT    /users/:id
```

The HTTP method already describes the action.

---

# 16. REST API Predictability

A good REST API should be predictable.

Suppose developers already understand:

```text
GET /products
```

They can reasonably expect:

```text
GET /products/10
```

to retrieve a specific product.

Similarly:

```text
POST /products
```

should create a product.

```text
DELETE /products/10
```

should delete product 10.

This consistency makes APIs easier to learn.

---

# 17. Consistent API Design

Imagine two APIs.

### Poorly Designed API

```text
GET  /getAllUsers
POST /newUser
GET  /findProductById/10
POST /removeProduct/20
GET  /allOrders
```

The naming is inconsistent.

---

### Better REST-Style API

```text
GET    /users
POST   /users
GET    /products/10
DELETE /products/20
GET    /orders
```

The pattern is much easier to understand.

---

# 18. REST and Status Codes

REST APIs also commonly use HTTP status codes to communicate the result of an operation.

For example:

### Successful GET

```http
200 OK
```

### Successfully Created

```http
201 Created
```

### Invalid Request

```http
400 Bad Request
```

### Not Authenticated

```http
401 Unauthorized
```

### Resource Not Found

```http
404 Not Found
```

### Server Error

```http
500 Internal Server Error
```

Example:

```js
app.get("/students/:id", async (req, res) => {

    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});
```

This makes the API behavior predictable.

---

# 19. REST API Design Example

Let's design a simple e-commerce API.

Resources:

```text
Users
Products
Orders
```

### Users

```text
GET    /users
POST   /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

### Products

```text
GET    /products
POST   /products
GET    /products/:id
PUT    /products/:id
DELETE /products/:id
```

### Orders

```text
GET    /orders
POST   /orders
GET    /orders/:id
PUT    /orders/:id
DELETE /orders/:id
```

The pattern is predictable.

---

# 20. REST API with Express Router

For a real project, we can separate routes.

### `routes/studentRoutes.js`

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Get students"
    });
});

router.post("/", (req, res) => {
    res.json({
        message: "Create student"
    });
});

router.get("/:id", (req, res) => {
    res.json({
        message: `Get student ${req.params.id}`
    });
});

router.delete("/:id", (req, res) => {
    res.json({
        message: `Delete student ${req.params.id}`
    });
});

module.exports = router;
```

Then in `server.js`:

```js
const express = require("express");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(express.json());

app.use("/students", studentRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

Now the final endpoints are:

```text
GET    /students
POST   /students
GET    /students/:id
DELETE /students/:id
```

---

# 21. Why REST Matters

REST gives developers a **common way of thinking about API design**.

Without consistent conventions, every API could use completely different URL structures.

REST encourages:

```text
Resources
   ↓
Standard HTTP Methods
   ↓
Predictable URLs
   ↓
Consistent Responses
   ↓
Easier API Usage
```

---

# 22. Benefits of RESTful API Design

## 1. Predictability

Developers can understand endpoints without reading lots of documentation.

## 2. Consistency

Similar resources follow similar patterns.

## 3. Maintainability

Organized APIs are easier to modify.

## 4. Scalability

New resources can be added using the same design principles.

## 5. Readability

Endpoints clearly communicate what resources they represent.

## 6. Team Collaboration

Developers can follow common conventions when building different parts of the application.

---

# 23. REST in a Real Application

Imagine our **DevConnect** backend.

Resources might include:

```text
users
posts
comments
likes
bookmarks
notifications
```

A REST-style API could look like:

```text
GET    /users
GET    /users/:id

GET    /posts
POST   /posts
GET    /posts/:id
PUT    /posts/:id
DELETE /posts/:id

GET    /posts/:postId/comments
POST   /posts/:postId/comments

POST   /posts/:postId/likes
DELETE /posts/:postId/likes

GET    /notifications
```

Notice that the URLs focus on **resources**, while HTTP methods describe the operations.

---

# 24. REST vs Express

It's important not to confuse these two.

| REST                                            | Express.js                           |
| ----------------------------------------------- | ------------------------------------ |
| Architectural style                             | Node.js web framework                |
| Defines API design principles                   | Provides tools to build APIs         |
| Focuses on resources and HTTP                   | Focuses on server implementation     |
| Not a library                                   | Framework                            |
| Can be implemented using different technologies | Commonly used to implement REST APIs |

For example:

```text
REST
 ↓
Design principles
 ↓
Resource-based API
 ↓
Express.js
 ↓
Implementation
```

---

# 25. REST Mental Model

Instead of thinking:

> "What function should this URL call?"

Think:

> "What resource am I working with?"

For example:

```text
Resource:
students
```

Then ask:

> "What do I want to do with students?"

```text
GET     → Retrieve
POST    → Create
PUT     → Replace/update
PATCH   → Partially update
DELETE  → Delete
```

Therefore:

```text
GET /students
POST /students
GET /students/10
PUT /students/10
PATCH /students/10
DELETE /students/10
```

---

# Key Takeaways

### REST

> REST is an architectural style for designing web APIs around resources and standard HTTP communication.

### Resource

> A resource is a meaningful entity managed by the application.

Examples:

```text
/users
/products
/orders
/students
/posts
```

### Route

> A route is the rule defined in Express that handles a particular HTTP request.

### Endpoint

> An endpoint is the API address that a client interacts with.

### REST Principle

Use **nouns for resources** and **HTTP methods for actions**.

```text
❌ GET /getUsers

✅ GET /users
```

```text
❌ POST /createUser

✅ POST /users
```

```text
❌ POST /deleteUser/10

✅ DELETE /users/10
```

---

# Remember This

```text
                 REST API

             Resources
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
     Users    Products   Orders
       │         │         │
       ↓         ↓         ↓
    HTTP Methods
       │
 ┌─────┼─────┬─────┬─────┐
 ↓     ↓     ↓     ↓     ↓
GET   POST   PUT PATCH DELETE
```

The core idea is:

```text
RESOURCE + HTTP METHOD
          ↓
       OPERATION
```

For example:

```text
GET /users
       ↓
Retrieve users

POST /users
       ↓
Create user

GET /users/10
       ↓
Retrieve user 10

DELETE /users/10
       ↓
Delete user 10
```

> **REST = Design your API around resources, use standard HTTP methods for actions, and keep the API predictable and consistent.**
