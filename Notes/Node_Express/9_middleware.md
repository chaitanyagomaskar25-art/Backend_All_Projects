# Express Middleware

Middleware is one of the core concepts of Express.js.

It allows us to run some code **between receiving a request and sending the final response**.

Middleware is heavily used in real-world APIs for:

* Authentication
* Authorization
* Validation
* Logging
* Error handling
* Security
* Request processing
* Parsing request data
* Rate limiting

---

# 1. What is Middleware?

A middleware function is a function that runs during the **request-response cycle**.

The basic structure is:

```js
(req, res, next)
```

A middleware function receives three things:

```text
req
 ↓
Request object

res
 ↓
Response object

next
 ↓
Function that passes control to the next middleware/route
```

Basic example:

```js
const middleware = (req, res, next) => {
  console.log("Middleware executed");

  next();
};
```

The important part is:

```js
next();
```

It tells Express:

> "I am finished. Continue to the next middleware or route handler."

---

# 2. Simple Mental Model

Think of middleware like a **checkpoint**.

Imagine entering an airport:

```text
Passenger
   ↓
Security Check
   ↓
Passport Check
   ↓
Boarding Check
   ↓
Flight
```

Similarly, an API request can go through:

```text
Client
   ↓
Logging Middleware
   ↓
Authentication Middleware
   ↓
Validation Middleware
   ↓
Route Handler
   ↓
Response
```

Each middleware performs a specific job before the request reaches the final route.

---

# 3. Request-Response Cycle

When a client sends a request:

```text
Client
   ↓
HTTP Request
   ↓
Express Server
   ↓
Middleware
   ↓
Route Handler
   ↓
Response
   ↓
Client
```

For example:

```text
POST /tasks
```

The request might flow through:

```text
POST /tasks
     ↓
Logger
     ↓
Authentication
     ↓
Validation
     ↓
Controller
     ↓
MongoDB
     ↓
Response
```

---

# 4. Why Do We Need Middleware?

Imagine we have 50 API routes.

Suppose every route needs authentication.

Without middleware, we might write:

```js
app.get("/tasks", checkAuth, ...);

app.post("/tasks", checkAuth, ...);

app.put("/tasks/:id", checkAuth, ...);

app.delete("/tasks/:id", checkAuth, ...);
```

Or even worse, duplicate authentication logic inside every controller.

Middleware allows us to write authentication logic once and reuse it.

```text
Authentication Middleware
          ↓
     Many Routes
```

This follows an important software principle:

> Don't repeat the same logic everywhere.

---

# 5. Basic Middleware Example

```js
const logger = (req, res, next) => {
  console.log("Request received");

  next();
};
```

Register it:

```js
app.use(logger);
```

Now every request passes through `logger`.

For example:

```text
GET /tasks
   ↓
logger
   ↓
GET route
```

And:

```text
POST /tasks
   ↓
logger
   ↓
POST route
```

---

# 6. How `app.use()` Works

We register middleware using:

```js
app.use(middleware);
```

Example:

```js
app.use(logger);
```

This means:

> Run this middleware for incoming requests that reach this point in the middleware stack.

Express processes middleware and routes in order.

For example:

```js
app.use(logger);

app.get("/tasks", (req, res) => {
  res.json({
    message: "Tasks"
  });
});
```

The flow is:

```text
Request
   ↓
logger
   ↓
/tasks route
   ↓
Response
```

---

# 7. Middleware Order Matters

This is extremely important.

Express processes middleware **in the order in which it is registered**.

Example:

```js
app.use(first);
app.use(second);
app.use(third);
```

The flow is:

```text
Request
   ↓
first
   ↓
second
   ↓
third
   ↓
Route
   ↓
Response
```

If you change the order:

```js
app.use(third);
app.use(first);
app.use(second);
```

the execution order changes.

Therefore:

> Middleware order matters.

---

# 8. The `next()` Function

`next()` passes control to the next middleware.

Example:

```js
const first = (req, res, next) => {
  console.log("First middleware");

  next();
};

const second = (req, res, next) => {
  console.log("Second middleware");

  next();
};
```

Register them:

```js
app.use(first);
app.use(second);
```

The output will be:

```text
First middleware
Second middleware
```

Then the request continues to the matching route.

---

# 9. What Happens If We Don't Call `next()`?

Consider:

```js
const middleware = (req, res, next) => {
  console.log("Middleware executed");
};
```

There is no:

```js
next();
```

and no:

```js
res.json(...);
```

