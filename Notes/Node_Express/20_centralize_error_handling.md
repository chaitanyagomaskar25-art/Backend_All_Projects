# Centralized Error Handling in Express.js

## 1. Introduction

As an Express.js application grows, many routes can produce errors.

For example:

```text
GET /tasks/:id
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

Each route might encounter problems such as:

* Task not found
* Invalid input
* Missing required fields
* Invalid data types
* Unknown API endpoint
* Unexpected server errors

If every route handles these errors separately, the code can become repetitive and inconsistent.

A better approach is to use **centralized error handling**.

---

# 2. What is Centralized Error Handling?

Centralized error handling means that errors from different parts of the application are sent to **one common error-handling middleware**.

Instead of doing this inside every route:

```js
return res.status(404).json({
    success: false,
    message: "Task not found"
});
```

we can create an error and pass it to:

```js
next(error);
```

Then a centralized error handler processes it.

The flow becomes:

```text
Request
   ↓
Route / Middleware
   ↓
Error occurs
   ↓
next(error)
   ↓
Central Error Handler
   ↓
JSON Response
```

---

# 3. Why Centralized Error Handling?

Centralized error handling provides:

* Cleaner route handlers
* Consistent error responses
* Less duplicate code
* Easier debugging
* Easier maintenance
* Better scalability

Instead of having error-response logic everywhere:

```text
Route 1 → Error Response
Route 2 → Error Response
Route 3 → Error Response
Route 4 → Error Response
```

we have:

```text
Route 1 ─┐
Route 2 ─┤
Route 3 ─┼──→ Central Error Handler
Route 4 ─┘
```

---

# 4. Creating an Error Object

JavaScript provides the `Error` object.

Example:

```js
const error = new Error("Task not found");
```

This creates an error containing:

```text
message → "Task not found"
```

We can pass the error to Express:

```js
next(error);
```

---

# 5. Adding a Status Code to an Error

By default, an Error object doesn't contain an HTTP status code.

We can add one:

```js
const error = new Error("Task not found");

error.statusCode = 404;

next(error);
```

Now the error contains:

```text
message
   ↓
"Task not found"

statusCode
   ↓
404
```

The centralized error handler can use this information.

---

# 6. Validation Middleware with Centralized Errors

Previously, our validation middleware directly returned a response:

```js
if (!title) {

    return res.status(400).json({
        message: "Title is required"
    });

}
```

With centralized error handling, we can instead create an error:

```js
if (!title) {

    const error = new Error("Title is required");

    error.statusCode = 400;

    return next(error);

}
```

Now the middleware doesn't decide how the final response should look.

It simply says:

> There is an error. Please handle it.

---

# 7. Validation Middleware Example

```js
const validateTask = (req, res, next) => {

    const { title, completed } = req.body;

    if (!title || title.trim() === "") {

        const error = new Error("Title is required");

        error.statusCode = 400;

        return next(error);

    }

    if (typeof completed !== "boolean") {

        const error = new Error(
            "Completed must be a boolean"
        );

        error.statusCode = 400;

        return next(error);

    }

    next();

};
```

The important pattern is:

```text
Invalid data
    ↓
Create Error
    ↓
Set statusCode
    ↓
next(error)
    ↓
Central Error Handler
```

---

# 8. Handling "Task Not Found"

Suppose we have:

```js
GET /tasks/:id
```

We search for the task:

```js
const task = tasks.find(
    task => task.id === id
);
```

If the task doesn't exist:

```js
if (!task) {

    const error = new Error("Task not found");

    error.statusCode = 404;

    return next(error);

}
```

Notice that the route does **not** directly send the error response.

Instead:

```text
Route
 ↓
next(error)
 ↓
Central Error Handler
```

---

# 9. GET All Tasks

The GET-all route usually doesn't need special error handling in this simple example.

```js
app.get("/tasks", (req, res) => {

    res.status(200).json({
        success: true,
        data: tasks
    });

});
```

If everything works:

```text
200 OK
```

---

# 10. GET One Task

```js
app.get("/tasks/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {

        const error = new Error("Task not found");

        error.statusCode = 404;

        return next(error);

    }

    res.status(200).json({
        success: true,
        data: task
    });

});
```

If the task exists:

```text
200 OK
```

If it doesn't:

```text
next(error)
   ↓
Central Error Handler
   ↓
404
```

---

# 11. POST Create Task

The POST route can use our validation middleware.

```js
app.post("/tasks", validateTask, (req, res, next) => {

    try {

        const newTask = {
            id: tasks.length + 1,
            title: req.body.title,
            completed: req.body.completed
        };

        tasks.push(newTask);

        res.status(201).json({
            success: true,
            data: newTask
        });

    } catch (error) {

        next(error);

    }

});
```

The flow is:

```text
POST /tasks
     ↓
validateTask
     ↓
Valid?
  /     \
 No      Yes
 ↓        ↓
Error   Create Task
 ↓        ↓
next()  201
 ↓
