# Route Parameters and Query Parameters in Express.js

When working with APIs, clients often need to send additional information to the backend.

For example:

```text
Get user with ID 10
Search for students named Rahul
Get products from page 2
Filter products by category
```

Express provides several ways to receive this information.

Two important methods are:

1. **Route Parameters**
2. **Query Parameters**

---

# 1. Route Parameters

A **route parameter** is a dynamic value included directly inside the URL path.

It is commonly used when we want to identify a **specific resource**.

### Example

```text
/users/10
```

Here:

```text
10
```

is the user's ID.

The route can be defined as:

```js
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);

    res.send(`User ID: ${req.params.id}`);
});
```

If the client requests:

```text
GET /users/10
```

Then:

```js
req.params.id
```

will contain:

```text
10
```

---

# 2. Understanding `:id`

When you write:

```js
"/users/:id"
```

the `:id` means:

> "This part of the URL is dynamic."

For example, all of these requests match the same route:

```text
/users/1
/users/10
/users/25
/users/500
```

Express captures the dynamic value.

```text
/users/25
       ↑
       │
       └── id
```

Then:

```js
req.params.id
```

returns:

```text
25
```

---

# 3. Route Parameter Example

```js
const express = require("express");

const app = express();

app.get("/users/:id", (req, res) => {

    const userId = req.params.id;

    res.json({
        message: "User found",
        id: userId
    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

If we visit:

```text
http://localhost:5000/users/25
```

Response:

```json
{
    "message": "User found",
    "id": "25"
}
```

---

# 4. Multiple Route Parameters

A route can contain multiple parameters.

Example:

```js
app.get("/users/:userId/posts/:postId", (req, res) => {

    console.log(req.params.userId);
    console.log(req.params.postId);

    res.json(req.params);

});
```

Request:

```text
GET /users/10/posts/50
```

Result:

```json
{
    "userId": "10",
    "postId": "50"
}
```

The URL structure is:

```text
/users/:userId/posts/:postId
```

Actual URL:

```text
/users/10/posts/50
```

---

# 5. Why Use Route Parameters?

Route parameters are useful when identifying a **specific resource**.

Examples:

```text
/users/10
/products/50
/orders/100
/posts/25
/students/15
```

Usually:

```text
/resource/:id
```

means:

> "Give me the resource with this particular ID."

---

# 6. Query Parameters

A **query parameter** is additional information added to the URL after a `?`.

Example:

```text
/users?name=Rahul
```

Here:

```text
name=Rahul
```

is a query parameter.

Query parameters are commonly used for:

* Searching
* Filtering
* Sorting
* Pagination
* Optional settings

---

# 7. Accessing Query Parameters

In Express, query parameters are accessed using:

```js
req.query
```

Example:

```js
app.get("/users", (req, res) => {

    console.log(req.query);

    res.json(req.query);

});
```

If the client sends:

```text
GET /users?name=Rahul
```

Then:

```js
req.query
```

contains:

```js
{
    name: "Rahul"
}
```

And:

```js
req.query.name
```

returns:

```text
Rahul
```

---

# 8. Query Parameter Example

```js
app.get("/users", (req, res) => {

    const name = req.query.name;

    res.json({
        searchName: name
    });

});
```

Request:

```text
http://localhost:5000/users?name=Rahul
```

Response:

```json
{
    "searchName": "Rahul"
}
```

---

# 9. Multiple Query Parameters

You can send multiple query parameters.

Example:

```text
/users?name=Rahul&age=22
```

Here we have:

```text
name = Rahul
age  = 22
```

Express:

```js
app.get("/users", (req, res) => {

    const name = req.query.name;
    const age = req.query.age;

    res.json({
        name: name,
        age: age
    });

});
```

Response:

```json
{
    "name": "Rahul",
    "age": "22"
}
```

Notice that query values are typically received as strings.

---

# 10. Query Parameters for Searching

Query parameters are commonly used for search functionality.

Example:

```text
/products?search=laptop
```

Express:

```js
app.get("/products", (req, res) => {

    const search = req.query.search;

    res.json({
        message: `Searching for ${search}`
    });

});
```

Request:

```text
GET /products?search=laptop
```

Response:

```json
{
    "message": "Searching for laptop"
}
```

---

# 11. Query Parameters for Filtering

Suppose we have products.

We might want:

```text
/products?category=electronics
```

Express:

```js
app.get("/products", (req, res) => {

    const category = req.query.category;

    res.json({
        category: category
    });

});
```

Request:

```text
GET /products?category=electronics
```

Response:

```json
{
    "category": "electronics"
}
```

---

# 12. Query Parameters for Sorting

We can use query parameters to specify sorting.

Example:

```text
/products?sort=price
```

Express:

```js
app.get("/products", (req, res) => {

    const sort = req.query.sort;

    res.json({
        sortBy: sort
    });

});
```

Request:

```text
GET /products?sort=price
```

---

# 13. Query Parameters for Pagination

Pagination is another very common use.

Example:

```text
/products?page=2&limit=10
```

This means:

```text
page = 2
limit = 10
```

Express:

```js
app.get("/products", (req, res) => {

    const page = req.query.page;
    const limit = req.query.limit;

    res.json({
        page: page,
        limit: limit
    });

});
```

Response:

```json
{
    "page": "2",
    "limit": "10"
}
```

Later, when working with MongoDB, these values can be used for database pagination.

---

# 14. Route Parameters vs Query Parameters

This is one of the most important differences.

## Route Parameter

Example:

```text
/users/25
```

Route:

```js
app.get("/users/:id", ...)
```

Access:

```js
req.params.id
```

Used for:

> Identifying a specific resource.

---

## Query Parameter

Example:

```text
/users?id=25
```

Route:

```js
app.get("/users", ...)
```

Access:

```js
req.query.id
```

Used for:

> Filtering, searching, sorting, pagination, or optional information.

---

# 15. Comparison Table

| Feature           | Route Parameter            | Query Parameter         |
| ----------------- | -------------------------- | ----------------------- |
| Example           | `/users/25`                | `/users?id=25`          |
| Location          | URL path                   | After `?`               |
| Express access    | `req.params`               | `req.query`             |
| Usually required? | Usually yes for that route | Usually optional        |
| Main purpose      | Identify a resource        | Filter/modify a request |
| Example use       | Get user 25                | Search users            |
| Syntax            | `:id`                      | `?key=value`            |

---

# 16. Easy Way to Remember

Remember:

```text
Route Parameter
     ↓