The request gets stuck.

Flow:

```text
Request
   ↓
Middleware
   ↓
STOP ❌
```

The client may keep waiting for a response.

So middleware generally needs to do one of two things:

```text
1. Continue
      ↓
   next()

OR

2. End the request
      ↓
   res.json()
   res.send()
   res.status()
```

---

# 10. Middleware Can Modify `req`

Middleware can add information to the request object.

Example:

```js
const middleware = (req, res, next) => {
  req.user = {
    id: "123",
    role: "admin"
  };

  next();
};
```

Now the next middleware or controller can access:

```js
req.user
```

This is very useful for authentication.

Flow:

```text
Request
   ↓
Authentication Middleware
   ↓
req.user added
   ↓
Controller
```

---

# 11. Middleware Can Modify `res`

Middleware can also interact with the response.

For example:

```js
const middleware = (req, res, next) => {
  res.setHeader("X-App-Version", "1.0");

  next();
};
```

The response will contain the custom header.

---

# 12. Middleware Can Stop a Request

Middleware doesn't always have to call `next()`.

It can reject the request.

Example:

```js
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  next();
};
```

If there is no token:

```text
Request
   ↓
Auth Middleware
   ↓
No token
   ↓
401 Response
   ↓
STOP
```

The route will never execute.

---

# 13. Middleware Types

There are several ways to categorize Express middleware.

The important ones are:

```text
Application-level middleware
Router-level middleware
Built-in middleware
Third-party middleware
Error-handling middleware
```

---

# 14. Application-Level Middleware

Application-level middleware is attached to the Express application.

Example:

```js
app.use(logger);
```

It can apply broadly to many routes.

Example:

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
});
```

Now requests such as:

```text
GET /tasks
POST /tasks
GET /users
DELETE /users/123
```

can pass through this middleware.

---

# 15. Router-Level Middleware

Router-level middleware works with a specific Express router.

Example:

```js
const router = express.Router();
```

Then:

```js
router.use(checkAuth);
```

Now the middleware applies to routes inside that router.

Example:

```js
router.use(checkAuth);

router.get("/tasks", getTasks);

router.post("/tasks", createTask);

router.delete("/tasks/:id", deleteTask);
```

Flow:

```text
Request
   ↓
Task Router
   ↓
Authentication Middleware
   ↓
Task Controller
```

This is useful for grouping related routes.

---

# 16. Built-in Middleware

Express provides some middleware itself.

One of the most important is:

```js
express.json()
```

Example:

```js
app.use(express.json());
```

It allows Express to parse incoming JSON request bodies.

Suppose the client sends:

```json
{
  "title": "Learn Express",
  "completed": false
}
```

With:

```js
app.use(express.json());
```

we can access:

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

Without the JSON parser, `req.body` may not be populated for JSON requests.

---

# 17. Third-Party Middleware

We can also install middleware packages.

Examples include middleware for:

* CORS
* Security headers
* Logging
* Cookies
* Rate limiting

For example:

```bash
npm install cors
```

Then:

```js
import cors from "cors";

app.use(cors());
```

Now CORS handling is added to the application.

---

# 18. Common Uses of Middleware

Middleware is commonly used for:

```text
Logging
Authentication
Authorization
Validation
Error Handling
CORS
Security
Rate Limiting
Parsing Data
Request Transformation
```

Let's understand the important ones.

---

# 19. Use Case 1 — Logging

Logging middleware records information about requests.

Example:

```js
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.url}`
  );

  next();
};
```

If the client sends:

```text
GET /tasks
```

we might see:

```text
GET /tasks
```

in the server console.

This helps developers understand what requests are reaching the server.

---

# 20. Use Case 2 — Authentication

Authentication answers:

> Who are you?

For example, a user sends a JWT token.

Middleware checks the token.

```text
Client
   ↓
JWT Token
   ↓
Authentication Middleware
   ↓
Valid?
   ↓
Controller
```

If the token is invalid:

```text
401 Unauthorized
```

The request stops.

---

# 21. Use Case 3 — Authorization

Authentication and authorization are different.

### Authentication

```text
Who are you?
```

### Authorization

```text
Are you allowed to do this?
```

Example:

```text
User
 ↓
Authenticated
 ↓
Role = student
 ↓
Trying to access admin route
 ↓
403 Forbidden
```

Middleware can check:

```js
if (req.user.role !== "admin") {
  return res.status(403).json({
    message: "Access denied"
  });
}
```

---

