# Day 10 — CRUD APIs, REST Principles, HTTP Methods & Postman

## Topics
- CRUD APIs
- REST Principles
- HTTP Methods
- Postman

---

## 1. CRUD APIs

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

Almost every application needs these four operations.

### CRUD + HTTP Methods

| CRUD | HTTP Method | Example |
|---|---|---|
| Create | POST | `POST /developers` |
| Read | GET | `GET /developers` |
| Read One | GET | `GET /developers/1` |
| Update | PUT | `PUT /developers/1` |
| Partial Update | PATCH | `PATCH /developers/1` |
| Delete | DELETE | `DELETE /developers/1` |

Easy memory:

```text
CREATE → POST
READ   → GET
UPDATE → PUT / PATCH
DELETE → DELETE
```

### Create — POST

```js
app.post("/developers", (req, res) => {
    const developer = {
        id: developers.length + 1,
        ...req.body
    };

    developers.push(developer);

    res.status(201).json(developer);
});
```

Request:

```text
POST /developers
```

Body:

```json
{
    "name": "Aman",
    "skill": "JavaScript"
}
```

### Read — GET

```js
app.get("/developers", (req, res) => {
    res.json(developers);
});
```

Get one:

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

### Update — PUT

PUT is generally used to replace or update a resource representation.

```js
app.put("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = developers.findIndex(d => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    developers[index] = {
        id,
        ...req.body
    };

    res.json(developers[index]);
});
```

### Partial Update — PATCH

PATCH is generally used when only part of a resource needs to change.

```js
app.patch("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const developer = developers.find(d => d.id === id);

    if (!developer) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    Object.assign(developer, req.body);

    res.json(developer);
});
```

### PUT vs PATCH

**PUT:** generally replaces/updates the resource representation.

**PATCH:** generally updates only specific fields.

```text
PUT
 ↓
Replace/update resource

PATCH
 ↓
Change part of resource
```

### Delete — DELETE

```js
app.delete("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = developers.findIndex(d => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    const deletedDeveloper = developers.splice(index, 1);

    res.json({
        message: "Developer deleted",
        developer: deletedDeveloper[0]
    });
});
```

---

## 2. Complete CRUD API

```js
const express = require("express");

const app = express();

app.use(express.json());

let developers = [
    {
        id: 1,
        name: "Chaitanya",
        skill: "React"
    },
    {
        id: 2,
        name: "Rahul",
        skill: "Node.js"
    }
];

// CREATE
app.post("/developers", (req, res) => {
    const developer = {
        id: developers.length + 1,
        ...req.body
    };

    developers.push(developer);

    res.status(201).json(developer);
});

// READ ALL
app.get("/developers", (req, res) => {
    res.json(developers);
});

// READ ONE
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

// UPDATE
app.put("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = developers.findIndex(d => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    developers[index] = {
        id,
        ...req.body
    };

    res.json(developers[index]);
});

// PARTIAL UPDATE
app.patch("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const developer = developers.find(d => d.id === id);

    if (!developer) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    Object.assign(developer, req.body);

    res.json(developer);
});

// DELETE
app.delete("/developers/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = developers.findIndex(d => d.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    const deletedDeveloper = developers.splice(index, 1);

    res.json({
        message: "Developer deleted",
        developer: deletedDeveloper[0]
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

---

# 3. REST Principles

## What is REST?

REST stands for:

> Representational State Transfer

REST is an architectural style for designing network APIs.

A RESTful API commonly uses:

- Resources
- HTTP methods
- Meaningful URLs
- Stateless requests
- Standard HTTP status codes
- A uniform interface

Example:

```text
GET    /developers
POST   /developers
GET    /developers/1
PUT    /developers/1
PATCH  /developers/1
DELETE /developers/1
```

### Client-Server Separation

The client and server have separate responsibilities.

```text
Frontend
   ↓
HTTP Request
   ↓
Backend API
   ↓
Database
```

Frontend commonly handles UI and user interaction.

Backend commonly handles business logic, authentication, database operations, and API responses.

### Statelessness

Each request should contain the information necessary for the server to process it.

The server should not depend on remembering the previous request as part of the API interaction.

For authentication, a client commonly sends authentication information with each request, such as:

```http
Authorization: Bearer <token>
```

### Uniform Interface

REST encourages a consistent way to interact with resources:

```text
GET    /developers
POST   /developers
GET    /developers/1
PUT    /developers/1
PATCH  /developers/1
DELETE /developers/1
```

### Resource-Based URLs

REST APIs generally use nouns for resources.

Good:

```text
/developers
/users
/products
/orders
```

Specific resources:

```text
/developers/10
/users/5
/products/20
```

Avoid action-based URLs when the HTTP method already describes the action.

Less RESTful:

```text
/createDeveloper
/deleteDeveloper
/updateDeveloper
```

Better:

```text
POST /developers
DELETE /developers/10
PUT /developers/10
```

### HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `204` | Success, no content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

---

# 4. HTTP Methods

HTTP methods are standardized commands that indicate the desired operation on a resource.

Think of them as verbs for APIs.

```text
GET     → Read
POST    → Create
PUT     → Replace/Update
PATCH   → Partial Update
DELETE  → Delete
```

## GET

Retrieves data.

```text
GET /developers
```

## POST

Creates or submits data.

```text
POST /developers
```

## PUT

Generally replaces or updates a resource representation.

```text
PUT /developers/1
```

## PATCH

Generally performs a partial update.

```text
PATCH /developers/1
```

## DELETE

Deletes a resource.

```text
DELETE /developers/1
```

---

# 5. What is Postman?

Postman is an API development and testing tool.

It allows you to:

- Send HTTP requests
- Test APIs
- Send JSON bodies
- Add query parameters
- Add headers
- View responses
- Check status codes

Instead of building a frontend just to test your backend, you can use Postman.

### Postman Request Flow

```text
Postman
   ↓