Central Error Handler
```

---

# 12. PUT Update Task

```js
app.put("/tasks/:id", validateTask, (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const task = tasks.find(
            task => task.id === id
        );

        if (!task) {

            const error = new Error("Task not found");

            error.statusCode = 404;

            return next(error);

        }

        task.title = req.body.title;
        task.completed = req.body.completed;

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {

        next(error);

    }

});
```

---

# 13. DELETE Task

```js
app.delete("/tasks/:id", (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const index = tasks.findIndex(
            task => task.id === id
        );

        if (index === -1) {

            const error = new Error("Task not found");

            error.statusCode = 404;

            return next(error);

        }

        const deletedTask = tasks.splice(index, 1);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask[0]
        });

    } catch (error) {

        next(error);

    }

});
```

---

# 14. Route Not Found Middleware

What happens if the client requests:

```text
GET /abc
```

but we don't have:

```text
/abc
```

as a route?

We can create a **route-not-found middleware**.

```js
app.use((req, res, next) => {

    const error = new Error(
        `Route ${req.originalUrl} not found`
    );

    error.statusCode = 404;

    next(error);

});
```

Now:

```text
GET /abc
```

produces:

```text
next(error)
   ↓
Central Error Handler
```

---

# 15. Why Route Not Found Middleware Comes After Routes

Middleware executes in order.

Therefore, our routes should be defined first:

```js
app.get("/tasks", ...);

app.get("/tasks/:id", ...);

app.post("/tasks", ...);

app.put("/tasks/:id", ...);

app.delete("/tasks/:id", ...);
```

Then:

```js
app.use((req, res, next) => {

    // Route not found

});
```

This means:

```text
Request
   ↓
Try registered routes
   ↓
Route found?
  /      \
Yes       No
 ↓         ↓
Route    404 Middleware
           ↓
        next(error)
```

---

# 16. Creating the Central Error Handler

Now we create the most important part:

```js
app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error"
    });

});
```

This middleware receives:

```js
(err, req, res, next)
```

The first parameter is `err`.

That tells Express:

> This is an error-handling middleware.

---

# 17. Understanding the Default Status Code

Consider:

```js
const statusCode = err.statusCode || 500;
```

If our error contains:

```js
error.statusCode = 404;
```

then:

```text
statusCode = 404
```

If an unexpected error doesn't have a status code:

```text
statusCode = 500
```

So:

```text
Known error
    ↓
Use its status code

Unknown error
    ↓
Use 500
```

---

# 18. Consistent Error Response

Our centralized error handler returns:

```json
{
    "success": false,
    "message": "Task not found"
}
```

For validation:

```json
{
    "success": false,
    "message": "Title is required"
}
```

For an unknown route:

```json
{
    "success": false,
    "message": "Route /abc not found"
}
```

This gives our API a consistent response structure.

---

# 19. Complete Centralized Error Handling Example

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

    if (!title || title.trim() === "") {

        const error = new Error("Title is required");

        error.statusCode = 400;

        return next(error);

    }

    if (typeof completed !== "boolean") {

        const error = new Error(
            "Completed must be a boolean"
        );

        error.statusCode = 400;

        return next(error);

    }

    next();
};

// GET all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json({
        success: true,
        data: tasks
    });

});

// GET one task
app.get("/tasks/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {

        const error = new Error("Task not found");

        error.statusCode = 404;

        return next(error);

    }

    res.status(200).json({
        success: true,
        data: task
    });

});

// POST create task
app.post("/tasks", validateTask, (req, res, next) => {

    try {

        const newTask = {
            id: tasks.length + 1,
            title: req.body.title,
            completed: req.body.completed
        };

        tasks.push(newTask);

        res.status(201).json({
            success: true,
            data: newTask
        });

    } catch (error) {

        next(error);

    }

});

// PUT update task
app.put("/tasks/:id", validateTask, (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const task = tasks.find(
            task => task.id === id
        );

        if (!task) {

            const error = new Error("Task not found");

            error.statusCode = 404;

            return next(error);

        }

        task.title = req.body.title;
        task.completed = req.body.completed;

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {

        next(error);

    }

});

// DELETE task
app.delete("/tasks/:id", (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const index = tasks.findIndex(
            task => task.id === id
        );

        if (index === -1) {

            const error = new Error("Task not found");

            error.statusCode = 404;

            return next(error);

        }

        const deletedTask = tasks.splice(index, 1);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask[0]
        });

    } catch (error) {

        next(error);

    }

});

// Route not found middleware
app.use((req, res, next) => {

    const error = new Error(
        `Route ${req.originalUrl} not found`
    );

    error.statusCode = 404;

    next(error);

});

// Centralized error-handling middleware
app.use((err, req, res, next) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error"
    });

});

// Start server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
```

---

# 20. Understanding the Complete Flow

The entire API now follows this structure:

