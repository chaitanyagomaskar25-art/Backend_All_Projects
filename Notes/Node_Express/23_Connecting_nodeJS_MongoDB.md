# Connecting Node.js to MongoDB

## 1. Introduction

Until now, our Express API used temporary data such as JavaScript arrays:

```js
const tasks = [
    {
        title: "Learn Node.js",
        completed: false
    }
];
```

The problem is that this data disappears when the server restarts.

To store data permanently, we need a database.

```text
Express API
     ↓
MongoDB
     ↓
Persistent Data
```

A connection between the Node.js application and MongoDB allows the backend to store and manage real application data.

---

# 2. Why Do We Need a Database Connection?

A **database connection** allows our Node.js application to communicate with MongoDB.

Through this connection, the backend can:

* Create data
* Read data
* Update data
* Delete data

These are the basic **CRUD operations**.

```text
Node.js / Express
        ↓
   Database Connection
        ↓
      MongoDB
        ↓
     Database
```

Without a connection, our API cannot communicate with MongoDB.

---

# 3. Database Connection in a Backend

The overall architecture looks like:

```text
Client
   ↓
HTTP Request
   ↓
Express.js
   ↓
Controller / Route
   ↓
Mongoose
   ↓
MongoDB
   ↓
Database
```

For example:

```text
POST /tasks
     ↓
Express
     ↓
Task.create()
     ↓
Mongoose
     ↓
MongoDB
     ↓
Task stored
```

---

# 4. Installing Required Packages

For a Node.js application using MongoDB and Mongoose, install:

```bash
npm install mongoose dotenv
```

If Express has not been installed yet:

```bash
npm install express mongoose dotenv
```

### Packages

| Package    | Purpose                           |
| ---------- | --------------------------------- |
| `express`  | Create the backend API            |
| `mongoose` | Connect and interact with MongoDB |
| `dotenv`   | Load environment variables        |

---

# 5. MongoDB Connection URL

A MongoDB connection requires a **MongoDB URI**.

For a local MongoDB server, it may look like:

```text
mongodb://localhost:27017/taskDB
```

Breaking it down:

```text
mongodb://
     ↓
MongoDB protocol

localhost
     ↓
MongoDB is running on this computer

27017
     ↓
Default MongoDB port

taskDB
     ↓
Database name
```

---

# 6. Why Should We Use Environment Variables?

We should avoid writing sensitive configuration directly inside our source code.

For example, avoid:

```js
mongoose.connect(
    "mongodb://username:password@server/database"
);
```

Instead, store the connection information in an environment file.

Create:

```text
.env
```

Example:

```env
MONGO_URL=mongodb://localhost:27017/taskDB
PORT=3000
```

Then access it using:

```js
process.env.MONGO_URL
```

---

# 7. Why `.env` is Important

Environment variables are useful for storing configuration that may change between environments.

For example:

```text
Development
    ↓
Local MongoDB

Production
    ↓
MongoDB Atlas
```

The application code can remain the same while the database URL changes.

```text
Application Code
       ↓
process.env.MONGO_URL
       ↓
Different database depending on environment
```

---

# 8. Loading Environment Variables

Install dotenv:

```bash
npm install dotenv
```

Then load the variables:

```js
import dotenv from "dotenv";

dotenv.config();
```

Now:

```js
process.env.MONGO_URL
```

can access the value from `.env`.

For example:

```env
MONGO_URL=mongodb://localhost:27017/taskDB
```

Then:

```js
console.log(process.env.MONGO_URL);
```

will give:

```text
mongodb://localhost:27017/taskDB
```

---

# 9. Connecting Using Mongoose

Import Mongoose:

```js
import mongoose from "mongoose";
```

Then:

```js
await mongoose.connect(process.env.MONGO_URL);
```

A simple connection example:

```js
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URL);

console.log("MongoDB connected");
```

---

# 10. Creating a Separate Database Connection File

As the application grows, it is better to keep database connection logic separate.

Project structure:

```text
src/
│
├── config/
│   └── db.js
│
├── models/
│   └── Task.js
│
├── routes/
│   └── taskRoutes.js
│
├── controllers/
│   └── taskController.js
│
└── server.js
```

The database connection can be placed inside:

```text
src/config/db.js
```

---

# 11. `db.js`

Example:

```js
import mongoose from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
};

export default connectDB;
```

