# Express.js — Route Parameters, Query Parameters, Body Parser & Middleware

## 1. Route Parameters

Route parameters are dynamic values placed directly inside the URL path.

Example:

```text
GET /developers/10
```

Here, `10` is a route parameter.

### Syntax

```js
app.get("/developers/:id", (req, res) => {
    console.log(req.params.id);
});
```

For `/developers/10`:

```js
req.params.id // "10"
```

Route parameters are strings, so convert them when you need a number:

```js
const id = Number(req.params.id);
```

### Multiple Route Parameters

```js
app.get("/users/:userId/posts/:postId", (req, res) => {
    console.log(req.params.userId);
    console.log(req.params.postId);
});
```

Request:

```text
/users/10/posts/25
```

Result:

```js
req.params.userId // "10"
req.params.postId // "25"
```

### Practical Example

```js
app.get("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const developer = developers.find(d => d.id === id);

    if (!developer) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    res.json(developer);
});
```

---

## 2. Query Parameters

Query parameters are values added to the URL after `?`.

Example:

```text
GET /developers?skill=React
```

Access them using:

```js
req.query
```

Example:

```js
app.get("/developers", (req, res) => {
    console.log(req.query.skill);
});
```

For `/developers?skill=React`:

```js
req.query.skill // "React"
```

### Multiple Query Parameters

Use `&` between parameters:

```text
/developers?skill=React&city=Mumbai
```

```js
app.get("/developers", (req, res) => {
    console.log(req.query.skill);
    console.log(req.query.city);
});
```

### Common Uses

Query parameters are commonly used for:

- Searching
- Filtering
- Sorting
- Pagination
- Optional settings

Examples:

```text
/products?category=mobile
/developers?skill=React
/products?sort=price
/products?page=2
```

### Search Example

```js
app.get("/search", (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            message: "Name query parameter is required"
        });
    }

    const result = developers.filter(
        d => d.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json(result);
});
```

---

## 3. Route Parameters vs Query Parameters

| Feature | Route Parameter | Query Parameter |
|---|---|---|
| Example | `/users/10` | `/users?id=10` |
| Express | `req.params` | `req.query` |
| Common use | Identify a resource | Search/filter/options |
| Example syntax | `/users/:id` | `/users?role=admin` |

Easy memory:

```text
/users/10
    ↓
req.params.id
```

```text
/users?role=admin
    ↓
req.query.role
```

---

# 4. Body Parser

## What is Body Parser?

Body parsing is the process of reading and parsing data sent inside an HTTP request body so Express can make it available through:

```js
req.body
```

In modern Express, common body parsing is handled by built-in middleware:

```js
express.json()
express.urlencoded()
```

### Why do we need it?

Suppose the client sends:

```http
POST /developers
Content-Type: application/json
```

with:

```json
{
    "name": "Chaitanya",
    "skill": "React"
}
```

After JSON parsing, your route can access:

```js
req.body.name
req.body.skill
```

---

## `express.json()`

`express.json()` parses JSON request bodies.

```js
const express = require("express");

const app = express();

app.use(express.json());

app.post("/developers", (req, res) => {
    console.log(req.body);

    res.json({
        message: "Developer received",
        developer: req.body
    });
});

app.listen(3000);
```

If the client sends:

```json
{
    "name": "Chaitanya",
    "skill": "React"
}
```

then:

```js
req.body
```

contains:

```js
{
    name: "Chaitanya",
    skill: "React"
}
```

---

## `express.urlencoded()`

Traditional HTML forms can send data as:

```text
application/x-www-form-urlencoded
```

Use:

```js
app.use(express.urlencoded({ extended: true }));
```

Then form data can be accessed using:

```js
req.body
```

Example:

```js
app.post("/login", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    res.send("Login data received");
});
```

### JSON vs URL Encoded

| Middleware | Used for |
|---|---|
| `express.json()` | JSON request bodies |
| `express.urlencoded()` | URL-encoded form bodies |

For most REST APIs, you will frequently use:

```js
app.use(express.json());
```

### Is `body-parser` a separate package?

Historically, Express applications commonly used the separate `body-parser` package.

Modern Express provides common body parsing directly:

