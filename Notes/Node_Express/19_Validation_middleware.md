# Middleware Validation in Express.js

## 1. Introduction

When a client sends data to our API, we should not immediately process that data.

The data may be:

* Missing
* Empty
* Incorrect
* In the wrong format
* Invalid for our application

For example, suppose our Task API expects:

```json
{
    "title": "Learn Express.js",
    "completed": false
}
```

But the client sends:

```json
{
    "title": "",
    "completed": "yes"
}
```

This is invalid data.

Instead of allowing this data to reach our main application logic, we can use **middleware** to validate it first.

---

# 2. What is Middleware?

Middleware is a function that runs **between the incoming request and the final route handler**.

Basic structure:

```js
app.use((req, res, next) => {

    // Middleware logic

    next();

});
```

The request flow becomes:

```text
Client
   ↓
Request
   ↓
Middleware
   ↓
Validation
   ↓
Route Handler
   ↓
Response
```

Middleware can:

* Validate data
* Authenticate users
* Log requests
* Modify requests
* Handle errors
* Check permissions

---

# 3. Why Use Validation Middleware?

Without middleware, we might write validation inside every route.

For example:

```js
app.post("/tasks", (req, res) => {

    if (!req.body.title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Create task
});
```

Then we might repeat the same validation in the update route:

```js
app.put("/tasks/:id", (req, res) => {

    if (!req.body.title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Update task
});
```

This creates duplicate code.

Instead, we can create one reusable middleware:

```text
validateTask
     ↓
POST /tasks
PUT /tasks/:id
```

Now validation is written only once.

---

# 4. Creating Task Validation Middleware

Let's create a middleware function:

```js
const validateTask = (req, res, next) => {

    const { title, completed } = req.body;

    if (!title || title.trim() === "") {

        return res.status(400).json({
            message: "Title is required"
        });

    }

    if (typeof completed !== "boolean") {

        return res.status(400).json({
            message: "Completed must be a boolean"
        });

    }

    next();

};
```

---

# 5. Understanding the Validation

Let's break the middleware into pieces.

### Get data from request body

```js
const { title, completed } = req.body;
```

Suppose the client sends:

```json
{
    "title": "Learn Express.js",
    "completed": false
}
```

Then:

```text
title
 ↓
"Learn Express.js"

completed
 ↓
false
```

---

# 6. Validating the Title

We check:

```js
if (!title || title.trim() === "") {
```

This catches cases such as:

```json
{}
```

or:

```json
{
    "title": ""
}
```

or:

```json
{
    "title": "   "
}
```

If the title is invalid:

```js
return res.status(400).json({
    message: "Title is required"
});
```

The client receives:

```text
400 Bad Request
```

```json
{
    "message": "Title is required"
}
```

---

# 7. Why Use `trim()`?

Consider:

```json
{
    "title": "     "
}
```

Technically, the string exists.

But it doesn't contain meaningful text.

Using:

```js
title.trim()
```

removes whitespace from the beginning and end.

Example:

```js
"   Learn Express   ".trim()
```

becomes:

```text
"Learn Express"
```

And:

```js
"     ".trim()
```

becomes:

```text
""
```

Therefore:

```js
title.trim() === ""
```

helps detect an empty or whitespace-only title.

---

# 8. Validating `completed`

Our API expects `completed` to be a Boolean.

Valid values:

```js
true
```

or:

```js
false
```

Invalid values include:

```js
"true"
```

```js
"false"
```

```js
1
```

```js
0
```

```js
"yes"
```

We can check the type using:

```js
typeof completed
```

For example:

```js
typeof true
```

returns:

```text
"boolean"
```

But:

```js
typeof "true"
```

returns:

```text
"string"
```

Therefore:

```js
if (typeof completed !== "boolean")
```

checks whether the value is actually a Boolean.

---

# 9. Calling `next()`

At the end of our middleware:

```js
next();
```

means:

> Validation passed. Continue to the next middleware or route handler.

The flow is:

