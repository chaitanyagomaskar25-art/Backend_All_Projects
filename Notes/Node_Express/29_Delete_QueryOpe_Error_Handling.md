# Delete, Query Operators & Error Handling

In this lesson, we complete the **DELETE** part of CRUD and then learn two important concepts that make MongoDB APIs more powerful and production-ready:

* Delete operations
* Common MongoDB query operators
* Advanced error handling
* Async error-handling helper
* Custom errors
* Centralized error middleware

---

# 1. DELETE Operations

We already know CRUD:

```text
C → Create → POST
R → Read   → GET
U → Update → PUT / PATCH
D → Delete → DELETE
```

Now we are learning:

```text
DELETE
```

Delete means permanently removing a document from MongoDB.

For our Task API, we can have:

```text
DELETE /tasks/:id
```

Example:

```text
DELETE /tasks/64abc123
```

This means:

> Delete the task whose `_id` is `64abc123`.

---

# 2. Mongoose Delete Methods

Mongoose provides several methods for deleting documents.

The three important ones are:

```js
deleteOne()
deleteMany()
findByIdAndDelete()
```

---

# 3. `findByIdAndDelete()`

This method deletes one document using its `_id`.

Syntax:

```js
Model.findByIdAndDelete(id)
```

Example:

```js
const task = await Task.findByIdAndDelete(req.params.id);
```

Here:

```js
req.params.id
```

contains the task ID from:

```text
DELETE /tasks/:id
```

---

# 4. Complete DELETE Route

A basic DELETE route:

```js
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
```

---

# 5. Understanding the DELETE Route

## Step 1 — Route

```js
app.delete("/tasks/:id", async (req, res) => {
```

This handles:

```text
DELETE /tasks/:id
```

---

## Step 2 — Get the ID

```js
req.params.id
```

For:

```text
DELETE /tasks/64abc123
```

we get:

```js
req.params.id
```

→

```text
64abc123
```

---

## Step 3 — Delete the Document

```js
const task = await Task.findByIdAndDelete(req.params.id);
```

Mongoose searches MongoDB for the document with that `_id`.

If found:

```text
Document found
      ↓
Delete document
      ↓
Return deleted document
```

If not found:

```text
No matching document
      ↓
return null
```

---

# 6. Why Check `if (!task)`?

This is extremely important.

Consider:

```js
const task = await Task.findByIdAndDelete(req.params.id);
```

If the task doesn't exist, Mongoose can return:

```js
null
```

So we check:

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

This gives the client an accurate response.

Without this check, we might return:

```text
200 OK
Task deleted successfully
```

even though **nothing was deleted**.

That can mislead the frontend.

---

# 7. Why `return`?

Consider:

```js
if (!task) {
  res.status(404).json({
    message: "Task not found"
  });
}

res.status(200).json({
  message: "Task deleted successfully"
});
```

There is a problem.

After sending the `404` response, execution may continue and attempt to send another response.

Instead:

```js
if (!task) {
  return res.status(404).json({
    message: "Task not found"
  });
}
```

The `return` stops execution.

Flow:

```text
Task doesn't exist
      ↓
404 response
      ↓
return
      ↓
Route stops
```

---

# 8. `deleteOne()`

`deleteOne()` deletes the first document matching a filter.

Syntax:

```js
Model.deleteOne(filter)
```

Example:

```js
await Task.deleteOne({
  completed: true
});
```

This means:

> Find a matching task where `completed` is `true` and delete one document.

---

# 9. `deleteMany()`

`deleteMany()` deletes all documents matching a filter.

Syntax:

```js
Model.deleteMany(filter)
```

Example:

```js
await Task.deleteMany({
  completed: true
});
```

This means:

> Delete all completed tasks.

This can be dangerous because multiple documents can be removed.

Use it carefully.

---

# 10. Delete Methods Comparison

| Method                  | Purpose                       |
| ----------------------- | ----------------------------- |
| `findByIdAndDelete(id)` | Delete one document by `_id`  |
| `deleteOne(filter)`     | Delete one matching document  |
| `deleteMany(filter)`    | Delete all matching documents |

Mental model:

```text
findByIdAndDelete()
        ↓
       ID

deleteOne()
        ↓
     Filter
        ↓
    One document

deleteMany()
        ↓
     Filter
        ↓
  Multiple documents
```

---

# 11. Common MongoDB Query Operators

MongoDB provides many operators for filtering documents.

For example:

```js
Task.find({
  priority: "high"
});
```

