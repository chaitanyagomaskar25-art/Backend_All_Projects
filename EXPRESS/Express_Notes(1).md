# Express.js Notes

## 1. What is Express.js?

**Express.js** is a lightweight web framework built on top of **Node.js**.

It makes it easier to:

- Create HTTP servers
- Handle HTTP requests and responses
- Create routes
- Build REST APIs
- Use middleware
- Handle errors
- Organize backend applications

### Node.js vs Express

```text
Node.js
   ↓
JavaScript runtime
   ↓
Provides low-level APIs such as http
   ↓
Express.js
   ↓
Web framework that simplifies server development
```

Node.js can create a server without Express:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello World");
});

server.listen(3000);
```

With Express:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000);
```

Express reduces the amount of low-level code we need to write.

---

# 2. Installation

## Step 1: Create a project

```bash
mkdir express-app
cd express-app
```

## Step 2: Initialize Node.js project

```bash
npm init -y
```

This creates:

```text
express-app/
└── package.json
```

## Step 3: Install Express

```bash
npm install express
```

Short form:

```bash
npm i express
```

After installation:

```text
express-app/
├── node_modules/
├── package-lock.json
├── package.json
└── index.js
```

### What happens after `npm install express`?

Three important things happen:

1. Express is installed inside `node_modules`.
2. Express is added to `dependencies` in `package.json`.
3. `package-lock.json` records the installed dependency tree.

Example:

```json
{
  "dependencies": {
    "express": "^5.x.x"
  }
}
```

The exact version depends on the version available when you install it.

---

# 3. First Express Application

Create:

```text
index.js
```

Write:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

Run:

```bash
node index.js
```

You should see:

```text
Server running on port 3000
```

Open:

```text
http://localhost:3000
```

You should receive:

```text
Hello World
```

---

# 4. App Object

## What is the App Object?

The object returned by:

```js
const app = express();
```

is the **Express application object**.

It is the main object used to configure an Express application.

```js
const express = require("express");

const app = express();
```

Think of it as:

```text
express()
    ↓
Creates Express application
    ↓
app
```

The `app` object provides methods such as:

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()

app.use()

app.listen()
```

---

## Why do we need the App Object?

The app object lets us define how our server behaves.

For example:

```js
app.get("/", (req, res) => {
    res.send("Home Page");
});
```

This tells Express:

> When a GET request comes to `/`, execute this handler.

---

## Important App Methods

### `app.get()`

Handles GET requests.

```js
app.get("/users", (req, res) => {
    res.send("Get users");
});
```

### `app.post()`

Handles POST requests.

```js
app.post("/users", (req, res) => {
    res.send("Create user");
});
```

### `app.put()`

Handles PUT requests.

```js
app.put("/users/1", (req, res) => {
    res.send("Update user");
});
```

### `app.patch()`

Handles partial updates.

```js
app.patch("/users/1", (req, res) => {
    res.send("Partially update user");
});
```

### `app.delete()`

Handles DELETE requests.

```js
app.delete("/users/1", (req, res) => {
    res.send("Delete user");
});
```

### `app.use()`

Used mainly for middleware.

```js
app.use(express.json());
```

### `app.listen()`

Starts the server.

```js
app.listen(3000);
```

---

# 5. Routing

## What is Routing?

Routing is the process of deciding:

> Which code should run when a client requests a particular HTTP method and URL.

For example:

```text
GET /users
```

can return users.

```text
POST /users
```

can create a user.

```text
DELETE /users/10
```

can delete user 10.

---

## Basic Route Structure

```js
app.METHOD(PATH, HANDLER);
```

Example:

```js
app.get("/", (req, res) => {
    res.send("Home Page");
});
```

There are three important parts:

```text
app
 │
 └── METHOD
      │
      ├── PATH
      │
      └── HANDLER
```

### METHOD

Examples:

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

### PATH

The URL path:

```js
"/"
```

or:

```js
"/users"
```

or:

```js
"/products"
```

### HANDLER

The function that runs when the route matches:

```js
(req, res) => {
    res.send("Hello");
}
```

---

# 6. Basic Routing Example

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

app.get("/contact", (req, res) => {
    res.send("Contact Page");
});

app.listen(3000);
```

Now:

```text
GET /
    ↓
Home Page

GET /about
    ↓
About Page

GET /contact
    ↓
Contact Page
```

---

# 7. Routing with HTTP Methods

Suppose we are building a Users API.

### Get users

```js
app.get("/users", (req, res) => {
    res.send("Get users");
});
```

### Create user

```js
app.post("/users", (req, res) => {
    res.send("Create user");
});
```

### Update user

```js
app.put("/users/1", (req, res) => {
    res.send("Update user");
});
```

### Partially update user

```js
app.patch("/users/1", (req, res) => {
    res.send("Partially update user");
});
```

### Delete user

```js
app.delete("/users/1", (req, res) => {
    res.send("Delete user");
});
```

Notice:

```text
GET    /users
POST   /users
PUT    /users/1
PATCH  /users/1
DELETE /users/1
```

The HTTP method is part of how Express determines which route should execute.

---

# 8. Request Object