"WHICH ONE?"
```

Example:

```text
/users/25
```

> Which user?

Answer:

```text
25
```

---

Query Parameter:

```text
     ↓
"HOW?"
```

Example:

```text
/users?sort=name
```

> How should I get the users?

Answer:

```text
Sort by name
```

Another example:

```text
/products?category=mobile
```

> Which category should I filter?

Answer:

```text
mobile
```

---

# 17. Real-World Example

Suppose we are building an e-commerce API.

We want to get a specific product:

```text
GET /products/100
```

Here:

```text
100
```

is a route parameter.

```js
app.get("/products/:id", (req, res) => {

    const productId = req.params.id;

});
```

Now suppose we want to search products:

```text
GET /products?search=phone
```

Here:

```text
phone
```

is a query parameter.

```js
app.get("/products", (req, res) => {

    const search = req.query.search;

});
```

---

# 18. Using Both Together

You can use route parameters and query parameters in the same request.

Example:

```text
/products/100?reviews=true
```

Here:

```text
100
```

is a route parameter.

```text
reviews=true
```

is a query parameter.

Route:

```js
app.get("/products/:id", (req, res) => {

    const productId = req.params.id;
    const reviews = req.query.reviews;

    res.json({
        productId: productId,
        reviews: reviews
    });

});
```

Request:

```text
GET /products/100?reviews=true
```

Response:

```json
{
    "productId": "100",
    "reviews": "true"
}
```

---

# 19. Important: Query Parameters Are Optional

Consider:

```js
app.get("/products", (req, res) => {

    const category = req.query.category;

    res.json({
        category: category
    });

});
```

The client can send:

```text
/products
```

or:

```text
/products?category=electronics
```

Both requests match:

```js
app.get("/products", ...)
```

If the query parameter isn't provided:

```js
req.query.category
```

will be `undefined`.

You can handle this:

```js
app.get("/products", (req, res) => {

    const category = req.query.category || "all";

    res.json({
        category: category
    });

});
```

Now:

```text
/products
```

returns:

```json
{
    "category": "all"
}
```

---

# 20. Important: Route Parameters Usually Define the Route

Consider:

```js
app.get("/users/:id", ...)
```

This route expects an ID.

Therefore:

```text
/users/10
```

matches.

But:

```text
/users
```

does not match this particular route.

You could define both:

```js
app.get("/users", getAllUsers);