```js
express.json()
express.urlencoded()
```

So for normal JSON APIs, you generally do not need to install the separate package.

---

# 5. Express Middleware

## What is Middleware?

Middleware is a function that runs during the Express request-response cycle.

A middleware function commonly looks like:

```js
(req, res, next)
```

Example:

```js
const logger = (req, res, next) => {
    console.log("Request received");

    next();
};
```

---

## Request-Response Cycle

Without middleware:

```text
Client
  ↓
Request
  ↓
Route
  ↓
Response
```

With middleware:

```text
Client
  ↓
Request
  ↓
Middleware
  ↓
Route
  ↓
Response
```

With multiple middleware:

```text
Request
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
Middleware 3
   ↓
Route
   ↓
Response
```

---

## `req`, `res`, and `next`

### `req`

Represents the incoming request.

Common properties:

```js
req.params
req.query
req.body
req.headers
req.method
req.url
```

### `res`

Represents the response.

Common methods:

```js
res.send()
res.json()
res.status()
```

### `next()`

Passes control to the next middleware or route handler.

```js
const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};
```

---

## What if `next()` is not called?

This middleware can cause the request to hang:

```js
const logger = (req, res, next) => {
    console.log("Hello");
};
```

Correct:

```js
const logger = (req, res, next) => {
    console.log("Hello");
    next();
};
```

If middleware sends a response, it should normally stop there:

```js
return res.status(401).json({
    message: "Unauthorized"
});
```

---

# 6. Middleware Can Modify `req`

Middleware can add information to the request:

```js
const addUser = (req, res, next) => {
    req.user = {
        id: 1,
        name: "Chaitanya"
    };

    next();
};

app.use(addUser);

app.get("/profile", (req, res) => {
    res.json(req.user);
});
```

This pattern is commonly useful for authentication.

---

# 7. Middleware Can Stop a Request

Example authentication middleware:

```js
const auth = (req, res, next) => {
    const loggedIn = false;

    if (!loggedIn) {
        return res.status(401).json({
            message: "Please login"
        });
    }

    next();
};
```

Use it:

```js
app.get("/profile", auth, (req, res) => {
    res.json({
        message: "Welcome"
    });
});
```

If the user is not logged in:

```text
Request
   ↓
auth middleware
   ↓
401 Response
```

If the user is logged in:

```text
Request
   ↓
auth middleware
   ↓
next()
   ↓
Route
   ↓
Response
```

---

# 8. `app.use()`

`app.use()` is commonly used to register middleware.

```js
app.use(logger);
```

JSON body parser:

```js
app.use(express.json());
```

URL-encoded body parser:

```js
app.use(express.urlencoded({ extended: true }));
```

---

# 9. Application-Level Middleware

```js
const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.use(logger);
```

This middleware applies to requests that reach that point in the application.

---

# 10. Route-Level Middleware

Middleware can be attached to a specific route:

```js
const auth = (req, res, next) => {
    console.log("Checking authentication");
    next();
};

app.get("/profile", auth, (req, res) => {
    res.send("Profile");
});
```

Only `/profile` uses this middleware.

---

# 11. Middleware Order

Express executes middleware in registration order:

```js
app.use(middleware1);
app.use(middleware2);

app.get("/", route);
```

Execution:

```text
Request
   ↓
middleware1
   ↓
middleware2
   ↓
route
   ↓
Response
```

Order matters.

For example:

```js
app.use(express.json());

app.post("/users", (req, res) => {
    console.log(req.body);
});
```

The JSON parser is registered before the route that needs `req.body`.

---

# 12. Body Parser is Middleware

This is an important connection.

When you write:

```js
app.use(express.json());
```

you are using middleware.

Its job is:

```text
Incoming JSON
      ↓
express.json()
      ↓
Parse JSON
      ↓
req.body
      ↓
Route
```

So:

```text
Middleware
    ↓
General concept

Body Parser
    ↓
One job that middleware can perform

express.json()
    ↓
Built-in Express middleware for parsing JSON bodies
```

---

# 13. Complete Example