```text
Request
   ↓
validateTask
   ↓
Is data valid?
   │
   ├── No → 400 Response
   │
   └── Yes
        ↓
      next()
        ↓
   Route Handler
```

---

# 10. What Happens If We Don't Call `next()`?

Suppose validation succeeds but we don't call:

```js
next();
```

Then the request will not continue to the route handler.

For example:

```js
const validateTask = (req, res, next) => {

    console.log("Validation passed");

    // next() missing
};
```

The request effectively gets stuck.

So remember:

```text
Valid request
     ↓
next()
     ↓
Continue
```

While:

```text
Invalid request
     ↓
res.status(...).json(...)
     ↓
Stop
```

---

# 11. Applying Middleware to POST

Now we can apply our middleware to the create route.

```js
app.post("/tasks", validateTask, (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});
```

Notice:

```js
validateTask
```

comes before the route handler.

The execution order is:

```text
POST /tasks
     ↓
validateTask
     ↓
Route Handler
```

---

# 12. Applying Middleware to PUT

We can use the same middleware for updating tasks:

```js
app.put("/tasks/:id", validateTask, (req, res) => {

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

Now both routes use the same validation:

```text
POST /tasks
     ↓
validateTask
     ↓
Create task
```

```text
PUT /tasks/:id
     ↓
validateTask
     ↓
Update task
```

---

# 13. Complete Example

Here is the complete example:

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
    }
];

// Validation middleware
const validateTask = (req, res, next) => {

    const { title, completed } = req.body;

    // Validate title
    if (!title || title.trim() === "") {

        return res.status(400).json({
            message: "Title is required"
        });

    }

    // Validate completed
    if (typeof completed !== "boolean") {

        return res.status(400).json({
            message: "Completed must be a boolean"
        });

    }

    next();
};

// GET all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});

// GET one task
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
app.post("/tasks", validateTask, (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});

// PUT - Update task
app.put("/tasks/:id", validateTask, (req, res) => {

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

# 14. Testing Valid Data with Postman

Send:

```http
POST http://localhost:3000/tasks
```

Body:

```json
{
    "title": "Learn MongoDB",
    "completed": false
}
```

The middleware checks:

```text
title exists?       ✓
title not empty?    ✓
completed boolean?  ✓
```

Then:

```text
next()
 ↓
POST route
 ↓
Create task
 ↓
201 Created
```

Response:

```json
{
    "id": 3,
    "title": "Learn MongoDB",
    "completed": false
}
```

---

# 15. Testing Invalid Title

Send:

```json
{
    "title": "",
    "completed": false
}
```

Middleware detects:

```text
title is empty
```

Response:

```text
400 Bad Request
```

```json
{
    "message": "Title is required"
}
```

The route handler is **never executed**.

---

# 16. Testing Invalid `completed`

Send:

```json
{
    "title": "Learn MongoDB",
    "completed": "yes"
}
```

The middleware checks:

```js
typeof completed
```

Result:

```text
"string"
```

But we need:

```text
"boolean"
```

Therefore:

```text
400 Bad Request
```

Response:

```json
{
    "message": "Completed must be a boolean"
}
```

Again, the route handler is not executed.

---

# 17. Middleware as a Security/Validation Gate

Think of middleware as a checkpoint.

```text
             REQUEST
                ↓
        ┌───────────────┐
        │   Middleware  │
        │   Validation  │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        ↓               ↓
     Invalid           Valid
        ↓               ↓
      400            next()
                        ↓
                  Route Handler
                        ↓
                    Database
```

The important principle is:

> **Bad data should be rejected as early as possible.**

---

# 18. Why Middleware is Better Than Repeating Code

Without middleware:

```text
POST /tasks
 ↓
Validation

PUT /tasks/:id
 ↓
Validation

PATCH /tasks/:id
 ↓
Validation
```

The validation code gets repeated.

With middleware:

```text
              validateTask
               /        \
              ↓          ↓
       POST /tasks   PUT /tasks/:id