This is simple equality filtering.

But what if we want:

```text
age greater than 18
price less than 100
priority is either high or medium
title matches a pattern
field exists
```

This is where **query operators** become useful.

MongoDB operators usually start with:

```text
$
```

Examples:

```text
$gt
$gte
$lt
$lte
$eq
$ne
$in
$nin
$regex
$exists
```

---

# 12. Comparison Operators

Comparison operators compare values.

## `$gt`

Means:

```text
greater than
```

Example:

```js
Task.find({
  age: { $gt: 18 }
});
```

Meaning:

```text
age > 18
```

---

## `$gte`

Means:

```text
greater than or equal to
```

Example:

```js
Task.find({
  age: { $gte: 18 }
});
```

Meaning:

```text
age >= 18
```

---

## `$lt`

Means:

```text
less than
```

Example:

```js
Task.find({
  age: { $lt: 18 }
});
```

Meaning:

```text
age < 18
```

---

## `$lte`

Means:

```text
less than or equal to
```

Example:

```js
Task.find({
  age: { $lte: 18 }
});
```

Meaning:

```text
age <= 18
```

---

## `$eq`

Means:

```text
equal to
```

Example:

```js
Task.find({
  priority: { $eq: "high" }
});
```

This is equivalent to:

```js
Task.find({
  priority: "high"
});
```

---

## `$ne`

Means:

```text
not equal to
```

Example:

```js
Task.find({
  priority: { $ne: "low" }
});
```

Meaning:

```text
priority != "low"
```

---

# 13. Comparison Operators Summary

| Operator | Meaning               | Example                 |
| -------- | --------------------- | ----------------------- |
| `$gt`    | Greater than          | `{ age: { $gt: 18 } }`  |
| `$gte`   | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt`    | Less than             | `{ age: { $lt: 18 } }`  |
| `$lte`   | Less than or equal    | `{ age: { $lte: 18 } }` |
| `$eq`    | Equal                 | `{ age: { $eq: 18 } }`  |
| `$ne`    | Not equal             | `{ age: { $ne: 18 } }`  |

---

# 14. Membership Operators

Membership operators allow us to check whether a value belongs to a list.

The two important ones are:

```text
$in
$nin
```

---

# 15. `$in`

`$in` means:

> Match if the value is one of the specified values.

Example:

```js
Task.find({
  priority: {
    $in: ["high", "medium"]
  }
});
```

This means:

```text
priority = high
OR
priority = medium
```

---

# 16. `$nin`

`$nin` means:

```text
not in
```

Example:

```js
Task.find({
  priority: {
    $nin: ["low"]
  }
});
```

Meaning:

```text
priority is NOT low
```

---

# 17. Membership Operators Summary

| Operator | Meaning                       |
| -------- | ----------------------------- |
| `$in`    | Value must be in the list     |
| `$nin`   | Value must not be in the list |

Example:

```js
{
  priority: {
    $in: ["high", "medium"]
  }
}
```

---

# 18. Pattern Matching with `$regex`

MongoDB can search strings using regular expressions.

Example:

```js
Task.find({
  title: {
    $regex: "mongo",
    $options: "i"
  }
});
```

`$regex` means:

> Search using a regular expression.

`$options: "i"` means:

> Case-insensitive search.

So it can match:

```text
MongoDB
mongodb
MONGODB
Mongo
```

---

# 19. Example Search API

We could create:

```text
GET /tasks/search?title=mongo
```

Then:

```js
app.get("/tasks/search", async (req, res) => {
  try {
    const tasks = await Task.find({
      title: {
        $regex: req.query.title,
        $options: "i"
      }
    });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
```

Now:

```text
GET /tasks/search?title=mongo
```

could find:

```text
Learn MongoDB
MongoDB CRUD
MongoDB Queries
```

---

# 20. `$exists`

The `$exists` operator checks whether a field exists.

Example:

```js
Task.find({
  description: {
    $exists: true
  }
});
```

Meaning:

> Find tasks where the `description` field exists.

To find documents where it doesn't exist:

```js
Task.find({
  description: {
    $exists: false
  }
});
```

---

# 21. Combining Operators

One of MongoDB's strengths is that operators can be combined.

For example:

```js
Task.find({
  completed: false,
  priority: {
    $in: ["high", "medium"]
  }
});
```

This means:

```text
completed = false
AND
priority = high OR medium
```

So MongoDB can express much more complex filtering than simple equality.

---

# 22. Another Example

Suppose we want:

> Find incomplete tasks whose priority is high.

Query:

```js
Task.find({
  completed: false,
  priority: "high"
});
```

Another example:

> Find incomplete tasks with high or medium priority.

```js
Task.find({
  completed: false,
  priority: {
    $in: ["high", "medium"]
  }
});
```

---

# 23. Error Handling

CRUD operations don't always succeed.

Possible problems include:

```text
Invalid input
     ↓
Validation error

Invalid MongoDB ID
     ↓
CastError

Duplicate value
     ↓
Duplicate key error

Database unavailable
     ↓
Connection error

Document doesn't exist
     ↓
404 Not Found
```

A good API should handle these errors consistently.

---

# 24. Basic Error Handling Problem

Without centralized error handling, every route might contain:

```js
try {
  // operation
} catch (error) {
  res.status(400).json({
    message: error.message
  });
}
```

Imagine having 20 routes.

You would repeat this code 20 times.

That's not ideal.

We want:

```text
Route
 ↓
Error
 ↓
Central Error Handler
 ↓
Consistent Response
```

---

# 25. Async Error Wrapper

Because Express route handlers often use:

```js
async (req, res) => {
```

we can create a reusable helper.

Create:

```text
utils/
└── asyncHandler.js
```

Then:

```js
const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise
      .resolve(handler(req, res, next))
      .catch(next);
  };
};

export default asyncHandler;
```

---

# 26. What Does `asyncHandler` Do?

Instead of writing:

```js
app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});
```

we can write:

```js
app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find();

    res.json(tasks);
  })
);
```

The helper catches rejected promises and sends them to:

```js
next(error)
```

which eventually reaches the centralized error middleware.

---

# 27. Centralized Error Middleware

Express error middleware has four parameters:

```js
(err, req, res, next)
```

Example:

```js
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});
```

Notice the four arguments:

```text
err
req
res
next
```

Express recognizes this as error-handling middleware.

---

# 28. Complete Error Flow

The architecture becomes:

```text
Client
  ↓
