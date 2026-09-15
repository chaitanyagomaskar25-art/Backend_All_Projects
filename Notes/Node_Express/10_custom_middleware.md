# Express Middleware — Types and Custom Middleware

Middleware is one of the most important concepts in Express.js.

A middleware function runs during the **request-response cycle** and can:

* Inspect the request
* Modify the request
* Modify the response
* Perform some operation
* Stop the request
* Pass control to the next middleware

Basic structure:

```js
const middleware = (req, res, next) => {
  // middleware logic

  next();
};
```

The three parameters are:

```text
req
 ↓
Request coming from the client

res
 ↓
Response that will be sent to the client

next
 ↓
Function that passes control to the next middleware
```

---

# 1. Types of Middleware in Express

There are several important types of middleware:

```text
Express Middleware
│
├── 1. Application-level Middleware
│
├── 2. Router-level Middleware
│
├── 3. Built-in Middleware
│
├── 4. Third-party Middleware
│
├── 5. Error-handling Middleware
│
└── 6. Custom Middleware
```

Let's understand each one.

---

# 2. Application-Level Middleware

Application-level middleware is attached directly to the Express application using:

```js
app.use()
```

Example:

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
};

app.use(logger);
```

Because we used:

```js
app.use(logger);
```

the middleware can run for requests handled by the application after that registration point.

For example:

```text
GET /tasks
POST /tasks
PUT /tasks/123
DELETE /tasks/123
GET /users
```

can pass through the middleware.

---

# 3. Application-Level Middleware Example

```js
import express from "express";

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
};

app.use(logger);

app.get("/tasks", (req, res) => {
  res.json({
    message: "All tasks"
  });
});

app.listen(3000);
```

Request:

```text
GET /tasks
```

Flow:

```text
Client
  ↓
GET /tasks
  ↓
logger
  ↓
/tasks route
  ↓
Response
```

---

# 4. Router-Level Middleware

Router-level middleware works with:

```js
express.Router()
```

Example:

```js
const router = express.Router();
```

We can attach middleware to the router:

```js
router.use(authMiddleware);
```

Now the middleware applies to routes handled by that router.

Example:

```js
router.use(authMiddleware);

router.get("/", getTasks);

router.post("/", createTask);

router.delete("/:id", deleteTask);
```

Flow:

```text
Request
   ↓
Task Router
   ↓
Authentication Middleware
   ↓
Route Handler
```

---

# 5. Why Router-Level Middleware Is Useful

Imagine our application has:

```text
/tasks
/users
/admin
```

Maybe only `/admin` requires special authorization.

Instead of doing:

```js
app.use(adminAuth);
```

for the entire application, we can create an admin router:

```js
const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.get("/users", getUsers);

adminRouter.delete("/users/:id", deleteUser);
```

Now:

```text
/admin/users
/admin/users/:id
```

use the admin middleware.

Other routes don't.

This keeps the application organized.

---

# 6. Built-in Middleware

Express provides some middleware out of the box.

One of the most commonly used is:

```js
express.json()
```

Example:

```js
app.use(express.json());
```

It parses incoming JSON request bodies.

Suppose the frontend sends:

```json
{
  "title": "Learn Express",
  "completed": false
}
```

Then we can access:

```js
req.body
```

and get:

```js
{
  title: "Learn Express",
  completed: false
}
```

---

# 7. Other Built-in Middleware

Express also provides:

```js
express.json()
express.urlencoded()
express.static()
```

### `express.json()`

Parses JSON request bodies.

```js
app.use(express.json());
```

### `express.urlencoded()`

Parses URL-encoded form data.

```js
app.use(express.urlencoded({ extended: true }));
```

### `express.static()`

Serves static files.

```js
app.use(express.static("public"));
```

For example:

```text
public/
├── index.html
├── style.css
└── script.js
```

can be served by Express.

---

# 8. Third-Party Middleware

Third-party middleware is middleware created by external packages.

You install it using npm.

For example:

```bash
npm install cors
```

Then:

```js
import cors from "cors";

app.use(cors());
```

Other commonly used middleware packages can handle things such as:

```text
CORS
Logging
Security headers
Rate limiting
Cookies
Sessions
Authentication
```

The important idea is:

```text
Express
  ↓
Third-party package
  ↓
Middleware
  ↓