```js
const express = require("express");

const app = express();

const developers = [
    { id: 1, name: "Chaitanya", skill: "React" },
    { id: 2, name: "Rahul", skill: "Node.js" },
    { id: 3, name: "Aman", skill: "JavaScript" }
];

// Body parser middleware
app.use(express.json());

// Logger middleware
const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.use(logger);

// Route parameter
app.get("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const developer = developers.find(d => d.id === id);

    if (!developer) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    res.json(developer);
});

// Query parameter
app.get("/search", (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    const result = developers.filter(
        d => d.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json(result);
});

// Request body
app.post("/developers", (req, res) => {
    const developer = req.body;

    res.status(201).json({
        message: "Developer received",
        developer
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

---

# 14. Request Flow Examples

### `GET /developers/2`

```text
Request
   ↓
logger
   ↓
next()
   ↓
/developers/:id
   ↓
req.params.id
   ↓
Find developer
   ↓
Response
```

### `GET /search?name=chai`

```text
Request
   ↓
logger
   ↓
next()
   ↓
/search
   ↓
req.query.name
   ↓
Search
   ↓
Response
```

### `POST /developers`

Body:

```json
{
    "name": "Akash",
    "skill": "JavaScript"
}
```

Flow:

```text
Request
   ↓
express.json()
   ↓
JSON is parsed
   ↓
req.body
   ↓
logger
   ↓
next()
   ↓
POST /developers
   ↓
Response
```

---

# 15. Common Mistakes

### Forgetting `next()`

```js
const logger = (req, res, next) => {
    console.log("Request");
};
```

Correct:

```js
const logger = (req, res, next) => {
    console.log("Request");
    next();
};
```

### Calling `next()` after sending a response

Avoid:

```js
if (!loggedIn) {
    res.status(401).json({
        message: "Unauthorized"
    });

    next();
}
```

Use:

```js
if (!loggedIn) {
    return res.status(401).json({
        message: "Unauthorized"
    });
}
```

### Forgetting `express.json()`

Wrong:

```js
app.post("/users", (req, res) => {
    console.log(req.body);
});
```

Correct:

```js
app.use(express.json());

app.post("/users", (req, res) => {
    console.log(req.body);
});
```

### Mixing up params and query

For:

```text
/users/10
```

use:

```js
req.params.id
```

For:

```text
/users?id=10
```

use:

```js
req.query.id
```

---

# 16. Interview Questions

### What are route parameters?

Dynamic values in the URL path.

```text
/users/:id
```

Access:

```js
req.params.id
```

### What are query parameters?

Values passed after `?` in a URL.

```text
/users?role=admin
```

Access:

```js
req.query.role
```

### What is middleware?

A function that runs during the Express request-response cycle and can process the request, modify it, send a response, or pass control using `next()`.

### What is `next()`?

It passes control to the next middleware or route handler.

### What is `express.json()`?

Built-in Express middleware that parses JSON request bodies and makes the parsed data available through `req.body`.

### What is `req.body`?

The parsed data sent inside the request body.

### Difference between `req.params`, `req.query`, and `req.body`?

```text
req.params
    ↓
Data from route path

req.query
    ↓
Data from query string

req.body
    ↓
Data from request body
```

Example:

```text
POST /developers/10?active=true
```

Body:

```json
{
    "name": "Chaitanya"
}
```

Then:

```js
req.params.id      // "10"
req.query.active   // "true"
req.body.name      // "Chaitanya"
```

---

# 17. Quick Revision

```text
Route Parameter → req.params → /users/10

Query Parameter → req.query  → /users?name=chai

Request Body    → req.body   → { "name": "Chaitanya" }

Middleware      → req/res/next → runs during request-response cycle
```

## Most Important Code

### Route Parameter

```js
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
});
```

### Query Parameter

```js
app.get("/users", (req, res) => {
    console.log(req.query.name);
});
```

### Body Parser

```js
app.use(express.json());

app.post("/users", (req, res) => {
    console.log(req.body);
});
```

### Middleware

```js
const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

app.use(logger);
```

## One-Line Memory Trick

```text
Route Parameter → req.params → /users/10

Query Parameter → req.query  → /users?name=chai

Request Body    → req.body   → { "name": "Chaitanya" }

Middleware      → req/res/next → runs between request and route
```