Express Route
  ↓
asyncHandler
  ↓
Database Operation
  ↓
Error?
  ↓
next(error)
  ↓
Central Error Middleware
  ↓
JSON Response
```

This keeps route handlers cleaner.

---

# 29. Custom Error Class

Sometimes we want to control:

* Error message
* HTTP status code
* Error type

We can create a custom error class.

Example:

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
  }
}

export default AppError;
```

Now we can create an error:

```js
throw new AppError(
  "Task not found",
  404
);
```

---

# 30. Using Custom Errors

Example:

```js
app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new AppError(
        "Task not found",
        404
      );
    }

    res.status(200).json(task);
  })
);
```

The route doesn't need:

```js
try {
  ...
} catch {
  ...
}
```

because `asyncHandler` handles rejected promises.

---

# 31. Central Error Handler with Custom Errors

```js
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
```

Now:

```js
throw new AppError("Task not found", 404);
```

becomes:

```json
{
  "success": false,
  "message": "Task not found"
}
```

with:

```text
404 Not Found
```

---

# 32. Why Centralized Error Handling?

Without it:

```text
Route 1 → custom error response
Route 2 → different error response
Route 3 → different error response
Route 4 → different error response
```

With centralized handling:

```text
Route 1 ─┐
Route 2 ─┤
Route 3 ─┼──→ Central Error Handler
Route 4 ─┘
```

This gives us:

* Consistent responses
* Less duplicate code
* Cleaner routes
* Easier debugging
* Easier maintenance
* Better production architecture

---

# 33. DELETE + Error Handling Together

A cleaner DELETE route can look like:

```js
app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(
      req.params.id
    );

    if (!task) {
      throw new AppError(
        "Task not found",
        404
      );
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  })
);
```

Now the route focuses only on its actual job:

```text
Find task
   ↓
Delete task
   ↓
Check existence
   ↓
Send response
```

Error handling is handled elsewhere.

---

# 34. Important: Invalid ID vs Not Found

These are two different situations.

### Invalid ID

The client sends something that isn't a valid MongoDB ObjectId:

```text
/tasks/abc
```

This can produce a Mongoose `CastError`.

Usually this should result in:

```text
400 Bad Request
```

---

### Valid ID but Task Doesn't Exist

Example:

```text
/tasks/64abc123456789
```

The ID format is valid, but no task exists with that ID.

This should result in:

```text
404 Not Found
```

So:

```text
Invalid ID
   ↓
400

Valid ID + no document
   ↓
404
```

This distinction is important in a professional API.

