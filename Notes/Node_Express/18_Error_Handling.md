# API Errors and Backend Error Handling

## 1. Introduction

While building backend APIs, not every request will be successful.

A client might:

* Send invalid data
* Request a resource that doesn't exist
* Provide invalid authentication
* Cause an unexpected server error
* Send an incorrectly formatted request

These situations are called **API errors**.

A good backend should handle errors properly and return a clear, safe, and predictable response.

---

# 2. What is an API Error?

An **API error** occurs when the server cannot successfully complete a client's request.

For example:

```text
Client
  ↓
GET /tasks/100
  ↓
Server
  ↓
Task 100 does not exist
  ↓
404 Not Found
```

The server should not simply crash or return an unclear response.

Instead, it should return useful information:

```json
{
    "message": "Task not found"
}
```

---

# 3. Why Error Handling is Important

Error handling is important because it helps:

### 1. Clients understand what happened

The frontend needs to know whether the request:

* Succeeded
* Failed because of invalid input
* Failed because authentication is required
* Failed because a resource doesn't exist
* Failed because of a server problem

### 2. Developers debug problems

Error information helps developers identify the source of a problem.

### 3. Keep APIs predictable

A consistent error format makes it easier for frontend applications to handle errors.

### 4. Protect sensitive information

Backend errors may contain sensitive information.

We should avoid sending details such as:

```text
Database connection strings
Passwords
API keys
Internal file paths
Stack traces
Database credentials
```

to the client.

---

# 4. Common Types of API Errors

Some common API errors include:

```text
Validation Error
Authentication Error
Authorization Error
Not Found Error
Server Error
```

Let's understand each one.

---

# 5. Validation Errors

A **validation error** occurs when the client sends invalid or incomplete data.

For example, suppose we have:

```http
POST /tasks
```

and the API requires:

```json
{
    "title": "Learn Express.js"
}
```

But the client sends:

```json
{
    "title": ""
}
```

The server can reject the request.

Response:

```text
400 Bad Request
```

```json
{
    "message": "Title is required"
}
```

---

# 6. Authentication Errors

An **authentication error** occurs when the client has not provided valid authentication credentials.

For example:

```http
GET /profile
```

but the user hasn't provided a valid authentication token.

The server might return:

```text
401 Unauthorized
```

```json
{
    "message": "Authentication required"
}
```

Authentication answers:

> **Who are you?**

---

# 7. Authorization Errors

Authentication and authorization are different.

### Authentication

Determines:

> Who are you?

### Authorization

Determines:

> Are you allowed to perform this action?

For example, a normal user tries to access an admin dashboard:

```http
GET /admin/dashboard
```

The user may be logged in but doesn't have permission.

The server can return:

```text
403 Forbidden
```

```json
{
    "message": "You do not have permission to access this resource"
}
```

---

# 8. Not Found Errors

A **404 Not Found** error occurs when the requested resource doesn't exist.

For example:

```http
GET /tasks/100
```

If task `100` doesn't exist:

```text
404 Not Found
```

Response:

```json
{
    "message": "Task not found"
}
```

Example Express route:

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

# 9. Server Errors

Sometimes something goes wrong inside the backend itself.

For example:

```text
Database failure
Unexpected exception
Third-party API failure
Programming bug
```

These are generally server-side problems.

The API can return:

```text
500 Internal Server Error
```

Example:

```json
{
    "message": "Internal server error"
}
```

We should **not** expose the actual internal error to the client.

Avoid returning something like:

```json
{
    "error": "MongoServerSelectionError: connection failed at /home/user/project/config/db.js"
}
```

This exposes unnecessary internal information.

Instead:

```json
{
    "message": "Internal server error"
}
```

The detailed error should be logged on the server.

---

# 10. Important HTTP Status Codes

Some important status codes to remember:

| Status Code | Meaning               | Example                         |
| ----------- | --------------------- | ------------------------------- |
| `200`       | OK                    | Successful GET                  |
| `201`       | Created               | Successful POST                 |
| `400`       | Bad Request           | Invalid input                   |
| `401`       | Unauthorized          | Authentication required/invalid |
| `403`       | Forbidden             | Permission denied               |
| `404`       | Not Found             | Resource doesn't exist          |
| `409`       | Conflict              | Duplicate/conflicting resource  |
| `500`       | Internal Server Error | Unexpected backend error        |

