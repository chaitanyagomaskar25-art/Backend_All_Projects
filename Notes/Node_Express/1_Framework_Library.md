# How to Create Your First Backend Server with Express.js

## 1. What Are We Building?

We are going to create a simple backend server using:

* **Node.js** → Runs JavaScript on the server
* **Express.js** → Framework for creating the backend server
* **HTTP** → Communication between client and server

Our server will:

* Start on a port
* Accept HTTP requests
* Handle a route
* Send a response to the client

At the end, we will be able to open:

```text
http://localhost:5000
```

and receive a response from our backend.

---

# 2. Prerequisites

Before creating the server, make sure Node.js is installed.

Check Node.js:

```bash
node --version
```

Example:

```text
v22.x.x
```

Check npm:

```bash
npm --version
```

Example:

```text
10.x.x
```

If both commands work, you're ready.

---

# 3. Create a Project Folder

Create a folder for your backend project.

```bash
mkdir first-backend
```

Move into the folder:

```bash
cd first-backend
```

Your project currently looks like:

```text
first-backend/
```

---

# 4. Initialize a Node.js Project

Run:

```bash
npm init -y
```

This creates a `package.json` file.

Your project now looks like:

```text
first-backend/
│
└── package.json
```

---

# 5. What is `package.json`?

`package.json` contains information about your Node.js project.

For example:

```json
{
    "name": "first-backend",
    "version": "1.0.0",
    "main": "server.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    }
}
```

It can contain:

* Project name
* Version
* Main file
* Scripts
* Dependencies
* Project metadata

---

# 6. Install Express.js

Now install Express:

```bash
npm install express
```

After installation, you'll see:

```text
first-backend/
│
├── node_modules/
├── package-lock.json
└── package.json
```

### What happened?

`npm install express` does several things:

```text
npm
 ↓
Downloads Express
 ↓
Stores it in node_modules
 ↓
Adds Express to package.json
 ↓
Creates/updates package-lock.json
```

Your `package.json` will contain something similar to:

```json
{
    "dependencies": {
        "express": "^5.x.x"
    }
}
```

The exact version may be different.

---

# 7. Create `server.js`

Create a file called:

```text
server.js
```

Your project becomes:

```text
first-backend/
│
├── node_modules/
├── package-lock.json
├── package.json
└── server.js
```

`server.js` will contain our backend server code.

---

# 8. Import Express

Inside `server.js`:

```js
const express = require("express");
```

This loads the Express package.

We can now use Express in our application.

---

# 9. Create the Express Application

Next:

```js
const app = express();
```

Here:

```js
express()
```

creates an Express application.

We store it inside:

```js
app
```

Think of `app` as our backend application.

```text
Express
   ↓
express()
   ↓
Application
   ↓
app
```

---

# 10. Create Your First Route

Now let's create a route:

```js
app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});
```

Let's understand it carefully.

### `app.get()`

This defines a **GET route**.

### `"/"`

This represents the root URL.

### `(req, res)`

These are:

* `req` → Request
* `res` → Response

### `res.send()`

Sends a response back to the client.

So:

```js
res.send("Hello from my backend!");
```

means:

> Send this text back to whoever requested this endpoint.

---

# 11. Start the Server

Now we need to tell Express to listen for incoming requests.

Add:

```js
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

### `app.listen()`

This starts the server.

### `5000`

This is the **port number**.

### Callback

```js
() => {
    console.log("Server running on port 5000");
}
```

runs after the server successfully starts listening.

---

# 12. Complete First Backend Server

Your complete `server.js` should now look like:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

That's it!

You have created your first Express backend server. 🎉

---

# 13. Run the Server

Open your terminal inside the project folder.

Run:

```bash
node server.js
```

You should see:

```text
Server running on port 5000
```

This means your backend server is running.

---

# 14. Open the Server in Your Browser

Open:

```text
http://localhost:5000
```

You should see:

```text
Hello from my backend!
```

Congratulations — your browser just communicated with your backend server.

---

# 15. What Actually Happened?

When you entered:

```text
http://localhost:5000
```

the browser sent an HTTP request.

The request looked conceptually like:

```text
GET /
```

Express received it.

Then Express checked the routes:

```js
app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});
```

It found a matching route.

Then it executed the handler:

```js
(req, res) => {
    res.send("Hello from my backend!");
}
```

Finally, the server sent the response back to the browser.

The complete flow:

```text
Browser
   │
   │ GET /
   ↓
localhost:5000
   │
   ↓
Express Server
   │
   ↓
Match "/"
   │
   ↓
Route Handler
   │
   ↓
res.send()
   │
   ↓
Response
   │
   ↓
Browser
```

---

# 16. Understanding `localhost`

`localhost` refers to **your own computer**.

When you use:

```text
localhost:5000
```

you're saying:

> "Connect to port 5000 on this computer."

It does not mean your backend is publicly available on the internet.

---

# 17. Understanding the Port

A computer can run many network services at the same time.

Ports help identify which application should receive a request.

For example:

```text
localhost:3000 → Frontend
localhost:5000 → Backend
localhost:27017 → MongoDB
```

These are examples; the exact ports can vary.

Our Express server is listening on:

```text
5000
```

So:

```text
http://localhost:5000
```

means:

```text
Computer
   ↓
Port 5000
   ↓
