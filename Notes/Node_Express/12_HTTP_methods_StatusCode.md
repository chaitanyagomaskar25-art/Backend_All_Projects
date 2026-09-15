# HTTP Methods, Status Codes, and API Responses

When a client communicates with a backend API, three important things work together:

```text
HTTP Method
     ↓
What does the client want to do?

Status Code
     ↓
What happened with the request?

Response Body
     ↓
What information should the client receive?
```

For example:

```text
Client
  │
  │ GET /users
  ↓
Backend
  │
  │ 200 OK
  │
  │ { "users": [...] }
  ↓
Client
```

---

# 1. HTTP Methods

An **HTTP method** tells the server what type of operation the client wants to perform.

Common HTTP methods used in APIs are:

```text
GET
POST
PUT
PATCH
DELETE
```

---

# 2. GET

`GET` is used to **retrieve data**.

For example:

```http
GET /students
```

Meaning:

> Give me the students.

Express:

```js
app.get("/students", (req, res) => {
    res.json({
        students: [
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

The client might receive:

```json
{
    "students": [
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

# 3. POST

`POST` is generally used to **create new data**.

Example:

```http
POST /students
```

The client might send:

```json
{
    "name": "Rahul",
    "age": 22,
    "course": "Backend"
}
```

Express:

```js
app.post("/students", (req, res) => {

    const student = req.body;

    res.status(201).json({
        message: "Student created successfully",
        student: student
    });

});
```

Response:

```json
{
    "message": "Student created successfully",
    "student": {
        "name": "Rahul",
        "age": 22,
        "course": "Backend"
    }
}
```

---

# 4. PUT

`PUT` is generally used to **replace or completely update an existing resource**.

Example:

```http
PUT /students/10
```

The client might send:

```json
{
    "name": "Rahul Kumar",
    "age": 23,
    "course": "Node.js"
}
```

Express:

```js
app.put("/students/:id", (req, res) => {

    const studentId = req.params.id;

    res.json({
        message: "Student updated successfully",
        studentId: studentId
    });

});
```

---

# 5. PATCH

`PATCH` is used to **partially update** a resource.

For example, suppose we only want to change the student's age.

```http
PATCH /students/10
```

Request body:

```json
{
    "age": 23
}
```

Express:

```js
app.patch("/students/:id", (req, res) => {

    const studentId = req.params.id;

    res.json({
        message: "Student partially updated",
        studentId: studentId,
        changes: req.body
    });

});
```

---

# 6. DELETE

`DELETE` is used to remove a resource.

Example:

```http
DELETE /students/10
```

Express:

```js
app.delete("/students/:id", (req, res) => {

    const studentId = req.params.id;

    res.json({
        message: "Student deleted successfully",
        studentId: studentId
    });

});
```

---

# 7. HTTP Methods Summary

| Method | Purpose               | Example               |
| ------ | --------------------- | --------------------- |
| GET    | Retrieve data         | `GET /students`       |
| POST   | Create data           | `POST /students`      |
| PUT    | Replace/update data   | `PUT /students/10`    |
| PATCH  | Partially update data | `PATCH /students/10`  |
| DELETE | Delete data           | `DELETE /students/10` |

A useful way to remember:

```text
GET     → Give me data
POST    → Create data
PUT     → Replace/update data
PATCH   → Change part of data
DELETE  → Remove data
```

---

# 8. What Are Status Codes?

After receiving a request, the server needs to tell the client what happened.

That's what **HTTP status codes** are used for.

For example:

```text
200
201
400
401
403
404
500
```

The status code is a short signal about the result of the request.

---

# 9. Status Code Categories

HTTP status codes are grouped into five categories.

```text
1xx → Informational
2xx → Success
3xx → Redirection
4xx → Client Error
5xx → Server Error
```

For backend APIs, you'll work mostly with:

```text
2xx
4xx
5xx
```

---

# 10. 200 OK

`200` means the request was successful.

Example:

```http
GET /students
```

Response:

```http
200 OK
```

JSON:

```json
{
    "message": "Students fetched successfully",
    "students": []
}
```

Express:

```js
res.status(200).json({
    message: "Students fetched successfully",
    students: []
});
```

In many Express cases, `200` is the default status for a successful response, so this also works:

```js
res.json({
    message: "Success"
});
```

---

# 11. 201 Created

`201` means a new resource was successfully created.

Commonly used with `POST`.

Example:

```http
POST /students
```

Response:

```http
201 Created
```

Express:

```js
res.status(201).json({
    message: "Student created successfully"
});
```

---

# 12. 204 No Content

`204` means the request succeeded but there is no response body to return.

It is commonly used when deleting a resource.

Example:

```http
DELETE /students/10
```

Response:

```http
204 No Content
```

Express:

```js
res.status(204).send();
```

When using `204`, don't send a JSON response body.

---

# 13. 400 Bad Request

`400` means the server cannot process the request because the client sent invalid or malformed input.

Example:

```http
POST /students
```

Client sends:

```json
{
    "name": "",
    "age": -5
}
```

The server may respond:

```http
400 Bad Request
```

```json
{
    "message": "Invalid student data"
}
```

Express:

```js
res.status(400).json({
    message: "Invalid student data"
});
```

---

# 14. 401 Unauthorized

`401` generally means the request requires valid authentication credentials, or the provided credentials are missing/invalid.

Example:

```http
GET /profile
```

Without a valid authentication token:

```http
401 Unauthorized
```

Response:

```json
{
    "message": "Authentication required"
}
```

---

# 15. 403 Forbidden

`403` means the server understood the request, but the client does not have permission to perform the operation.

Example:

```http
DELETE /users/10
```

A normal user tries to perform an admin-only operation.

Response:

```http
403 Forbidden
```

```json
{
    "message": "You do not have permission to delete this user"
}
```

---

# 16. 404 Not Found

`404` means the requested resource could not be found.

Example:

```http
GET /students/999
```

If student `999` doesn't exist:

```http
404 Not Found
```

Response:

```json
{
    "message": "Student not found"
}
```

Express:

```js
app.get("/students/:id", async (req, res) => {

    const student = null;

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});
```

---

# 17. 500 Internal Server Error

`500` means something went wrong on the server.

For example:

```text
Database failure
Unexpected server error
Unhandled exception
```

Response:

```http
500 Internal Server Error
```

```json
{
    "message": "Internal server error"
}
```

Express:

```js
res.status(500).json({
    message: "Internal server error"
});
```

---

# 18. Important Status Codes

You don't need to memorize every HTTP status code.

Start with these:

| Status | Meaning               | Common Usage                      |
| ------ | --------------------- | --------------------------------- |
| `200`  | OK                    | Successful request                |
| `201`  | Created               | Resource created                  |
| `204`  | No Content            | Successful operation with no body |
| `400`  | Bad Request           | Invalid input                     |
| `401`  | Unauthorized          | Authentication required/invalid   |
| `403`  | Forbidden             | No permission                     |
| `404`  | Not Found             | Resource doesn't exist            |
| `500`  | Internal Server Error | Server-side failure               |

---

# 19. What is an API Response?

An **API response** is the information the server sends back to the client after processing a request.

A response can contain:

```text
Status Code
Headers
Response Body
```

For example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "message": "Success",
    "data": []
}
```

Think of it as:

```text
Response
   │
   ├── Status Code
   │
   ├── Headers
   │
   └── Body
```

---

# 20. Response Body

The **response body** contains the actual information returned by the server.

For APIs, JSON is commonly used.

Example:

```json
{
    "message": "Student found",
    "student": {
        "id": 10,
        "name": "Rahul",
        "age": 22
    }
}
```

Express:

```js
res.json({
    message: "Student found",
    student: {
        id: 10,
        name: "Rahul",
        age: 22
    }
});
```

---

# 21. Successful API Response

A good API response should clearly communicate what happened.

Example:

```json
{
    "success": true,
    "message": "Student fetched successfully",
    "data": {
        "id": 10,
        "name": "Rahul",
        "age": 22
    }
}
```

The client can easily understand:

```text
success → true
message → What happened
data    → Actual result
```

---

# 22. Error API Response

When something goes wrong, the API should return useful information.

Example:

```json
{
    "success": false,
    "message": "Student not found"
}
```

With status code:

```http
404 Not Found
```

The client receives:

```text
Status Code
     ↓
404
     +
Response Body
     ↓
{
    "success": false,
    "message": "Student not found"
}
```

---

# 23. Consistent Response Structure

A good API should try to keep response formats consistent.

For example, successful responses:

```json
{
    "success": true,
    "message": "Request successful",
    "data": {}
}
```

Error responses:

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

This makes frontend development easier.

The frontend knows what structure to expect.

---

# 24. HTTP Method + Status Code + Response

Now let's put everything together.

Suppose the client wants to create a student.

### Step 1 — Client sends request

```http
POST /students
```

Request body:

```json
{
    "name": "Rahul",
    "age": 22
}
```

### Step 2 — Server processes it

```text
Express
   ↓
Validate data
   ↓
Save to MongoDB
   ↓
Student created
```

### Step 3 — Server sends response

```http
201 Created
```

```json
{
    "success": true,
    "message": "Student created successfully",
    "data": {
        "id": 10,
        "name": "Rahul",
        "age": 22
    }
}
```

---

# 25. Complete Communication Flow

The entire API communication looks like:

```text
                 CLIENT
                    │
                    │
                    │ HTTP Request
                    │
                    │ Method: POST
                    │ URL: /students
                    │ Body: student data
                    ↓
              EXPRESS SERVER
                    │
                    ↓
              Route Handler
                    │
                    ↓
             Business Logic
                    │
                    ↓
                Database
                    │
                    ↓
               Result
                    │
                    ↓
              HTTP Response
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
     Status Code          Response Body
       201 Created             JSON
          │                   │
          └─────────┬─────────┘
                    ↓
                  CLIENT
```

---

# 26. Example: Successful GET

Client:

```http
GET /students/10
```

Server:

```text
Find student 10
      ↓
Student exists
      ↓
Return student
```

Response:

```http
200 OK
```

```json
{
    "success": true,
    "message": "Student found",
    "data": {
        "id": 10,
        "name": "Rahul"
    }
}
```

---

# 27. Example: Student Doesn't Exist

Client:

```http
GET /students/999
```

Server:

```text
Find student 999
      ↓
Not found
      ↓
Return error
```

Response:

```http
404 Not Found
```

```json
{
    "success": false,
    "message": "Student not found"
}
```

---

# 28. Example: Invalid Data

Client:

```http
POST /students
```

Request:

```json
{
    "name": "",
    "age": -10
}
```

Server validates the data.

Validation fails.

Response:

```http
400 Bad Request
```

```json
{
    "success": false,
    "message": "Invalid student data"
}
```

---

# 29. Example: Express REST API

Here is a small example combining everything:

```js
const express = require("express");

const app = express();

app.use(express.json());

// GET
app.get("/students", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data: []
    });
});