---

# 12. Understanding the Connection Function

Let's break it down.

### Function

```js
const connectDB = async () => {
```

We create an asynchronous function because connecting to a database takes time.

---

### Connecting

```js
await mongoose.connect(process.env.MONGO_URL);
```

Mongoose reads the MongoDB URL from:

```js
process.env.MONGO_URL
```

and attempts to connect to MongoDB.

---

### Success

If the connection succeeds:

```js
console.log("MongoDB connected");
```

You might see:

```text
MongoDB connected
```

---

### Failure

If something goes wrong:

```js
catch (error) {
```

we handle the error.

```js
console.error(
    "MongoDB connection failed:",
    error.message
);
```

This helps us understand what went wrong.

---

# 13. Why Handle Connection Errors?

Database connections can fail for many reasons.

For example:

```text
MongoDB is not running
        ↓
Connection refused
```

or:

```text
Wrong MongoDB URL
        ↓
Connection failure
```

or:

```text
Invalid username/password
        ↓
Authentication failure
```

Error handling makes these problems easier to identify.

---

# 14. What Does `process.exit(1)` Mean?

In:

```js
process.exit(1);
```

the application is stopped because the database connection failed.

The value:

```text
0
```

usually indicates successful termination.

A non-zero value such as:

```text
1
```

indicates that the application stopped because of an error.

For a backend that depends on MongoDB, failing fast can be preferable to starting an API that cannot perform database operations.

---

# 15. Connecting the Database to Express

Now we can use the connection function in our server.

### `server.js`

```js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

---

# 16. Application Startup Flow

When we run:

```bash
node server.js
```

the application starts.

The general flow is:

```text
node server.js
      ↓
dotenv.config()
      ↓
Express app created
      ↓
connectDB()
      ↓
MongoDB connection
      ↓
Server starts
```

If MongoDB is available:

```text
MongoDB connected
Server is running on port 3000
```

---

# 17. Better Startup Pattern

For database-dependent applications, we can wait for MongoDB before starting the server.

Example:

```js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

