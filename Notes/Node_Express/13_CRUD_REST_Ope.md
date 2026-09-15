# CRUD-Based APIs and Resource Structure

## 1. What is CRUD?

**CRUD** stands for:

```text
C → Create
R → Read
U → Update
D → Delete
```

These are the four basic operations used to manage data in an application.

For example, suppose our application manages students.

We need to:

```text
Create → Add a student
Read   → Get student data
Update → Change student information
Delete → Remove a student
```

CRUD is not specific to Express.js or MongoDB.

It is a general concept used throughout backend development.

---

# 2. CRUD and HTTP Methods

CRUD operations are commonly mapped to HTTP methods.

| CRUD   | HTTP Method | Example                | Purpose          |
| ------ | ----------- | ---------------------- | ---------------- |
| Create | POST        | `POST /students`       | Create a student |
| Read   | GET         | `GET /students`        | Get students     |
| Read   | GET         | `GET /students/:id`    | Get one student  |
| Update | PUT/PATCH   | `PUT /students/:id`    | Update a student |
| Delete | DELETE      | `DELETE /students/:id` | Delete a student |

The basic relationship is:

```text
CRUD
 ↓
HTTP Methods
 ↓
REST API
```

---

# 3. Create

**Create** means adding new data to the system.

Suppose we want to create a student.

The client sends:

```http
POST /students
```

Request body:

```json
{
    "name": "Rahul",
    "age": 22,
    "course": "Backend"
}
```

Express:

```js
app.post("/students", (req, res) => {

    const student = req.body;

    res.status(201).json({
        message: "Student created successfully",
        data: student
    });

});
```

The server would normally validate the data and save it to the database.

---

# 4. Read

**Read** means retrieving existing data.

There are usually two common read operations.

## Get All Resources

```http
GET /students
```

Express:

```js
app.get("/students", (req, res) => {

    res.json({
        message: "All students"
    });

});
```

This represents a **collection** of students.

---

## Get One Resource

```http
GET /students/10
```

Express:

```js
app.get("/students/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        message: "Student found",
        id: id
    });

});
```

This represents one specific student.

---

# 5. Update

**Update** means changing existing data.

There are two commonly used HTTP methods:

```text
PUT
PATCH
```

### PUT

Generally used when replacing the complete resource.

```http
PUT /students/10
```

Example body:

```json
{
    "name": "Rahul Kumar",
    "age": 23,
    "course": "Node.js"
}
```

---

### PATCH

Generally used when updating only part of a resource.

```http
PATCH /students/10
```

Example body:

```json
{
    "age": 23
}
```

The important distinction:

```text
PUT
 ↓
Replace/update the resource

PATCH
 ↓
Update specific fields
```

---

# 6. Delete

**Delete** means removing an existing resource.

Example:

```http
DELETE /students/10
```

Express:

```js
app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        message: `Student ${id} deleted`
    });

});
```

In a real application, the backend would delete the corresponding document from the database.

---

# 7. What is a Resource?

A **resource** is a meaningful entity that your application manages.

Examples:

```text
Users
Students
Products
Orders
Tasks
Posts
Comments
Courses
Payments
```

For example, in a task management application:

```text
/tasks
```

represents the task resource.

In a student management application:

```text
/students
```

represents the student resource.

---

# 8. Resource-Centered API Design

A good API is organized around resources rather than actions.

### ❌ Action-Based

```text
/getStudents
/createStudent
/updateStudent
/deleteStudent
```

### ✅ Resource-Based

```text
GET    /students
POST   /students
GET    /students/:id
PUT    /students/:id
PATCH  /students/:id
DELETE /students/:id
```

The resource is:

```text
students
```

The HTTP method tells us what we want to do.

---

# 9. Collection vs Individual Resource

This is an important concept in CRUD APIs.

## Collection Endpoint

```text
/students
```

represents the collection of students.

Examples:

```http
GET /students
POST /students
```

Meaning:

```text
GET
 ↓
Get all students

POST
 ↓
Create a new student
```

---

## Individual Resource Endpoint

```text
/students/:id
```

represents one specific student.

Examples:

```http
GET /students/10
PUT /students/10
PATCH /students/10
DELETE /students/10
```

Meaning:

```text
/students/10
      ↓
Student with ID 10
```

---

# 10. Collection vs Individual Endpoint

Think of it like a database table.

```text
students
│
├── Student 1
├── Student 2
├── Student 3
├── Student 4
└── Student 5
```

The collection:

```text
/students
```

represents all students.

A specific resource:

```text
/students/3
```

represents Student 3.

Therefore:

```text
/students
     ↓
Collection

/students/3
     ↓
Individual Resource
```

---

# 11. Complete CRUD Route Structure

A typical student CRUD API could look like:

```text
GET     /students
POST    /students

GET     /students/:id
PUT     /students/:id
PATCH   /students/:id
DELETE  /students/:id
```