---

# 11. Basic Error Handling in Express

We can handle errors directly inside routes.

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

The important pattern is:

```text
Find resource
     ↓
Does it exist?
   /     \
 No       Yes
 ↓         ↓
404      200
 ↓         ↓
Error     Data
```

---

# 12. Why `return` is Important

Consider:

```js
if (!task) {

    return res.status(404).json({
        message: "Task not found"
    });

}
```

The `return` stops the function after sending the error response.

Without `return`, the code might continue executing and attempt to send another response.

This can lead to errors such as:

```text
Error [ERR_HTTP_HEADERS_SENT]
```

So this is a good pattern:

```js
if (!task) {
    return res.status(404).json({
        message: "Task not found"
    });
}
```

---

# 13. Consistent Error Responses

A good API should use a consistent response structure.

For example:

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

For authentication:

```json
{
    "success": false,
    "message": "Authentication required"
}
```

This makes frontend error handling easier.

For example:

```js
if (!response.ok) {

    const error = await response.json();

    console.log(error.message);

}
```

---

# 14. Centralized Error Handling

As our application grows, handling every error manually inside every route becomes repetitive.

For example:

```js
app.get("/users", ...);

app.get("/tasks", ...);

app.get("/products", ...);

app.get("/orders", ...);
```

Each route might have different error-handling code.

Instead, Express allows us to create **centralized error-handling middleware**.

---

# 15. What is Error-Handling Middleware?

Error-handling middleware is middleware specifically designed to handle errors.

Its structure has **four parameters**:

```js
(err, req, res, next)
```

Example:

```js
app.use((err, req, res, next) => {

    res.status(500).json({
        message: "Internal server error"
    });

});
```

Notice the four parameters:

```text
err
req
res
next
```

The first parameter, `err`, tells Express that this is an error-handling middleware.

---

# 16. Creating a Central Error Handler

Example:

```js
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});
```

Now errors can be handled in one central location.

---

# 17. How Centralized Error Handling Works

The flow looks like:

```text
Client
  ↓
Request
  ↓
Route
  ↓
Something goes wrong
  ↓
Error passed to middleware
  ↓
Central Error Handler
  ↓
Log error
  ↓
Send safe response
  ↓
Client
```

This makes the application easier to maintain.

---

# 18. Using `next()` to Pass Errors

Express provides `next()` to move control to the next middleware.

We can pass an error using:

```js
next(error);
```

Example:

```js
app.get("/tasks", (req, res, next) => {

    try {

        // Some backend logic

        throw new Error("Something went wrong");

    } catch (error) {

        next(error);

    }

});
```

The error is passed to the centralized error handler.

---

# 19. Centralized Error Handler Example

```js
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});
```

The client receives:

```json
{
    "success": false,
    "message": "Internal server error"
}
```

While the server console contains the detailed error.

---

# 20. Logging Errors

Developers need detailed information for debugging.

We can log errors:

```js
console.error(err);
```

For example:

```js
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });

});
```

The important idea is:

```text
SERVER
 ↓
Detailed error
 ↓
Logs

CLIENT
 ↓
Safe error message
```

Don't give the client your backend's entire diary of suffering. 😄

---

# 21. Safe Error Handling

A good backend follows this principle:

> **Log detailed errors internally, but return safe and useful messages to clients.**

### Bad

```json
{
    "error": "MongoServerError: E11000 duplicate key error..."
}
```

### Better

```json
{
    "message": "Email already exists"
}
```

The server logs the technical details, while the client receives a useful explanation.

---

# 22. Example: Validation + Error Handling

Consider a POST request:

```http
POST /tasks
```

Request:

```json
{
    "title": ""
}
```

Route:

```js
app.post("/tasks", (req, res) => {

    const { title } = req.body;

    if (!title) {

        return res.status(400).json({
            success: false,
            message: "Title is required"
        });

    }

    const task = {
        id: tasks.length + 1,
        title: title,
        completed: false
    };

    tasks.push(task);

    res.status(201).json({
        success: true,
        task: task
    });

});
```