// GET single student
app.get("/students/:id", (req, res) => {

    const studentId = req.params.id;

    if (studentId !== "1") {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Student found",
        data: {
            id: 1,
            name: "Rahul"
        }
    });
});

// POST
app.post("/students", (req, res) => {

    const student = req.body;

    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student
    });
});

// DELETE
app.delete("/students/:id", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Student deleted successfully"
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

---

# 30. How the Client Understands the Response

Suppose the frontend sends:

```http
GET /students/10
```

The server returns:

```http
404 Not Found
```

with:

```json
{
    "success": false,
    "message": "Student not found"
}
```

The frontend can use the status code:

```text
404
```

to understand:

> The requested student doesn't exist.

And the response body:

```text
Student not found
```

to understand the specific reason/message.

So:

```text
Status Code
     ↓
High-level result

Response Body
     ↓
Detailed information
```

---

# 31. Why Status Codes Matter

Imagine every API returned:

```http
200 OK
```

even when something went wrong.

The client would have difficulty determining whether:

```text
Request succeeded
Request failed
Resource doesn't exist
Authentication failed
Server crashed
```

Proper status codes make API communication much clearer.

For example:

```text
200 → Success
201 → Created
400 → Bad input
401 → Authentication problem
403 → Permission problem
404 → Resource doesn't exist
500 → Server problem
```

---

# 32. Why Consistent Responses Matter

Imagine one endpoint returns:

```json
{
    "message": "Success",
    "data": {}
}
```

while another returns:

```json
{
    "result": {},
    "msg": "Done"
}
```

and another returns:

```json
{
    "status": "okay",
    "value": {}
}
```

This makes frontend development unnecessarily difficult.

A consistent API might use:

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

for successful responses.

And:

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

for errors.

The exact format can vary by project, but **consistency is the important part**.

---

# 33. The Three-Part Mental Model

Whenever you're building an API, think about these three questions:

### 1. What does the client want?

Use the **HTTP method**.

```text
GET
POST
PUT
PATCH
DELETE
```

### 2. What happened?

Use the **status code**.

```text
200
201
400
401
403
404
500
```

### 3. What information should the client receive?

Use the **response body**.

```json
{
    "success": true,
    "message": "Student found",
    "data": {}
}
```

---

# Key Takeaways

## HTTP Methods

Tell the server **what operation the client wants**.

```text
GET     → Retrieve
POST    → Create
PUT     → Replace/update
PATCH   → Partially update
DELETE  → Delete
```

## Status Codes

Tell the client **what happened**.

```text
200 → Success
201 → Created
204 → No Content
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
500 → Server Error
```

## API Responses

Tell the client **the details of the result**.

Usually:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

or:

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

---

# Final Mental Model

```text
             CLIENT
                │
                │
                │  HTTP METHOD
                │  "What do I want?"
                ↓
             EXPRESS
                │
                ↓
          Process Request
                │
                ↓
             DATABASE
                │
                ↓
              RESULT
                │
                │  STATUS CODE
                │  "What happened?"
                │
                │  RESPONSE BODY
                │  "Here are the details."
                ↓
             CLIENT
```

> **HTTP Method = Action**

> **Status Code = Result**

> **Response Body = Details**

Once you understand these three together, reading and designing REST APIs becomes much, much easier.