```

One validation function can be reused.

This gives us:

* Less duplicate code
* Easier maintenance
* Consistent validation
* Cleaner routes
* Better organization

---

# 19. Middleware Can Do More Than Validation

Validation is only one use of middleware.

### Logging

```js
app.use((req, res, next) => {

    console.log(req.method, req.url);

    next();

});
```

### Authentication

```js
const authenticate = (req, res, next) => {

    // Check authentication

    next();

};
```

### Authorization

```js
const isAdmin = (req, res, next) => {

    // Check admin permission

    next();

};
```

### Error Handling

```js
app.use((err, req, res, next) => {

    res.status(500).json({
        message: "Internal server error"
    });

});
```

---

# 20. Multiple Middleware Functions

A route can have multiple middleware functions.

Example:

```js
app.post(
    "/tasks",
    authenticate,
    validateTask,
    createTask
);
```

The execution order is:

```text
Request
   ↓
authenticate
   ↓
validateTask
   ↓
createTask
   ↓
Response
```

If authentication fails:

```text
authenticate
     ↓
401
     ↓
STOP
```

If validation fails:

```text
validateTask
     ↓
400
     ↓
STOP
```

Only when everything passes does the request reach:

```text
createTask
```

---

# 21. Middleware Execution Order

Middleware runs in the order in which it is defined.

For example:

```js
app.use(express.json());

app.use(logger);

app.use(authenticate);

app.post("/tasks", validateTask, createTask);
```

The request flow can be:

```text
Request
   ↓
express.json()
   ↓
logger
   ↓
authenticate
   ↓
validateTask
   ↓
createTask
   ↓
Response
```

This is why middleware order matters.

---

# 22. `express.json()` is Also Middleware

Earlier we used:

```js
app.use(express.json());
```

This is middleware provided by Express.

Its job is to parse incoming JSON request bodies.

For example, the client sends:

```json
{
    "title": "Learn Express.js",
    "completed": false
}
```

`express.json()` allows us to access it through:

```js
req.body
```

Without JSON parsing middleware, `req.body` may not contain the parsed JSON data we expect.

---

# 23. Important Middleware Pattern

Remember this structure:

```js
const middleware = (req, res, next) => {

    // Check or process request

    next();

};
```

Three important objects:

### `req`

Contains information about the request.

```js
req.body
req.params
req.query
req.headers
```

### `res`

Used to send a response.

```js
res.json()
res.send()
res.status()
```

### `next`

Moves the request to the next middleware or route handler.

```js
next();
```

---

# 24. Validation Middleware Mental Model

Think of middleware like a security checkpoint at an airport:

```text
Passenger
   ↓
Security Check
   ↓
Valid? ─── No ──→ Stop
   │
  Yes
   ↓
Continue
```

In Express:

```text
Request
   ↓
Validation Middleware
   ↓
Valid? ─── No ──→ 400 Response
   │
  Yes
   ↓
next()
   ↓
Route Handler
```

---

# 25. Key Takeaways

### Middleware

A function that runs during the request-response cycle.

### Validation Middleware

Checks whether incoming data is valid before allowing the request to continue.

### `next()`

Allows the request to continue.

### `return res.status(...)`

Stops the request and sends an error response.

### `req.body`

Contains parsed request body data.

### `typeof`

Can be used to check the type of a value.

Example:

```js
typeof completed === "boolean"
```

### Reusability

The same middleware can be applied to multiple routes.

---

# 26. Final Mental Model

The most important thing to remember:

```text
              CLIENT
                 │
                 ↓
             HTTP Request
                 │
                 ↓
        ┌─────────────────┐
        │    Middleware   │
        │                 │
        │   Validate      │
        │   Authenticate  │
        │   Log           │
        └────────┬────────┘
                 │
           Is request valid?
              /       \
            No         Yes
            ↓           ↓
          400         next()
                        │
                        ↓
                  Route Handler
                        │
                        ↓
                  Business Logic
                        │
                        ↓
                    Response
```

> **Middleware allows us to perform common processing before the request reaches the main route logic. Validation middleware is especially useful because it rejects bad data early and keeps route handlers clean and reusable.**