Your application
```

---

# 9. Error-Handling Middleware

Error-handling middleware is specifically designed to handle errors.

It has **four parameters**:

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

Notice:

```js
(err, req, res, next)
```

The first parameter is:

```js
err
```

This tells Express that this is error-handling middleware.

---

# 10. Where Should Error Middleware Be?

Usually, error-handling middleware is registered **after your routes**.

Example:

```js
app.use(express.json());

app.get("/tasks", getTasks);

app.post("/tasks", createTask);

// Error middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});
```

Flow:

```text
Request
   ↓
Middleware
   ↓
Route
   ↓
Error?
   ↓
Error Middleware
   ↓
Response
```

---

# 11. Custom Middleware

Now the most important part.

## What is Custom Middleware?

Custom middleware is middleware that **you write yourself** according to your application's requirements.

For example:

* Request logger
* Authentication
* Authorization
* Validation
* Check user role
* Check API key
* Request timing
* Request ID
* Custom security checks

Example:

```js
const logger = (req, res, next) => {
  console.log("Request received");

  next();
};
```

This is custom middleware because **we created it ourselves**.

---

# 12. Basic Custom Middleware Structure

The general pattern is:

```js
const myMiddleware = (req, res, next) => {

  // 1. Do something

  // 2. Continue or stop

  next();
};
```

Think:

```text
Request
   ↓
Custom Middleware
   ↓
Do something
   ↓
next()
   ↓
Next Middleware / Route
```

---

# 13. Custom Logger Middleware

Let's create a simple logger.

```js
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.url}`
  );

  next();
};
```

Register it:

```js
app.use(logger);
```

Now if the client sends:

```text
GET /tasks
```

the console may show:

```text
GET /tasks
```

If the client sends:

```text
POST /tasks
```

the console shows:

```text
POST /tasks
```

---

# 14. Understanding the Logger

This:

```js
req.method
```

gives:

```text
GET
POST
PUT
PATCH
DELETE
```

This:

```js
req.url
```

gives:

```text
/tasks
/tasks/123
/users
```

So:

```js
`${req.method} ${req.url}`
```

creates:

```text
GET /tasks
POST /tasks
DELETE /tasks/123
```

---

# 15. Custom Middleware That Adds Data

Middleware can add custom information to `req`.

Example:

```js
const addRequestTime = (req, res, next) => {
  req.requestTime = new Date();

  next();
};
```

Register:

```js
app.use(addRequestTime);
```

Now a route can access:

```js
req.requestTime
```

Example:

```js
app.get("/tasks", (req, res) => {
  res.json({
    message: "Tasks",
    requestTime: req.requestTime
  });
});
```

Flow:

```text
Request
   ↓
addRequestTime
   ↓
req.requestTime added
   ↓
Route
   ↓
Response
```

This is a powerful feature of middleware.

---

# 16. Custom Authentication Middleware

Authentication middleware is one of the most common custom middleware examples.

Suppose the client sends a token:

```text
Authorization: Bearer abc123
```

Middleware can check it.

Example:

```js
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  next();
};
```

Then:

```js
app.get(
  "/tasks",
  authenticate,
  getTasks
);
```

Flow:

```text
GET /tasks
    ↓
authenticate
    ↓
Token exists?
  ↙       ↘
 No       Yes
 ↓         ↓
401       next()
           ↓
       getTasks
```

---

# 17. Authentication Middleware Does Not Have to Be Full JWT Logic

At this stage, don't worry about JWT details.

The important middleware concept is:

```text
Request
   ↓
Authentication Check
   ↓
Is user authenticated?
   ↓
Yes → next()
No  → 401 response
```

Later, JWT authentication can be implemented inside this middleware.

---

# 18. Custom Authorization Middleware

Authentication asks:

> Who are you?

Authorization asks:

> Are you allowed to perform this operation?

Suppose only admins can delete tasks.

We can create:

```js
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};
```

Then:

```js
app.delete(
  "/tasks/:id",
  authenticate,
  requireAdmin,
  deleteTask
);
```

Flow:

```text
Request
   ↓
authenticate
   ↓
requireAdmin
   ↓
deleteTask
```

---

# 19. Custom Validation Middleware

Middleware is excellent for validating incoming data.

Example:

```js
const validateTask = (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  next();
};
```

Use it:

```js
app.post(
  "/tasks",
  validateTask,
  createTask
);
```

Request:

```json
{
  "description": "Learn Express"
}
```

Since `title` is missing:

```text
400 Bad Request
```

The controller doesn't execute.

---

# 20. Why Validate Before the Controller?

Without middleware:

```js
app.post("/tasks", async (req, res) => {

  // validation

  // authentication

  // business logic

  // database operation

});
```

The route becomes messy.

Instead:

```js
app.post(
  "/tasks",
  validateTask,
  createTask
);
```

Now:

```text
Validation
    ↓
Controller
```

The controller can focus on creating the task.

---

# 21. Custom Middleware for API Keys

Some APIs require an API key.

Example:

```js
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      message: "Invalid API key"
    });
  }

  next();
};
```

Then:

```js
app.get(
  "/tasks",
  checkApiKey,
  getTasks
);
```

Flow:

```text
Request
   ↓
API Key Middleware
   ↓
Valid?
 ↙     ↘
No      Yes
↓        ↓
401     next()
         ↓
       Route
```

---

# 22. Custom Middleware for Request Timing

We can measure how long a request takes.

```js
const requestTimer = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.url} - ${duration}ms`
    );
  });

  next();
};
```

This can help us identify slow endpoints.

For example:

```text
GET /tasks - 35ms
POST /tasks - 48ms
GET /users - 120ms
```

---

# 23. Multiple Custom Middleware

We can use multiple middleware functions on one route.

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
MongoDB
   ↓
Response
```

This is called a **middleware chain**.

---

# 24. Middleware Chain

Suppose:

```js
const first = (req, res, next) => {
  console.log("First");
  next();
};

const second = (req, res, next) => {
  console.log("Second");
  next();
};

const third = (req, res, next) => {
  console.log("Third");
  next();
};
```

Register:

```js
app.get(
  "/tasks",
  first,
  second,
  third,
  (req, res) => {
    res.json({
      message: "Tasks"
    });
  }
);
```

Execution:

```text
Request
   ↓
First
   ↓
Second
   ↓
Third
   ↓
Route Handler
   ↓
Response
```

Console:

```text
First
Second
Third
```

---

# 25. Middleware Can Stop the Chain

Suppose:

```js
const second = (req, res, next) => {
  return res.status(401).json({
    message: "Access denied"
  });
};
```

Notice there is no:

```js
next();
```

Therefore:

```text
Request
   ↓
First
   ↓
Second
   ↓
401 Response
   ↓
STOP
```

`Third` never executes.

The route handler never executes.

---

# 26. Middleware Can Modify the Request

Example:

```js
const userMiddleware = (req, res, next) => {
  req.user = {
    id: "123",
    role: "admin"
  };

  next();
};
```

Then:

```js
app.get(
  "/profile",
  userMiddleware,
  (req, res) => {
    res.json({
      user: req.user
    });
  }
);
```

The middleware passes information to the next handler through:

```js
req.user
```

This pattern is very common with authentication.

---

# 27. Custom Middleware File Structure

As our application grows, don't put every middleware function inside `server.js`.

Instead:

```text
src/
├── middleware/
│   ├── logger.js
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
│
├── controllers/
├── routes/
├── models/
└── server.js
```

For example:

```text
middleware/
└── logger.js
```

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
};

export default logger;
```

Then in `server.js`:

```js
import logger from "./middleware/logger.js";

app.use(logger);
```

This makes the project easier to maintain.

---

# 28. Custom Middleware in Our Task API

Our Task API could have:

```text
middleware/
├── logger.js
├── authenticate.js
├── validateTask.js
└── errorHandler.js
```

Then our route could look like:

```js
router.post(
  "/",
  authenticate,
  validateTask,
  createTask
);
```

And:

```js
router.delete(
  "/:id",
  authenticate,
  deleteTask
);
```

This is much cleaner than putting all logic inside controllers.

---

# 29. Types of Middleware — Comparison

| Type              | Purpose                  | Example                 |
| ----------------- | ------------------------ | ----------------------- |
| Application-level | Applies broadly to app   | `app.use(logger)`       |
| Router-level      | Applies to a router      | `router.use(auth)`      |
| Built-in          | Provided by Express      | `express.json()`        |
| Third-party       | Provided by npm packages | `cors()`                |
| Error-handling    | Handles errors           | `(err, req, res, next)` |
| Custom            | Written by you           | `validateTask()`        |

---

# 30. Important Difference: Built-in vs Custom

### Built-in middleware

Express provides it.

```js
app.use(express.json());
```

### Third-party middleware

Someone else created it and published it as a package.

```js
app.use(cors());
```

### Custom middleware

You create it yourself.

```js
app.use(logger);
```

Mental model:

```text
Built-in
   ↓
Express gives it to you