const startServer = async () => {

    try {

        await connectDB();

        app.listen(3000, () => {
            console.log(
                "Server is running on port 3000"
            );
        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

    }
};

startServer();
```

This creates a safer startup sequence:

```text
Start Application
       ↓
Connect MongoDB
       ↓
Connection successful?
     /       \
   Yes        No
    ↓          ↓
Start       Stop
Server      Application
```

---

# 18. Connecting MongoDB to API Routes

Once MongoDB is connected, our routes can use Mongoose models.

For example:

```js
app.get("/tasks", async (req, res) => {

    const tasks = await Task.find();

    res.status(200).json(tasks);

});
```

The flow is:

```text
GET /tasks
    ↓
Express Route
    ↓
Task.find()
    ↓
Mongoose
    ↓
MongoDB
    ↓
Tasks
    ↓
JSON Response
```

---

# 19. Creating Data Through an API

Suppose we have:

```js
app.post("/tasks", async (req, res) => {

    const task = await Task.create(req.body);

    res.status(201).json(task);

});
```

The client sends:

```json
{
    "title": "Learn MongoDB",
    "completed": false
}
```

The backend processes it:

```text
POST /tasks
     ↓
req.body
     ↓
Task.create()
     ↓
Mongoose
     ↓
MongoDB
     ↓
Document saved
     ↓
201 Response
```

---

# 20. CRUD with a Real Database

Now our previous array-based CRUD API becomes a real database API.

### Create

```http
POST /tasks
```

```js
Task.create()
```

### Read

```http
GET /tasks
```

```js
Task.find()
```

### Read One

```http
GET /tasks/:id
```

```js
Task.findById()
```

### Update

```http
PUT /tasks/:id
```

```js
Task.findByIdAndUpdate()
```

### Delete

```http
DELETE /tasks/:id
```

```js
Task.findByIdAndDelete()
```

---

# 21. Environment Variables and Security

Never commit sensitive environment variables to Git.

Your `.env` file might contain:

```env
MONGO_URL=mongodb://username:password@server/database
```

Add `.env` to:

```text
.gitignore
```

Example:

```gitignore
node_modules/
.env
```

This prevents sensitive configuration from accidentally being committed to a public repository.

---

# 22. Local MongoDB vs MongoDB Atlas

There are two common ways to connect.

### Local MongoDB

```text
mongodb://localhost:27017/taskDB
```

MongoDB runs on your computer.

### MongoDB Atlas

MongoDB runs in the cloud.

The connection URL will be provided by your Atlas cluster.

Your application still uses:

```js
mongoose.connect(process.env.MONGO_URL);
```

The important difference is where MongoDB is running.

```text
Local:

Node.js → Local MongoDB


Cloud:

Node.js → Internet → MongoDB Atlas
```

---

# 23. Common Connection Errors

## Error 1: `undefined` MongoDB URL

Example:

```text
The `uri` parameter to `openUri()` must be a string,
got "undefined"
```

Usually this means:

```js
process.env.MONGO_URL
```

is undefined.

Check:

```env
MONGO_URL=...
```

and make sure:

```js
dotenv.config();
```

runs before accessing the environment variable.

---

## Error 2: Connection Refused

Example:

```text
ECONNREFUSED 127.0.0.1:27017
```

This usually means MongoDB is not running at the specified local address/port.

Check that your MongoDB server is running.

---

## Error 3: Invalid Credentials

If using MongoDB Atlas, check:

* Username
* Password
* Connection string
* Database user permissions
* Network access settings

---

# 24. Important Rule: Don't Hardcode Credentials

Bad:

```js
mongoose.connect(
    "mongodb://admin:password123@localhost:27017/taskDB"
);
```

Better:

```env
MONGO_URL=mongodb://admin:password123@localhost:27017/taskDB
```

and:

```js
mongoose.connect(process.env.MONGO_URL);
```

The `.env` file should not be committed to Git.

---

# 25. Database Connection vs Model

Don't confuse these two concepts.

### Database Connection

Connects the application to MongoDB.

```js
mongoose.connect(process.env.MONGO_URL);
```

Think:

```text
Node.js
   ↓
MongoDB
```

### Model

Represents a particular type of data.

```js
const Task = mongoose.model("Task", taskSchema);
```

Think:

```text
Task Model
   ↓
tasks collection
```

So:

```text
Connection
   ↓
Connects to MongoDB

Model
   ↓
Works with specific data
```

---

# 26. Complete Architecture

At this stage, your backend architecture looks like:

```text
                     CLIENT
                        │
                        ↓
                  HTTP Request
                        │
                        ↓
                   Express.js
                        │
                        ↓
                     Routes
                        │
                        ↓
                  Controllers
                        │
                        ↓
                    Mongoose
                        │
                        ↓
                    MongoDB
                        │
                        ↓
                    Database
                        │
                        ↓
                    Documents
                        │
                        ↓
                  JSON Response
                        │
                        ↓
                     CLIENT
```

---

# 27. Important Concepts to Remember

### MongoDB

The actual database where data is stored.

### Mongoose

The ODM library that helps Node.js communicate with MongoDB.

### Connection

Establishes communication between the application and MongoDB.

### Environment Variable

Stores configuration such as database URLs outside the source code.

### Schema

Defines the structure and validation rules for documents.

### Model

Provides methods to interact with a specific MongoDB collection.

---

# 28. Final Mental Model

Remember these three layers:

```text
Express
   ↓
Handles HTTP requests and responses


Mongoose
   ↓
Handles application-level interaction with MongoDB


MongoDB
   ↓
Stores persistent data
```

And the complete flow:

```text
Client
  ↓
Express
  ↓
Route
  ↓
Controller
  ↓
Mongoose Model
  ↓
MongoDB
  ↓
Database
  ↓
Result
  ↓
Controller
  ↓
Express
  ↓
Client
```

---

# 29. Final Takeaway

> **Connecting Node.js to MongoDB allows your backend API to store and manage persistent application data. Mongoose provides the interface between Node.js and MongoDB, while environment variables keep database configuration secure and flexible.**

The progression is now:

```text
Node.js
   ↓
Express.js
   ↓
REST API
   ↓
Routes
   ↓
Middleware
   ↓
Error Handling
   ↓
MongoDB
   ↓
Mongoose
   ↓
Database Connection
   ↓
Schemas
   ↓
Models
   ↓
CRUD Operations
   ↓
Persistent Data
```

**Next logical step:** create a complete **Task API using Express + Mongoose + MongoDB**, replacing your old in-memory array with a real `Task` model and database CRUD operations.