Express Server
```

---

# 18. Add Another Route

Let's create another endpoint.

```js
app.get("/about", (req, res) => {
    res.send("This is the About page");
});
```

Now your server has:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

app.get("/about", (req, res) => {
    res.send("This is the About page");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

Now you can visit:

```text
http://localhost:5000/
```

Response:

```text
Hello from my backend!
```

And:

```text
http://localhost:5000/about
```

Response:

```text
This is the About page
```

---

# 19. Add an API Endpoint

Let's create an API endpoint that returns JSON.

```js
app.get("/api/users", (req, res) => {
    res.json({
        users: [
            {
                id: 1,
                name: "Rahul"
            },
            {
                id: 2,
                name: "Aman"
            }
        ]
    });
});
```

Now visit:

```text
http://localhost:5000/api/users
```

You will receive:

```json
{
    "users": [
        {
            "id": 1,
            "name": "Rahul"
        },
        {
            "id": 2,
            "name": "Aman"
        }
    ]
}
```

---

# 20. `res.send()` vs `res.json()`

Express provides different ways to send responses.

### `res.send()`

Usually used for text, HTML, or simple responses.

```js
res.send("Hello World");
```

### `res.json()`

Used to send JSON data.

```js
res.json({
    message: "Success"
});
```

For REST APIs, `res.json()` is commonly used.

---

# 21. Understanding Request and Response

Every HTTP communication involves:

```text
Request
   ↓
Server
   ↓
Response
```

Express represents these using:

```js
req
res
```

### `req`

Contains information about the incoming request.

For example:

```js
req.method
req.url
req.params
req.query
req.body
req.headers
```

### `res`

Used to send a response.

For example:

```js
res.send()
res.json()
res.status()
```

---

# 22. Adding Status Codes

HTTP responses have status codes.

For example:

```text
200 → Success
201 → Created
400 → Bad Request
401 → Unauthorized
404 → Not Found
500 → Server Error
```

In Express:

```js
app.get("/success", (req, res) => {
    res.status(200).json({
        message: "Request successful"
    });
});
```

For creating data:

```js
app.post("/users", (req, res) => {
    res.status(201).json({
        message: "User created"
    });
});
```

---

# 23. A Better First Server

Now let's combine the concepts:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to my backend API"
    });
});

app.get("/api/users", (req, res) => {
    res.status(200).json({
        users: [
            {
                id: 1,
                name: "Rahul"
            },
            {
                id: 2,
                name: "Aman"
            }
        ]
    });
});

app.get("/api/about", (req, res) => {
    res.json({
        message: "This is my first Express API"
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

---

# 24. Test Your API

You can test your endpoints using:

### Browser

For GET requests:

```text
http://localhost:5000/
http://localhost:5000/api/users
http://localhost:5000/api/about
```

### Postman

Postman allows you to test:

```text
GET
POST
PUT
PATCH
DELETE
```

### Thunder Client

You can also use the Thunder Client VS Code extension.

---

# 25. Project Structure

At this stage:

```text
first-backend/
│
├── node_modules/
│
├── package-lock.json
├── package.json
└── server.js
```

For a small practice project, this is completely fine.

Later, as your application grows, we can move to:

```text
backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── .env
├── package.json
└── server.js
```

Don't worry about creating all those folders yet.

---

# 26. Common Beginner Mistakes

## Mistake 1: Forgetting to Install Express

If you see:

```text
Cannot find module 'express'
```

run:

```bash
npm install express
```

---

## Mistake 2: Wrong Port

If your server uses:

```js
app.listen(5000);
```

you need to open:

```text
http://localhost:5000
```

not:

```text
http://localhost:3000
```

---

## Mistake 3: Server Is Not Running

If the terminal isn't showing:

```text
Server running on port 5000
```

make sure you started it:

```bash
node server.js
```

---

## Mistake 4: Wrong URL

If you created:

```js
app.get("/users", ...)
```

you need:

```text
http://localhost:5000/users
```

not:

```text
http://localhost:5000/user
```

---

# 27. Important Concepts to Understand

After creating your first server, make sure you understand these:

```text
Node.js
   ↓
Express.js
   ↓
app
   ↓
Routes
   ↓
Request (req)
   ↓
Response (res)
   ↓
HTTP Methods
   ↓
Status Codes
   ↓
JSON
```

These concepts form the foundation of Express backend development.

---

# 28. What You Have Built

You have now built a backend that can:

```text
                 Express Server
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        GET /      GET /users    GET /about
          ↓            ↓            ↓
       Response     JSON Data    Response
```

This is the basic foundation of an API.

Later, we will add:

```text
Express
   ↓
Routing
   ↓
Middleware
   ↓
Controllers
   ↓
MongoDB
   ↓
Mongoose
   ↓
Authentication
   ↓
Validation
   ↓
Error Handling
```

---

# Key Takeaways

* **Node.js** allows JavaScript to run on the server.
* **Express.js** makes creating backend servers and APIs easier.
* `express()` creates an Express application.
* `app` represents the Express application.
* `app.get()` creates a GET route.
* `req` represents the incoming request.
* `res` represents the outgoing response.
* `res.send()` sends a response.
* `res.json()` sends JSON.
* `app.listen()` starts the server.
* `localhost` refers to your own computer.
* A **port** identifies the network service your server is listening on.

## Remember This Code

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Hello from my backend!"
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

## Remember the Flow

```text
Client
   ↓
HTTP Request
   ↓
Express Server
   ↓
Route Matching
   ↓
Route Handler
   ↓
Business Logic
   ↓
HTTP Response
   ↓
Client
```

> **Your first backend server is simply an application that listens for requests, matches them to routes, performs some logic, and sends responses back to the client.**