Visualized:

```text
                    /students
                       │
              ┌────────┴────────┐
              ↓                 ↓
             GET               POST
              │                 │
         Get all students   Create student


                    /students/:id
                         │
        ┌────────┬───────┼────────┬────────┐
        ↓        ↓       ↓        ↓
       GET      PUT    PATCH    DELETE
        │        │       │        │
       Read    Update  Partial   Delete
       one             Update
```

---

# 12. Complete Express CRUD Example

Let's create a basic CRUD API.

```js
const express = require("express");

const app = express();

app.use(express.json());

// CREATE
app.post("/students", (req, res) => {

    const student = req.body;

    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student
    });

});

// READ ALL
app.get("/students", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data: []
    });

});

// READ ONE
app.get("/students/:id", (req, res) => {

    const id = req.params.id;

    res.status(200).json({
        success: true,
        message: "Student fetched successfully",
        data: {
            id: id
        }
    });

});

// UPDATE
app.put("/students/:id", (req, res) => {

    const id = req.params.id;

    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: {
            id: id,
            ...req.body
        }
    });

});

// PARTIAL UPDATE
app.patch("/students/:id", (req, res) => {

    const id = req.params.id;

    res.status(200).json({
        success: true,
        message: "Student partially updated",
        data: {
            id: id,
            ...req.body
        }
    });

});

// DELETE
app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        id: id
    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

This is a basic CRUD API structure.

---

# 13. CRUD Request Flow

Let's understand what happens when a client creates a student.

### Client

```http
POST /students
```

with:

```json
{
    "name": "Rahul",
    "age": 22
}
```

### Express

```text
Request
   ↓
Route Matching
   ↓
POST /students
   ↓
Route Handler
   ↓
Validate Data
   ↓
Database
```

### Response

```http
201 Created
```

```json
{
    "success": true,
    "message": "Student created successfully",
    "data": {
        "name": "Rahul",
        "age": 22
    }
}
```

---

# 14. CRUD with a Database

In a real backend, CRUD operations usually interact with a database.

For example:

```text
              Express API
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
      Routes    Controllers  Middleware
                   │
                   ↓
                Mongoose
                   │
                   ↓
                MongoDB
```

The CRUD flow becomes:

```text
POST /students
      ↓
Create Student
      ↓
MongoDB


GET /students
      ↓
Read Students
      ↓
MongoDB


PUT /students/:id
      ↓
Update Student
      ↓
MongoDB


DELETE /students/:id
      ↓
Delete Student
      ↓
MongoDB
```

---

# 15. CRUD and MongoDB

When you start using MongoDB and Mongoose, the CRUD operations map nicely to database operations.

### Create

```js
Student.create(data);
```

### Read

```js
Student.find();
```

or:

```js
Student.findById(id);
```

### Update

```js
Student.findByIdAndUpdate(id, data);
```

### Delete

```js
Student.findByIdAndDelete(id);
```

So you can think:

```text
API CRUD
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB CRUD
```

---

# 16. Resource Naming

Use clear and consistent resource names.

### Good

```text
/users
/students
/products
/orders
/tasks
/posts
```

### Avoid

```text
/getUsers
/createStudent
/deleteProduct
/getAllOrders
```

Use nouns for resources.

```text
/users
```

not:

```text
/getUsers
```

---

# 17. Use Plural Resource Names

A common REST convention is to use plural nouns.

Prefer:

```text
/users
/products
/orders
/students
```

Then:

```text
/users/10
/products/25
/orders/100
```

represent individual resources.

This creates a predictable pattern:

```text
/collection
/collection/:id
```

---

# 18. Nested Resources

Sometimes resources have relationships.

For example:

```text
User
 └── Posts