```text
                    CLIENT
                       │
                       ↓
                 HTTP REQUEST
                       │
                       ↓
                  Express App
                       │
                       ↓
               Middleware
                       │
                       ↓
                    Route
                       │
             ┌─────────┴─────────┐
             │                   │
          Success              Error
             │                   │
             ↓                   ↓
         Response           next(error)
                                 │
                                 ↓
                       Central Error Handler
                                 │
                                 ↓
                           JSON Response
```

---

# 21. Example: Task Not Found

Client sends:

```http
GET /tasks/100
```

Suppose task `100` doesn't exist.

The route does:

```js
const error = new Error("Task not found");

error.statusCode = 404;

next(error);
```

Then:

```text
next(error)
     ↓
Central Error Handler
     ↓
statusCode = 404
     ↓
JSON Response
```

Client receives:

```json
{
    "success": false,
    "message": "Task not found"
}
```

---

# 22. Example: Invalid Task

Client sends:

```http
POST /tasks
```

with:

```json
{
    "title": "",
    "completed": false
}
```

The validation middleware detects the problem:

```js
if (!title || title.trim() === "") {

    const error = new Error("Title is required");

    error.statusCode = 400;

    return next(error);
}
```

Flow:

```text
POST /tasks
     ↓
validateTask
     ↓
Invalid title
     ↓
next(error)
     ↓
Central Error Handler
     ↓
400 Bad Request
```

Response:

```json
{
    "success": false,
    "message": "Title is required"
}
```

---

# 23. Example: Unknown Route

Client requests:

```http
GET /products
```

But our API doesn't have a `/products` route.

The route-not-found middleware catches it:

```js
app.use((req, res, next) => {

    const error = new Error(
        `Route ${req.originalUrl} not found`
    );

    error.statusCode = 404;

    next(error);

});
```

The final response:

```text
404 Not Found
```

```json
{
    "success": false,
    "message": "Route /products not found"
}
```

---

# 24. Why This Architecture is Better

Without centralized error handling:

```text
Route
 ↓
Check error
 ↓
Create response
 ↓
Repeat in every route
```

With centralized error handling:

```text
Route
 ↓
Detect error
 ↓
next(error)
 ↓
Central Error Handler
 ↓
Consistent response
```

This gives us:

### Cleaner Routes

Routes focus mainly on application logic.

### Reusable Error Handling

One error handler handles errors from many places.

### Consistent Responses

Every error can follow the same JSON structure.

### Easier Maintenance

Changes to error responses can be made in one place.

### Better Scalability

The same architecture works when the application grows.

---

# 25. Middleware Order

This is extremely important.

A typical Express application should be organized like:

```text
1. JSON middleware
        ↓
2. Application middleware
        ↓
3. Routes
        ↓
4. Route-not-found middleware
        ↓
5. Central error middleware
```

Example:

```js
app.use(express.json());

app.use(logger);

app.get("/tasks", ...);

app.post("/tasks", ...);

app.use(routeNotFound);

app.use(errorHandler);
```

The order matters because Express processes middleware sequentially.

---

# 26. Important Difference: `next()` vs `next(error)`

### `next()`

Means:

> Continue normally.

```js
next();
```

Flow:

```text
Middleware
    ↓
next()
    ↓
Next middleware / route
```

### `next(error)`

Means:

> Something went wrong. Send this error to the error-handling middleware.

```js
next(error);
```

Flow:

```text
Middleware
    ↓
next(error)
    ↓
Error Handler
```

Remember:

```text
next()
     ↓
Continue

next(error)
     ↓
Handle error
```

---

# 27. Key Takeaways

### Centralized Error Handling

A single middleware handles errors from different parts of the application.

### `Error`

Used to create an error object:

```js
const error = new Error("Task not found");
```

### `statusCode`

Can be attached to the error:

```js
error.statusCode = 404;
```

### `next(error)`

Passes the error to the centralized error handler:

```js
next(error);
```

### Error Middleware

Must have four parameters:

```js
(err, req, res, next)
```

### Default `500`

Unexpected errors can use:

```js
const statusCode = err.statusCode || 500;
```

### Route Not Found

Unknown endpoints can be caught with middleware after all routes.

---

# 28. Final Mental Model

Keep this picture in your head:

```text
                         REQUEST
                            │
                            ↓
                       Express App
                            │
                            ↓
                       Middleware
                            │
                            ↓
                          Route
                            │
                    ┌───────┴───────┐
                    │               │
                  Valid           Error
                    │               │
                    ↓               ↓
              Business Logic    next(error)
                    │               │
                    ↓               ↓
                Success       Error Handler
                    │               │
                    ↓               ↓
                  200/201         400/404/500
                    │               │
                    └───────┬───────┘
                            ↓
                       JSON Response
                            │
                            ↓
                          CLIENT
```

> **The goal of centralized error handling is simple: routes detect problems, `next(error)` forwards them, and one central middleware decides how the API responds.**

This pattern becomes especially valuable once you move from a small in-memory Task API to **Express + Controllers + Services + MongoDB/Mongoose**.
