# Connecting Express API to MongoDB Using Mongoose

## 1. What Are We Trying to Do?

Until now, our Express API may have stored data temporarily inside JavaScript arrays:

```js
const tasks = [];
```

The problem is that this data disappears when the server restarts.

Instead, we want:

```text
Client
   ↓
Express API
   ↓
Mongoose
   ↓
MongoDB
   ↓
Persistent Data
```

MongoDB stores the data permanently, while Mongoose allows our Node.js/Express application to communicate with MongoDB using JavaScript.

---

# 2. What Is MongoDB Atlas?

**MongoDB Atlas** is MongoDB's cloud-based database service.

Instead of running MongoDB only on your own computer, Atlas gives you a MongoDB database hosted in the cloud.

You can access it using a connection string such as:

```text
mongodb+srv://username:password@cluster.mongodb.net/taskDB
```

Your Node.js application uses this connection string to connect to the database.

---

# 3. Create a MongoDB Atlas Cluster

The basic process is:

```text
MongoDB Atlas
     ↓
Create Project
     ↓
Create Cluster
     ↓
Create Database User
     ↓
Allow Network Access
     ↓
Get Connection String
```

### Step 1 — Create an Atlas account

Create an account on MongoDB Atlas.

### Step 2 — Create a project

Create a project for your application.

For example:

```text
Task Management API
```

### Step 3 — Create a cluster

Create a MongoDB cluster.

For learning purposes, you can use the available free-tier option.

### Step 4 — Create a database user

Create a username and password that your Node.js application will use.

Example:

```text
Username: taskUser
Password: yourPassword
```

**Important:** Never put database credentials directly inside your source code.

---

# 4. Configure Network Access

MongoDB Atlas needs to know which IP addresses are allowed to connect.

Go to:

```text
Network Access
```

and configure an allowed IP address.

For development, Atlas may allow:

```text
0.0.0.0/0
```

which means connections are allowed from any IP address.

⚠️ This is convenient for development but is not the ideal production configuration. In production, restrict access to trusted IPs/networks whenever possible.

---

# 5. Get the MongoDB Connection String

Atlas provides a connection string for your application.

It may look like:

```text
mongodb+srv://taskUser:<password>@cluster0.xxxxx.mongodb.net/taskDB
```

Replace `<password>` with your database user's password.

The database name can be:

```text
taskDB
```

So the connection string might look like:

```text
mongodb+srv://taskUser:password123@cluster0.xxxxx.mongodb.net/taskDB
```

Do **not** commit this connection string to GitHub.

---

# 6. Install Required Packages

Inside your Node.js project:

```bash
npm install express mongoose dotenv
```

We need three packages:

| Package    | Purpose                              |
| ---------- | ------------------------------------ |
| `express`  | Create the API/server                |
| `mongoose` | Connect and communicate with MongoDB |
| `dotenv`   | Load environment variables           |

---

# 7. Store the Connection String in `.env`

Create:

```text
.env
```

Example:

```env
MONGO_URL=mongodb+srv://taskUser:password123@cluster0.xxxxx.mongodb.net/taskDB
PORT=3000
```

The important idea is:

```text
.env
 ↓
process.env.MONGO_URL
 ↓
mongoose.connect()
 ↓
MongoDB
```

---

# 8. Protect the `.env` File

Add `.env` to:

```text
.gitignore
```

Example:

```gitignore
node_modules/
.env
```

Why?

Because `.env` contains sensitive information such as:

```text
database username
database password
API keys
secret keys
```

You don't want these credentials pushed to GitHub.

---

# 9. Create the Express Server

Example project structure:

```text
my-api/
│
├── node_modules/
├── .env
├── .gitignore
├── package.json
└── server.js
```

Because we're using ES Modules, make sure `package.json` contains:

```json
{
  "type": "module"
}
```

---

# 10. Import Express, Mongoose, and dotenv

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
```

Then load the environment variables:

```js
dotenv.config();
```

Now:

```js
process.env.MONGO_URL
```

contains the MongoDB connection string.

---

# 11. Create the Express Application

```js
const app = express();
```

Configure Express to understand JSON:

```js
app.use(express.json());
```

This allows us to receive JSON such as:

```json
{
  "name": "Chaitanya",
  "age": 22
}
```

through requests.

---

# 12. Connect to MongoDB

The main method is:

```js
mongoose.connect(process.env.MONGO_URL);
```

A better approach is to use `await` so the server starts only after the database connection succeeds.

```js
await mongoose.connect(process.env.MONGO_URL);

console.log("MongoDB connected");
```

---

# 13. Handle Connection Errors

We should also handle connection failures.

```js
try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
} catch (error) {
    console.error("MongoDB connection failed:", error.message);
}
```

This helps us identify problems such as:

* Incorrect connection string
* Wrong username/password
* Network access problems
* MongoDB Atlas unavailable
* Missing environment variable

---

# 14. Complete Basic Example

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

---

# 15. Understanding the Code

Let's break it down.

### Import packages

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
```

We import the tools we need.

---

### Load environment variables

```js
dotenv.config();
```

This loads:

```env
MONGO_URL=...
PORT=3000
```

into:

```js
process.env
```

So:

```js
process.env.MONGO_URL
```

gives us the MongoDB connection string.

---

### Create Express application

```js
const app = express();
```

This creates our Express server application.

---

### Enable JSON

```js
app.use(express.json());
```

This allows Express to parse JSON request bodies.

---

### Connect to MongoDB