The API responds with:

```text
400 Bad Request
```

```json
{
    "success": false,
    "message": "Title is required"
}
```

---

# 23. Example: Resource Not Found

```js
app.get("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            success: false,
            message: "Task not found"
        });

    }

    res.status(200).json({
        success: true,
        task: task
    });

});
```

Request:

```text
GET /tasks/100
```

Response:

```text
404 Not Found
```

```json
{
    "success": false,
    "message": "Task not found"
}
```

---

# 24. Error Handling in a Real API

As the application becomes larger, the architecture can look like:

```text
Client
  ↓
Express
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database
  ↓
Error
  ↓
Central Error Handler
  ↓
Response
```

Centralized error handling prevents every layer from having to manually construct client responses.

---

# 25. Common Error-Handling Mistakes

### Mistake 1 — Always returning `200`

Bad:

```js
res.status(200).json({
    message: "Task not found"
});
```

Better:

```js
res.status(404).json({
    message: "Task not found"
});
```

The status code should accurately describe the result.

---

### Mistake 2 — Exposing sensitive errors

Avoid:

```js
res.json(error);
```

because the error may contain sensitive information.

Instead:

```js
console.error(error);

res.status(500).json({
    message: "Internal server error"
});
```

---

### Mistake 3 — Inconsistent error formats

Avoid returning:

```json
{
    "message": "Task not found"
}
```

from one route and:

```json
{
    "errorMessage": "User doesn't exist"
}
```

from another.

Choose a consistent structure.

---

### Mistake 4 — Forgetting `return`

Avoid:

```js
if (!task) {

    res.status(404).json({
        message: "Task not found"
    });

}

res.json(task);
```

Better:

```js
if (!task) {

    return res.status(404).json({
        message: "Task not found"
    });

}

res.json(task);
```

---

# 26. Error Handling Flow

A useful mental model:

```text
               CLIENT REQUEST
                      │
                      ↓
                  EXPRESS
                      │
                      ↓
                    ROUTE
                      │
              ┌───────┴───────┐
              │               │
           Success           Error
              │               │
              ↓               ↓
         200 / 201       Error Handler
                              │
                              ↓
                       Log detailed error
                              │
                              ↓
                       Safe JSON response
                              │
                              ↓
                       400/401/403/404/500
```

---

# 27. Recommended Error Response Structure

A simple consistent structure is:

```json
{
    "success": false,
    "message": "Task not found"
}
```

For successful responses:

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Learn Express.js",
        "completed": false
    }
}
```

This isn't mandatory for every API, but having a consistent response design makes APIs easier to consume.

---

# 28. Key Status Code Categories

HTTP status codes can be remembered by their first digit:

```text
1xx → Informational

2xx → Success
      ↓
      200 OK
      201 Created

3xx → Redirection

4xx → Client Error
      ↓
      400 Bad Request
      401 Unauthorized
      403 Forbidden
      404 Not Found

5xx → Server Error
      ↓
      500 Internal Server Error
```

A useful shortcut:

```text
2xx → "Everything worked"
4xx → "Your request has a problem"
5xx → "The server has a problem"
```

---

# 29. What You Have Learned

You now understand:

* What API errors are
* Why backend error handling matters
* Validation errors
* Authentication errors
* Authorization errors
* Not found errors
* Server errors
* HTTP status codes
* Error response formats
* Centralized error handling
* Express error-handling middleware
* `next(error)`
* Server-side error logging
* Safe error messages

---

# 30. Final Mental Model

Remember this:

```text
HTTP Method
     ↓
Route
     ↓
Process Request
     ↓
┌───────────────┐
│               │
Success        Error
│               │
↓               ↓
2xx          Error Handler
│               │
↓               ↓
Data         Log Error
                │
                ↓
             Safe JSON
```

The most important principle is:

> **A good API doesn't just handle successful requests. It handles failures clearly, consistently, and safely.**

And the golden rule:

```text
Detailed error → Server logs
Safe message   → Client
Correct status → HTTP response
```