## What is `req`?

In:

```js
app.get("/", (req, res) => {
```

`req` means **request**.

It represents the HTTP request sent by the client.

The request can contain:

- HTTP method
- URL
- Headers
- Query parameters
- Route parameters
- Request body
- Cookies

Think:

```text
Client
   │
   │ HTTP Request
   ▼
Express
   │
   ▼
req
```

---

# 9. Important Request Properties

## `req.method`

Returns the HTTP method.

```js
app.get("/", (req, res) => {
    console.log(req.method);

    res.send("Hello");
});
```

Output:

```text
GET
```

For a POST request:

```text
POST
```

---

## `req.url`

Returns the requested URL.

```js
app.get("/users", (req, res) => {
    console.log(req.url);

    res.send("Users");
});
```

Output:

```text
/users
```

---

## `req.path`

Returns the path portion of the request.

```js
app.get("/users", (req, res) => {
    console.log(req.path);

    res.send("Users");
});
```

Output:

```text
/users
```

---

## `req.headers`

Contains request headers.

```js
app.get("/", (req, res) => {
    console.log(req.headers);

    res.send("Hello");
});
```

A request can contain headers such as:

```text
host
user-agent
accept
accept-language
content-type
```

Access a specific header:

```js
req.headers["user-agent"]
```

Or:

```js
req.get("user-agent")
```

---

# 10. `req.query`

`req.query` contains **query parameters**.

Example URL:

```text
/users?name=chaitanya
```

Route:

```js
app.get("/users", (req, res) => {
    console.log(req.query);

    res.json(req.query);
});
```

Output:

```json
{
    "name": "chaitanya"
}
```

Multiple query parameters:

```text
/users?name=chaitanya&age=22
```

Then:

```js
console.log(req.query);
```

gives:

```js
{
    name: "chaitanya",
    age: "22"
}
```

Query parameter values are typically strings.

---

# 11. `req.params`

`req.params` contains **route parameters**.

Example:

```js
app.get("/users/:id", (req, res) => {
    console.log(req.params);

    res.json(req.params);
});
```

Request:

```text
GET /users/101
```

Output:

```json
{
    "id": "101"
}
```

Here:

```text
/users/:id
        ↑
   Route parameter
```

And:

```text
/users/101
        ↑
   Actual value
```

---

# 12. `req.body`

`req.body` contains data sent in the request body.

For JSON data:

```json
{
    "name": "Chaitanya",
    "age": 22
}
```

Use:

```js
app.post("/users", (req, res) => {
    console.log(req.body);

    res.json(req.body);
});
```

Before reading JSON request bodies, add:

```js
app.use(express.json());
```

Complete example:

```js
const express = require("express");

const app = express();

app.use(express.json());

app.post("/users", (req, res) => {
    console.log(req.body);

    res.json(req.body);
});

app.listen(3000);
```

---

# 13. Request Summary

| Property | Purpose |
|---|---|
| `req.method` | HTTP method |
| `req.url` | Requested URL |
| `req.path` | URL path |
| `req.headers` | Request headers |
| `req.query` | Query parameters |
| `req.params` | Route parameters |
| `req.body` | Request body |

Remember:

```text
/users/10
    ↓
req.params

/users?id=10
    ↓
req.query

POST /users
{
    "name": "John"
}
    ↓
req.body
```

---

# 14. Response Object

## What is `res`?

In:

```js
app.get("/", (req, res) => {
```

`res` means **response**.

It represents the response that the server sends back to the client.

Think:

```text
Client
   │
   │ Request
   ▼
Express
   │
   │ Response
   ▼
Client
```

---

# 15. Important Response Methods

## `res.send()`

Sends a response.

```js
app.get("/", (req, res) => {
    res.send("Hello World");
});
```

You can send text:

```js
res.send("Hello");
```

HTML:

```js
res.send("<h1>Hello</h1>");
```

For API responses, `res.json()` is usually clearer for JSON data.

---

# 16. `res.json()`

Used to send JSON.

```js
app.get("/user", (req, res) => {
    res.json({
        id: 1,
        name: "Chaitanya",
        skill: "React"
    });
});
```

Response:

```json
{
    "id": 1,
    "name": "Chaitanya",
    "skill": "React"
}
```

For REST APIs, `res.json()` is used very frequently.

---

# 17. `res.status()`

Sets the HTTP status code.

```js
res.status(200).json({
    message: "Success"
});
```

Example:

```js
res.status(201).json({
    message: "User created"
});
```

And:

```js
res.status(404).json({
    message: "User not found"
});
```

Common status codes:

| Code | Meaning |
|---:|---|
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

---

# 18. `res.sendStatus()`

Sends a status code directly.

```js
res.sendStatus(404);
```

This produces a response with:

```text
404 Not Found
```

For APIs, you will often want a JSON response instead:

```js
res.status(404).json({
    message: "User not found"
});
```

---

# 19. Request vs Response

This is one of the most important concepts in Express.