```

You could represent the relationship as:

```text
/users/:userId/posts
```

Example:

```http
GET /users/10/posts
```

Meaning:

> Get all posts belonging to user 10.

Another example:

```http
GET /users/10/posts/50
```

Meaning:

> Get post 50 belonging to user 10.

---

# 19. CRUD API Example for an E-Commerce System

Suppose our application manages products.

### Create

```http
POST /products
```

### Read all

```http
GET /products
```

### Read one

```http
GET /products/10
```

### Update

```http
PUT /products/10
```

### Partial update

```http
PATCH /products/10
```

### Delete

```http
DELETE /products/10
```

The complete resource structure:

```text
/products
/products/:id
```

That's all we need for the basic CRUD operations.

---

# 20. Consistent API Responses

A maintainable API should use consistent response structures.

### Success

```json
{
    "success": true,
    "message": "Student fetched successfully",
    "data": {
        "id": 10,
        "name": "Rahul"
    }
}
```

### Error

```json
{
    "success": false,
    "message": "Student not found"
}
```

This helps the frontend understand responses consistently.

---

# 21. CRUD Error Handling

CRUD operations can fail.

For example:

```text
Student doesn't exist
Invalid data
Database failure
Unauthorized user
Duplicate email
```

The API should return appropriate status codes.

Example:

```js
app.get("/students/:id", async (req, res) => {

    const student = null;

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.status(200).json({
        success: true,
        data: student
    });

});
```

The client gets:

```text
404 Not Found
```

and:

```json
{
    "success": false,
    "message": "Student not found"
}
```

---

# 22. Why CRUD APIs Are Important

Most real applications perform CRUD operations.

### Social Media

```text
Create → Post
Read   → View posts
Update → Edit post
Delete → Delete post
```

### E-Commerce

```text
Create → Product
Read   → Product
Update → Product
Delete → Product
```

### Task Management

```text
Create → Task
Read   → Tasks
Update → Task
Delete → Task
```

### Student Management

```text
Create → Student
Read   → Students
Update → Student
Delete → Student
```

CRUD is everywhere in backend development.

---

# 23. Maintainable CRUD API Structure

As your application grows, don't put everything into `server.js`.

A better structure is:

```text
backend/
│
├── config/
│   └── db.js
│
├── models/
│   └── studentModel.js
│
├── routes/
│   └── studentRoutes.js
│
├── controllers/
│   └── studentController.js
│
├── middleware/
│   └── errorMiddleware.js
│
├── server.js
│
└── package.json
```

The responsibilities are separated.

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
Database
```

This makes the application easier to maintain.

---

# 24. Route → Controller → Model

A typical CRUD request might flow like this:

```text
Client
   ↓
POST /students
   ↓
Route
   ↓
Controller
   ↓
Model
   ↓
MongoDB
   ↓
Model
   ↓
Controller
   ↓
Response
   ↓
Client
```

For example:

```js
router.post("/", createStudent);
```

The route doesn't need to contain all the business logic.

The controller handles it:

```js
const createStudent = async (req, res) => {

    const student = await Student.create(req.body);

    res.status(201).json({
        success: true,
        data: student
    });

};
```

This separation becomes extremely useful in larger projects.

---

# 25. CRUD Design Checklist

When designing a CRUD API, ask:

### Resource

What data are we managing?

```text
/users
/products
/students
```

### Collection Endpoint

What is the collection?

```text
/students
```

### Individual Endpoint

How do we identify one resource?

```text
/students/:id
```

### HTTP Methods

What operations do we support?

```text
GET
POST
PUT
PATCH
DELETE
```

### Status Codes

What should happen when:

```text
Success?
Created?
Invalid data?
Not found?
Server error?
```

### Response Format

Will responses have a consistent structure?

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

---

# 26. Complete CRUD Map

Keep this map in your notes:

```text
                    STUDENTS RESOURCE

                       /students
                           │
             ┌─────────────┴─────────────┐
             │                           │
           GET                          POST
             │                           │
        Read all                    Create new
             │                           │
             └─────────────┬─────────────┘
                           │
                           ↓
                    /students/:id
                           │
          ┌────────┬───────┼────────┬────────┐
          ↓        ↓       ↓        ↓
         GET      PUT    PATCH    DELETE
          │        │       │        │
         Read    Update  Partial   Delete
         one             Update
```

---

# 27. The Big Picture

CRUD, REST, HTTP methods, status codes, and responses all work together:

```text
                    API DESIGN
                        │
                        ↓
                    RESOURCE
                        │
                        ↓
                    /students
                        │
           ┌────────────┼────────────┐
           ↓            ↓            ↓
          HTTP        ROUTES       RESPONSE
         Methods        │             │
           │            │             │
     ┌─────┼─────┐      │        Status + JSON
     ↓     ↓     ↓      │
    GET   POST DELETE    │
          PUT PATCH      │
                         ↓
                      CRUD
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Create           Read          Update/Delete
```

---

# Key Takeaways

## CRUD

```text
C → Create
R → Read
U → Update
D → Delete
```

## HTTP Mapping

```text
POST   → Create
GET    → Read
PUT    → Update
PATCH  → Partial Update
DELETE → Delete
```

## Resource Structure

```text
/students
```

represents the collection.

```text
/students/:id
```

represents an individual student.

## Typical CRUD API

```text
POST   /students
GET    /students
GET    /students/:id
PUT    /students/:id
PATCH  /students/:id
DELETE /students/:id
```

## The Most Important Pattern

```text
Collection
    ↓
/students

Individual Resource
    ↓
/students/:id
```

And then:

```text
POST /students
     ↓
Create

GET /students
     ↓
Read All

GET /students/:id
     ↓
Read One

PUT /students/:id
     ↓
Update

PATCH /students/:id
     ↓
Partial Update

DELETE /students/:id
     ↓
Delete
```

> **CRUD is the basic data lifecycle. REST gives us a clean way to expose that lifecycle through resource-based HTTP endpoints. Express gives us the tools to implement those endpoints.**