HTTP Request
   ↓
Express Server
   ↓
Route
   ↓
Response
   ↓
Postman
```

Postman is not your backend. It acts as a client/testing tool.

---

# 6. Testing APIs in Postman

Assume the Express server is running at:

```text
http://localhost:3000
```

## GET All

```text
GET http://localhost:3000/developers
```

## GET One

```text
GET http://localhost:3000/developers/1
```

## GET with Query Parameter

```text
GET http://localhost:3000/developers?skill=React
```

In Postman's Params section:

```text
KEY       VALUE
skill     React
```

## POST

```text
POST http://localhost:3000/developers
```

Body → raw → JSON:

```json
{
    "name": "Aman",
    "skill": "JavaScript",
    "experience": 2
}
```

Your Express app needs:

```js
app.use(express.json());
```

## PUT

```text
PUT http://localhost:3000/developers/1
```

Body:

```json
{
    "name": "Chaitanya",
    "skill": "Node.js",
    "experience": 2
}
```

## PATCH

```text
PATCH http://localhost:3000/developers/1
```

Body:

```json
{
    "skill": "Express"
}
```

## DELETE

```text
DELETE http://localhost:3000/developers/2
```

Usually no body is required.

---

# 7. Important Postman Sections

### Method

```text
GET
POST
PUT
PATCH
DELETE
```

### URL

```text
http://localhost:3000/developers
```

### Params

Used for query parameters:

```text
?skill=React
```

### Headers

Example:

```text
Content-Type: application/json
```

### Body

Used to send data:

```json
{
    "name": "Aman",
    "skill": "React"
}
```

### Response

Postman shows:

- Status code
- Response body
- Response headers
- Response time

---

# 8. Request Data and Express

Suppose the client sends:

```text
POST /developers/10?source=postman
```

Body:

```json
{
    "name": "Aman"
}
```

Express can access:

```js
req.params.id
req.query.source
req.body.name
```

Mental model:

```text
URL Path
   ↓
req.params

Query String
   ↓
req.query

Request Body
   ↓
req.body

Headers
   ↓
req.headers
```

---

# 9. Common Mistakes

## Forgetting `express.json()`

If you're receiving JSON:

```js
app.use(express.json());
```

Register it before the routes that need the body.

## Wrong HTTP Method

If the route is:

```js
app.post("/developers", ...)
```

but Postman sends:

```text
GET /developers
```

the POST route will not execute.

## Wrong Port

If the server uses:

```js
app.listen(5000);
```

use:

```text
http://localhost:5000
```

## Server Isn't Running

Start it with:

```bash
node server.js
```

or:

```bash
npx nodemon server.js
```

## Invalid JSON

Correct:

```json
{
    "name": "Aman",
    "skill": "React"
}
```

Incorrect:

```text
{
    name: Aman
}
```

---

# 10. Interview Questions

### What does CRUD stand for?

```text
Create
Read
Update
Delete
```

### Which HTTP method creates a resource?

`POST`

### Which HTTP method retrieves data?

`GET`

### PUT vs PATCH?

PUT generally replaces/updates a resource representation.

PATCH generally performs a partial update.

### What is REST?

REST is an architectural style for designing networked APIs around resources and standard HTTP semantics.

### What is a RESTful API?

An API designed according to REST principles and conventions.

### Why are REST URLs usually nouns?

The URL identifies the resource, while the HTTP method describes the operation.

Example:

```text
DELETE /developers/10
```

```text
DELETE
   ↓
Operation

/developers/10
   ↓
Resource
```

### What does stateless mean?

Each request should contain the information necessary for the server to process it without depending on stored client-session context from a previous request.

### What is Postman?

Postman is a tool used to send HTTP requests and test APIs.

### Is Postman a backend?

No.

```text
Postman
   ↓
Request
   ↓
Backend
   ↓
Response
   ↓
Postman
```

---

# 11. Mini Project — Developer Management API

Create:

```js
let developers = [
    {
        id: 1,
        name: "Chaitanya",
        skill: "React",
        experience: 1
    },
    {
        id: 2,
        name: "Rahul",
        skill: "Node.js",
        experience: 2
    }
];
```

Implement:

```text
GET    /developers
GET    /developers/:id
GET    /developers?skill=React
POST   /developers
PUT    /developers/:id
PATCH  /developers/:id
DELETE /developers/:id
```

Then test every endpoint in Postman.

---

# 12. Quick Revision

```text
CRUD
────────────────────
Create → POST
Read   → GET
Update → PUT / PATCH
Delete → DELETE
```

```text
REST
────────────────────
Resource-based URLs
Stateless requests
HTTP methods
Uniform interface
HTTP status codes
Client-server separation
```

```text
EXPRESS
────────────────────
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

```text
REQUEST DATA
────────────────────
/users/10
    ↓
req.params

/users?name=chai
    ↓
req.query

{
    "name": "Chaitanya"
}
    ↓
req.body
```

```text
POSTMAN
────────────────────
Choose Method
      ↓
Enter URL
      ↓
Add Params / Headers / Body
      ↓
Send
      ↓
Check Response
```

## Final Mental Model

```text
                    API
                     │
          ┌──────────┴──────────┐
          │                     │
       Resource              Operation
          │                     │
     /developers          HTTP Method
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                GET            POST          DELETE
                 │              │              │
                Read          Create         Delete
```

The key pattern:

```text
POST   /developers
GET    /developers
GET    /developers/:id
PUT    /developers/:id
PATCH  /developers/:id
DELETE /developers/:id
```