| Request | Response |
|---|---|
| Client → Server | Server → Client |
| `req` | `res` |
| Client's data | Server's data |
| `req.body` | `res.json()` |
| `req.params` | `res.status()` |
| `req.query` | `res.send()` |
| `req.headers` | `res.sendStatus()` |
| `req.method` | Status code |

Mental model:

```text
CLIENT
   │
   │ REQUEST
   │
   │ req
   ▼
SERVER / EXPRESS
   │
   │ RESPONSE
   │
   │ res
   ▼
CLIENT
```

---

# 20. Complete Express Example

```js
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Developer API");
});

app.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Chaitanya"
        },
        {
            id: 2,
            name: "Rahul"
        }
    ]);
});

app.post("/users", (req, res) => {
    console.log(req.body);

    res.status(201).json({
        message: "User created",
        user: req.body
    });
});

app.get("/users/:id", (req, res) => {
    res.json({
        userId: req.params.id
    });
});

app.get("/search", (req, res) => {
    res.json({
        search: req.query
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

---

# 21. Request-Response Flow

Suppose the client sends:

```text
GET /users/10
```

Express receives the request.

```text
Client
   │
   │ GET /users/10
   ▼
Express
   │
   │ Finds:
   │ app.get("/users/:id", ...)
   ▼
Route Handler
   │
   │ req.params.id
   ▼
"10"
   │
   ▼
res.json(...)
   │
   ▼
Client
```

---

# 22. Interview Questions

## Q1. What is Express.js?

Express.js is a lightweight web framework for Node.js that simplifies server development, routing, middleware, request handling, and API development.

---

## Q2. Is Express a replacement for Node.js?

No.

Express runs on top of Node.js.

```text
Node.js
   ↓
Express.js
   ↓
Application
```

---

## Q3. Do we need Express to create a Node.js server?

No.

Node.js provides the built-in `http` module.

Express makes server and API development easier.

---

## Q4. What does `express()` do?

It creates an Express application object.

```js
const app = express();
```

---

## Q5. What is the App Object?

The object returned by `express()` that is used to configure the Express application.

---

## Q6. What is routing?

Routing determines how an application responds to a request for a particular HTTP method and URL path.

---

## Q7. What is `req`?

`req` represents the incoming HTTP request from the client.

---

## Q8. What is `res`?

`res` represents the HTTP response that the server sends to the client.

---

## Q9. What is `req.params`?

It contains dynamic route parameters.

```js
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
});
```

---

## Q10. What is `req.query`?

It contains query-string parameters.

```text
/users?id=10
```

```js
req.query.id
```

---

## Q11. What is `req.body`?

It contains data sent in the HTTP request body.

For JSON data, use:

```js
app.use(express.json());
```

---

## Q12. Difference between `res.send()` and `res.json()`?

`res.send()` sends a general response, while `res.json()` is specifically intended for JSON responses.

---

## Q13. What does `res.status()` do?

It sets the HTTP status code of the response.

```js
res.status(404).json({
    message: "Not found"
});
```

---

# 23. Common Mistakes

### 1. Forgetting to install Express

```bash
npm install express
```

---

### 2. Forgetting `express()`

Wrong:

```js
const app = express;
```

Correct:

```js
const app = express();
```

---

### 3. Forgetting `app.listen()`

```js
app.listen(3000);
```

is needed to start listening for requests.

---

### 4. Forgetting `express.json()`

If you're sending JSON in a request body:

```js
app.use(express.json());
```

is needed to parse it.

---

### 5. Confusing `req.params` and `req.query`

```text
/users/10
     ↓
req.params
```

```text
/users?id=10
     ↓
req.query
```

---

### 6. Sending multiple responses

Wrong:

```js
app.get("/", (req, res) => {
    res.send("Hello");
    res.json({
        message: "Hello"
    });
});
```

A request should normally receive one response.

---

### 7. Forgetting `return` after an early response

Example:

```js
app.get("/users/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            message: "ID required"
        });
    }

    res.json({
        id: req.params.id
    });
});
```

`return` prevents the function from continuing after sending the error response.

---

# 24. Best Practices

```text
✅ Use Express for convenient server/API development.

✅ Keep routes organized.

✅ Use meaningful HTTP methods.

✅ Use req.params for route parameters.

✅ Use req.query for query parameters.

✅ Use req.body for request body data.

✅ Use res.json() for JSON API responses.

✅ Set appropriate HTTP status codes.

✅ Use express.json() when accepting JSON bodies.

✅ Keep route handlers small as your application grows.

✅ Separate routes, controllers, middleware, and models in larger projects.
```

---

# 25. Quick Revision

```text
EXPRESS
   ↓
Web framework for Node.js

INSTALL
   ↓
npm init -y
npm install express

APP OBJECT
   ↓
const app = express();

ROUTING
   ↓
app.get()
app.post()
app.put()
app.patch()
app.delete()

REQUEST
   ↓
req.method
req.url
req.path
req.headers
req.params
req.query
req.body

RESPONSE
   ↓
res.send()
res.json()
res.status()
res.sendStatus()

SERVER
   ↓
app.listen(3000)
```

## One-line mental model

> **Express receives a request → routing decides what code runs → `req` gives you the client's data → your code processes it → `res` sends the result back.**