app.get("/users/:id", getSingleUser);
```

Now:

```text
GET /users
```

means:

> Get all users.

And:

```text
GET /users/10
```

means:

> Get user 10.

---

# 21. Practical Example

Let's create a small API.

```js
const express = require("express");

const app = express();

// Route parameter
app.get("/students/:id", (req, res) => {

    const studentId = req.params.id;

    res.json({
        message: "Student found",
        studentId: studentId
    });

});

// Query parameter
app.get("/students", (req, res) => {

    const course = req.query.course;

    res.json({
        message: "Students fetched",
        course: course || "all"
    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
```

### Request 1

```text
GET /students/10
```

Response:

```json
{
    "message": "Student found",
    "studentId": "10"
}
```

### Request 2

```text
GET /students?course=backend
```

Response:

```json
{
    "message": "Students fetched",
    "course": "backend"
}
```

---

# 22. Complete Request Flow

### Route Parameter

```text
Client
   ↓
GET /students/10
   ↓
Express
   ↓
Match /students/:id
   ↓
req.params.id
   ↓
10
   ↓
Backend Logic
   ↓
Response
```

### Query Parameter

```text
Client
   ↓
GET /students?course=backend
   ↓
Express
   ↓
Match /students
   ↓
req.query.course
   ↓
backend
   ↓
Backend Logic
   ↓
Response
```

---

# 23. Common Mistakes

## Mistake 1: Using `req.query` for Route Parameters

Wrong:

```js
app.get("/users/:id", (req, res) => {

    console.log(req.query.id);

});
```

Correct:

```js
app.get("/users/:id", (req, res) => {

    console.log(req.params.id);

});
```

---

## Mistake 2: Using `req.params` for Query Parameters

Wrong:

```js
app.get("/users", (req, res) => {

    console.log(req.params.name);

});
```

For:

```text
/users?name=Rahul
```

Correct:

```js
app.get("/users", (req, res) => {

    console.log(req.query.name);

});
```

---

## Mistake 3: Forgetting the `:`

Wrong:

```js
app.get("/users/id", ...)
```

Correct:

```js
app.get("/users/:id", ...)
```

The `:` tells Express that `id` is a dynamic route parameter.

---

# 24. Quick Reference

### Route Parameter

URL:

```text
/users/25
```

Route:

```js
app.get("/users/:id", ...)
```

Access:

```js
req.params.id
```

---

### Query Parameter

URL:

```text
/users?name=Rahul
```

Route:

```js
app.get("/users", ...)
```

Access:

```js
req.query.name
```

---

### Both

URL:

```text
/users/25?posts=true
```

Route:

```js
app.get("/users/:id", ...)
```

Access:

```js
req.params.id
req.query.posts
```

---

# Key Takeaways

* **Route parameters** are dynamic values inside the URL path.
* Route parameters are accessed using:

```js
req.params
```

* **Query parameters** are values added after `?`.
* Query parameters are accessed using:

```js
req.query
```

* Route parameters are commonly used to **identify specific resources**.
* Query parameters are commonly used for:

  * Searching
  * Filtering
  * Sorting
  * Pagination
  * Optional settings
* Multiple query parameters are separated using `&`.

## Remember This

```text
ROUTE PARAMETER

/users/:id
       ↓
/users/25
       ↓
req.params.id
       ↓
25
```

```text
QUERY PARAMETER

/users?name=Rahul
       ↓
req.query.name
       ↓
Rahul
```

```text
BOTH

/users/25?posts=true
    ↓         ↓
 params     query
    ↓         ↓
   25       true
```

> **Route Parameter = Which resource?**

> **Query Parameter = How should I retrieve/filter that resource?**