Third-party
   ↓
npm package gives it to you

Custom
   ↓
You write it
```

---

# 31. Middleware vs Controller

This distinction is extremely important.

### Middleware

Middleware generally prepares, checks, or processes the request.

```text
Authentication
Validation
Logging
Authorization
```

### Controller

Controller performs the main operation.

```js
const createTask = async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json(task);
};
```

Think:

```text
Middleware
    ↓
"Can this request continue?"

Controller
    ↓
"What should this endpoint do?"
```

---

# 32. Middleware vs Controller Example

Bad structure:

```js
app.post("/tasks", async (req, res) => {

  // authentication

  // validation

  // authorization

  // logging

  // database operation

  // response

});
```

Better:

```js
app.post(
  "/tasks",
  authenticate,
  validateTask,
  createTask
);
```

Now responsibilities are separated:

```text
authenticate
      ↓
validateTask
      ↓
createTask
```

---

# 33. Complete Middleware Flow

A production-style API might look like:

```text
                  CLIENT
                    │
                    ↓
                 Request
                    │
                    ↓
             ┌──────────────┐
             │    Logger    │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │  JSON Parser │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │     Auth     │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Validation   │
             └──────┬───────┘
                    ↓
                  Route
                    ↓
                Controller
                    ↓
                 Mongoose
                    ↓
                 MongoDB
                    ↓
                Response
                    ↓
                  CLIENT
```

If something fails:

```text
Error
  ↓
Central Error Middleware
  ↓
JSON Error Response
```

---

# 34. Middleware Execution Rules

Remember these rules.

## Rule 1

Middleware receives:

```js
(req, res, next)
```

## Rule 2

Use:

```js
next();
```

to continue.

## Rule 3

Use:

```js
res.status(...).json(...)
```

to end the request.

## Rule 4

Middleware runs in registration order.

## Rule 5

Middleware can modify `req`.

Example:

```js
req.user = user;
```

## Rule 6

Middleware can modify `res`.

Example:

```js
res.setHeader(...)
```

## Rule 7

Middleware can stop unauthorized or invalid requests.

## Rule 8

Error middleware uses:

```js
(err, req, res, next)
```

---

# 35. The Most Important Mental Model

Think of middleware as a series of checkpoints:

```text
                    REQUEST
                       ↓
              ┌────────────────┐
              │     Logger     │
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │ Authentication │
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │  Authorization │
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │   Validation   │
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │    Controller  │
              └───────┬────────┘
                      ↓
                   DATABASE
                      ↓
                  RESPONSE
```

At every middleware:

```text
              Middleware
                  │
             ┌────┴────┐
             ↓         ↓
          Continue     Stop
             │         │
          next()     Response
             │
             ↓
         Next step
```

---

# 36. Final Revision

```text
Middleware
│
├── Application-level
│      └── app.use()
│
├── Router-level
│      └── router.use()
│
├── Built-in
│      └── express.json()
│
├── Third-party
│      └── cors()
│
├── Error-handling
│      └── (err, req, res, next)
│
└── Custom
       ├── logger
       ├── authentication
       ├── authorization
       ├── validation
       ├── API key check
       └── request processing
```

---

# 37. Key Takeaways

* Middleware runs during the Express request-response cycle.
* Middleware normally receives `req`, `res`, and `next`.
* `next()` passes control to the next middleware or route handler.
* Sending a response can stop the request.
* Middleware executes in the order it is registered.
* Application-level middleware uses `app.use()`.
* Router-level middleware uses an Express router.
* Built-in middleware comes with Express.
* Third-party middleware comes from npm packages.
* Error-handling middleware has four parameters.
* Custom middleware is middleware that **you write yourself**.
* Custom middleware is commonly used for:

  * Logging
  * Authentication
  * Authorization
  * Validation
  * API-key checks
  * Request processing
* Multiple middleware functions can form a middleware chain.
* Middleware can modify `req` and pass information to controllers.
* Keeping middleware separate from controllers makes APIs cleaner and easier to maintain.

---

# 38. One-Line Memory Trick

Remember:

```text
Middleware = CHECK / PROCESS → next() OR STOP
```

And the most important Express flow is:

```text
Request
   ↓
Middleware
   ↓
Middleware
   ↓
Middleware
   ↓
Controller
   ↓
Database
   ↓
Response
```

Once this flow becomes clear, concepts like **JWT authentication, role-based authorization, validation middleware, centralized error handling, and protected routes** become much easier to understand.