# 22. Use Case 4 — Validation

Middleware can validate incoming data before the controller runs.

Example:

```js
const validateTask = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  next();
};
```

Then:

```js
app.post(
  "/tasks",
  validateTask,
  createTask
);
```

Flow:

```text
POST /tasks
     ↓
Validation
     ↓
Valid?
  ↙     ↘
No       Yes
↓         ↓
400      Controller
          ↓
       MongoDB
```

---

# 23. Use Case 5 — Error Handling

Middleware can handle errors centrally.

Example:

```js
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});
```

This is called:

> Error-handling middleware.

Notice that it has **four parameters**:

```js
(err, req, res, next)
```

The first parameter is the error.

---

# 24. Use Case 6 — CORS

When frontend and backend run on different origins, browsers enforce CORS rules.

For example:

```text
Frontend
http://localhost:5173

Backend
http://localhost:3000
```

We can use CORS middleware:

```js
import cors from "cors";

app.use(cors());
```

This configures the server to handle cross-origin requests.

---

# 25. Use Case 7 — Rate Limiting

Rate limiting controls how many requests a client can make.

Example:

```text
Client
   ↓
100 requests/minute
   ↓
Rate Limit Middleware
   ↓
Too many requests?
   ↓
429 Too Many Requests
```

This helps protect APIs from abuse and excessive traffic.

---

# 26. Middleware in API Design

Middleware is especially important when designing a larger API.

Imagine our Task API:

```text
POST   /tasks
GET    /tasks
GET    /tasks/:id
PUT    /tasks/:id
DELETE /tasks/:id
```

A production API might use:

```text
Request
   ↓
Logger
   ↓
CORS
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Controller
   ↓
MongoDB
   ↓
Response
```

This separates responsibilities.

---

# 27. Middleware + Routes

Instead of putting everything inside a route:

```js
app.post("/tasks", async (req, res) => {

  // authentication

  // authorization

  // validation

  // database logic

  // response

});
```

we separate responsibilities:

```js
app.post(
  "/tasks",
  authenticate,
  authorize,
  validateTask,
  createTask
);
```

Now each piece has one responsibility.

---

# 28. Example API Architecture

A professional API could look like:

```text
Client
  ↓
Middleware
  ├── Logger
  ├── CORS
  ├── Authentication
  ├── Authorization
  └── Validation
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Mongoose Model
  ↓
MongoDB
```

And errors can flow to:

```text
Error
  ↓
Central Error Middleware
  ↓
JSON Response
```

---

# 29. Middleware Execution Order

Suppose we have:

```js
app.use(logger);

app.use(express.json());

app.use(authenticate);

app.post(
  "/tasks",
  validateTask,
  createTask
);
```

The flow is:

```text
POST /tasks
     ↓
logger
     ↓
express.json()
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

Order matters.

For example, authentication needs access to request headers, and validation needs parsed request data when it validates `req.body`.

---

# 30. Route-Level Middleware

Middleware doesn't have to apply to the entire application.

We can attach it to one route.

Example:

```js
app.delete(
  "/tasks/:id",
  authenticate,
  deleteTask
);
```

Only this route uses the authentication middleware.

Flow:

```text
DELETE /tasks/:id
       ↓
authenticate
       ↓
deleteTask
```

---

# 31. Multiple Middleware Functions

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

Execution:

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

Each middleware must call:

```js
next();
```

if it wants the request to continue.

---

# 32. Middleware Can Have Different Outcomes

Every middleware essentially has two main paths:

```text
                 Middleware
                    │
             ┌──────┴──────┐
             ↓             ↓
          Continue        Stop
             │             │
           next()       Response
             │
             ↓
        Next middleware
```

For example:

```js
const checkAuth = (req, res, next) => {

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
};
```

---

# 33. Middleware vs Controller

This distinction is very important.

### Middleware

Middleware usually handles **cross-cutting concerns** or request preprocessing.

Examples:

```text
Authentication
Authorization
Validation
Logging
Parsing
Rate limiting
```

### Controller

Controller handles the actual business operation.

Example:

```js
const createTask = async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json(task);
};
```

Mental model:

```text
Middleware
    ↓
"Can this request continue?"

Controller
    ↓
"What should this endpoint actually do?"
```

---

# 34. Middleware vs Route

A route defines:

> Which request should execute which handler?

Example:

```js
app.get("/tasks", getTasks);
```

Middleware defines:

> What processing should happen before or around that handler?

Example:

```js
app.get(
  "/tasks",
  authenticate,
  getTasks
);
```

So:

```text
Route
 ↓