```js
await mongoose.connect(process.env.MONGO_URL);
```

This tells Mongoose:

> Connect my Node.js application to this MongoDB database.

---

### Start the server

```js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

This starts the HTTP server.

---

# 16. Why Should We Connect to MongoDB Before Starting the Server?

Consider this:

```text
Server starts
      ↓
Client sends request
      ↓
API tries to access MongoDB
      ↓
MongoDB isn't connected
      ↓
ERROR
```

A safer startup process is:

```text
Start application
      ↓
Connect to MongoDB
      ↓
Connection successful?
      ↓
YES
      ↓
Start Express server
```

For example:

```js
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();
```

This is a cleaner startup pattern.

---

# 17. Test the Server

Start the server:

```bash
node server.js
```

You should see something similar to:

```text
MongoDB connected
Server running on port 3000
```

Now open Postman.

Send:

```http
GET http://localhost:3000/
```

Expected response:

```json
{
    "message": "Server is running"
}
```

At this point we have verified:

```text
Postman
   ↓
Express
   ↓
Server is running
```

And the terminal verifies:

```text
Express
   ↓
Mongoose
   ↓
MongoDB
   ↓
Connected
```

---

# 18. Important: Connection Does NOT Mean Data Is Being Stored Yet

This is a very important distinction.

After:

```js
await mongoose.connect(process.env.MONGO_URL);
```

we have only established a connection.

We haven't created a schema.

We haven't created a model.

We haven't inserted any documents.

The current situation is:

```text
Express
   ↓
Mongoose
   ↓
MongoDB

       ✅ Connected
       ❌ No application data yet
```

The next step is:

```text
Schema
   ↓
Model
   ↓
CRUD operations
   ↓
MongoDB documents
```

---

# 19. Connection vs Schema vs Model

These three concepts are easy to confuse.

### Connection

```js
mongoose.connect(...)
```

Means:

> Connect my application to MongoDB.

---

### Schema

```js
const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});
```

Means:

> Define the structure of my data.

---

### Model

```js
const Task = mongoose.model("Task", taskSchema);
```

Means:

> Create a JavaScript interface that I can use to work with Task documents.

Then:

```js
Task.create(...)
Task.find(...)
Task.findById(...)
Task.findByIdAndUpdate(...)
Task.findByIdAndDelete(...)
```

can be used for CRUD operations.

---

# 20. Complete Architecture

Once we add schemas and models, our application will look like:

```text
                CLIENT
                  │
                  │ HTTP Request
                  ↓
              EXPRESS API
                  │
                  ↓
               ROUTES
                  │
                  ↓
             CONTROLLERS
                  │
                  ↓
              MONGOOSE
                  │
             ┌────┴────┐
             ↓         ↓
          Schema     Model
             │         │
             └────┬────┘
                  ↓
              MONGODB
                  │
                  ↓
             Database
                  │
                  ↓
              Response
                  │
                  ↓
               CLIENT
```

---

# 21. Common Errors

## Error 1 — `process.env.MONGO_URL` is undefined

You might see:

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

### `.env`

```env
MONGO_URL=your_connection_string
```

### dotenv

```js
dotenv.config();
```

### Variable name

Make sure both names are exactly the same:

```env
MONGO_URL=...
```

```js
process.env.MONGO_URL
```

---

# 22. Error 2 — Authentication Failed

You might see an authentication error.

Check:

```text
MongoDB username
MongoDB password
Database user permissions
Connection string
```

Also remember that special characters in passwords may need URL encoding in the connection string.

---

# 23. Error 3 — Network Access Error

If Atlas rejects the connection, check:

```text
MongoDB Atlas
     ↓
Network Access
     ↓
Allowed IP addresses
```

Your current IP must be allowed according to your Atlas network configuration.

---

# 24. Local MongoDB vs MongoDB Atlas

You can connect to either a local MongoDB server or Atlas.

### Local MongoDB

```env
MONGO_URL=mongodb://localhost:27017/taskDB
```

### MongoDB Atlas

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/taskDB
```

The application code can remain almost identical:

```js
await mongoose.connect(process.env.MONGO_URL);
```

Only the connection string changes.

---

# 25. Mental Model

Remember this simple idea:

```text
MongoDB
= Database

Mongoose
= JavaScript tool for communicating with MongoDB

Express
= Web/API framework

dotenv
= Loads secret configuration from .env
```

Together:

```text
Express
   ↓
Mongoose
   ↓
MongoDB
```

with:

```text
.env
 ↓
MongoDB connection string
 ↓
Mongoose
```

---

# 26. What We Have Achieved

At this stage, we can:

* Create an Express server
* Load environment variables
* Connect Express/Node.js to MongoDB
* Use Mongoose as the MongoDB ODM
* Handle successful connections
* Handle connection errors
* Test the API using Postman
* Keep database credentials outside the source code

But we **cannot yet properly manage application data**.

For that, we need:

```text
Schema
    ↓
Model
    ↓
Create
    ↓
Read
    ↓
Update
    ↓
Delete
```

---

# 27. Next Step

The next lesson should be:

## MongoDB Schema + Mongoose Model

We will build something like:

```js
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    }
});
```

Then create the model:

```js
const Task = mongoose.model("Task", taskSchema);
```

And finally replace our temporary:

```js
const tasks = [];
```

with real MongoDB persistence:

```text
POST /tasks
      ↓
Task.create()
      ↓
MongoDB
      ↓
Document stored permanently
```

That is where the API starts becoming a **real backend application**.