---

# 35. CRUD API — Complete

We now have the complete CRUD system:

```text
CREATE
POST /tasks
      ↓
Task.create()
```

```text
READ
GET /tasks
      ↓
Task.find()
```

```text
READ ONE
GET /tasks/:id
      ↓
Task.findById()
```

```text
UPDATE
PUT /tasks/:id
      ↓
Task.findByIdAndUpdate()
```

```text
DELETE
DELETE /tasks/:id
      ↓
Task.findByIdAndDelete()
```

---

# 36. Query Operators — Mental Map

Remember these categories:

```text
MongoDB Query Operators
          │
          ├── Comparison
          │     ├── $gt
          │     ├── $gte
          │     ├── $lt
          │     ├── $lte
          │     ├── $eq
          │     └── $ne
          │
          ├── Membership
          │     ├── $in
          │     └── $nin
          │
          ├── Pattern
          │     └── $regex
          │
          └── Existence
                └── $exists
```

---

# 37. Quick Query Examples

### Greater than

```js
Task.find({
  age: { $gt: 18 }
});
```

### Less than

```js
Task.find({
  age: { $lt: 50 }
});
```

### Greater than or equal

```js
Task.find({
  age: { $gte: 18 }
});
```

### Less than or equal

```js
Task.find({
  age: { $lte: 60 }
});
```

### Not equal

```js
Task.find({
  priority: { $ne: "low" }
});
```

### Multiple allowed values

```js
Task.find({
  priority: {
    $in: ["high", "medium"]
  }
});
```

### Exclude values

```js
Task.find({
  priority: {
    $nin: ["low"]
  }
});
```

### Regular expression

```js
Task.find({
  title: {
    $regex: "mongo",
    $options: "i"
  }
});
```

### Field exists

```js
Task.find({
  description: {
    $exists: true
  }
});
```

---

# 38. Final Backend Architecture

As our API becomes larger, a professional structure can look like:

```text
backend/
│
├── src/
│   │
│   ├── models/
│   │   └── Task.js
│   │
│   ├── controllers/
│   │   └── taskController.js
│   │
│   ├── routes/
│   │   └── taskRoutes.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── asyncHandler.js
│   │
│   ├── utils/
│   │   └── AppError.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

This separates responsibilities:

```text
Routes
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

and:

```text
Errors
  ↓
Central Error Middleware
```

---

# 39. Complete Request Flow

For a DELETE request:

```text
Client
  │
  │ DELETE /tasks/:id
  ↓
Express
  │
  ↓
Route
  │
  ↓
Controller
  │
  ↓
Mongoose
  │
  ↓
MongoDB
  │
  ├── Document found
  │       ↓
  │     Delete
  │       ↓
  │     Response
  │
  └── Document not found
          ↓
        AppError
          ↓
   Error Middleware
          ↓
       404 JSON
```

---

# 40. Key Takeaways

* `findByIdAndDelete()` deletes a document using its `_id`.
* `deleteOne()` deletes one document matching a filter.
* `deleteMany()` deletes multiple matching documents.
* Always check whether a document existed before claiming it was deleted.
* Use `404` when a valid resource ID doesn't correspond to a document.
* MongoDB provides powerful query operators.
* `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, and `$ne` are comparison operators.
* `$in` and `$nin` are membership operators.
* `$regex` is useful for pattern/string searching.
* `$exists` checks whether a field exists.
* Operators can be combined to create complex filters.
* Async error wrappers reduce repeated `try...catch` blocks.
* Custom errors allow us to attach HTTP status codes to errors.
* Centralized error middleware provides consistent API responses.
* Invalid IDs and missing documents are different:

  * Invalid ID → usually `400`
  * Valid ID but document missing → `404`

---

# 41. CRUD Is Now Complete 🎉

Our Task API now supports:

```text
        TASK API
           │
    ┌──────┼──────┐
    ↓      ↓      ↓
 CREATE   READ   UPDATE   DELETE
    │      │       │        │
   POST    GET    PUT     DELETE
    │      │       │        │
    └──────┴──────┴────────┘
               │
            MongoDB
```

The core backend API workflow is now complete:

```text
Express
   ↓
Routes
   ↓
Mongoose
   ↓
MongoDB
   ↓
CRUD
   ↓
Error Handling
```

From here, the API can be extended with:

```text
Validation
Authentication
Authorization
Pagination
Filtering
Searching
Sorting
File Uploads
JWT
Security
Testing
Logging
Production Deployment
```