Defines endpoint

Middleware
 ↓
Processes request

Controller
 ↓
Performs operation
```

---

# 35. Real-World Task API Example

Let's imagine our API requires logged-in users.

We have:

```text
POST   /tasks
GET    /tasks
GET    /tasks/:id
PUT    /tasks/:id
DELETE /tasks/:id
```

We can design it like this:

```js
router.post(
  "/",
  authenticate,
  validateTask,
  createTask
);

router.get(
  "/",
  authenticate,
  getTasks
);

router.get(
  "/:id",
  authenticate,
  getTask
);

router.put(
  "/:id",
  authenticate,
  validateTask,
  updateTask
);

router.delete(
  "/:id",
  authenticate,
  deleteTask
);
```

Now authentication doesn't need to be written inside every controller.

---

# 36. Middleware Stack

Express applications are essentially built around a chain/stack of middleware and route handlers.

Example:

```text
                    Express
                       │
                       ↓
                  Middleware 1
                       │
                     next()
                       ↓
                  Middleware 2
                       │
                     next()
                       ↓
                  Middleware 3
                       │
                     next()
                       ↓
                    Route
                       │
                       ↓
                  Controller
                       │
                       ↓
                   Response
```

This is one of the most important mental models for Express.

---

# 37. Middleware and API Security

Middleware is heavily involved in API security.

A typical secured API might look like:

```text
Request
   ↓
CORS
   ↓
Rate Limiting
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Controller
   ↓
Database
```

Each layer has a different responsibility.

---

# 38. Important Middleware Rules

Remember these rules:

### Rule 1

Middleware receives:

```js
(req, res, next)
```

### Rule 2

Call:

```js
next();
```

to continue.

### Rule 3

Send a response to stop the request:

```js
res.status(...).json(...);
```

### Rule 4

Middleware order matters.

### Rule 5

Middleware can modify:

```js
req
res
```

### Rule 6

Middleware can reject requests.

### Rule 7

Middleware should generally have one clear responsibility.

---

# 39. Complete Request Lifecycle

A real-world API request may look like:

```text
                    CLIENT
                      │
                      ↓
                HTTP Request
                      │
                      ↓
                  Express
                      │
                      ↓
                CORS Middleware
                      │
                      ↓
                Logger Middleware
                      │
                      ↓
            Authentication Middleware
                      │
                      ↓
            Authorization Middleware
                      │
                      ↓
              Validation Middleware
                      │
                      ↓
                   ROUTE
                      │
                      ↓
                 CONTROLLER
                      │
                      ↓
                  MONGOOSE
                      │
                      ↓
                  MONGODB
                      │
                      ↓
                Controller
                      │
                      ↓
                 Response
                      │
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

# 40. Final Mental Model

Think about middleware as **layers around your API**.

```text
             ┌───────────────────────┐
             │      API Request      │
             └───────────┬───────────┘
                         ↓
                  ┌─────────────┐
                  │    Logger   │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │     Auth    │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │ Validation  │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │    Route    │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │ Controller  │
                  └──────┬──────┘
                         ↓
                  ┌─────────────┐
                  │   MongoDB   │
                  └──────┬──────┘
                         ↓
                     Response
```

The key idea is:

> **Middleware sits between the incoming request and the final response, performing reusable processing before the request reaches the main application logic.**

---

# 41. Quick Revision

| Concept          | Meaning                                          |
| ---------------- | ------------------------------------------------ |
| Middleware       | Function that runs during request-response cycle |
| `req`            | Incoming request                                 |
| `res`            | Response                                         |
| `next()`         | Pass control to next middleware/handler          |
| `app.use()`      | Register middleware                              |
| Logger           | Records requests                                 |
| Authentication   | Checks who the user is                           |
| Authorization    | Checks what user can do                          |
| Validation       | Checks incoming data                             |
| CORS             | Handles cross-origin requests                    |
| Rate limiting    | Controls request frequency                       |
| Error middleware | Handles errors centrally                         |
| Controller       | Performs endpoint/business operation             |

---

# 42. One-Line Memory Trick

Remember:

```text
Middleware = CHECK → PROCESS → CONTINUE / STOP
```

For example:

```text
Request
   ↓
Authentication
   ↓
Valid?
 ┌─┴─┐
No  Yes
↓    ↓
401  next()
     ↓
Validation
     ↓
Controller
```

That's the heart of Express middleware.
