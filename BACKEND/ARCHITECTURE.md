# FilingBy Backend Architecture & Guidelines

Welcome to the **FilingBy.com** Backend developer guide. This document details our server-side API design, Express middleware architecture, database patterns, security controls, and scalability roadmaps.

---

## 1. Directory Structure & Domain Modules

Our server is built on **Express.js** and **Mongoose (MongoDB)** using a clean, modular structure. The business domains are separated into self-contained modules under the `src/` directory.

```
BACKEND/
├── server.js                    # Core entry point (initializes middleware, DB, and routes)
├── package.json                 # Dependency tree & NPM scripts
├── .env                         # Server environment configuration variables
│
└── src/
    ├── config/
    │   └── db.config.js         # Mongoose connection logic with DNS resolving safety
    │
    ├── middleware/                  # Request filters and security interceptors
    │   ├── auth.middleware.js   # Clerk JWT token decoders and role verifications
    │   └── admin.middleware.js  # Dedicated administrator authorization barriers
    │
    ├── models/                  # Mongoose schemas
    │   ├── User.model.js        # User metadata matching Clerk accounts
    │   ├── Service.model.js     # CA and virtual office filing item details
    │   └── Order.model.js       # Transaction records & order statuses
    │
    ├── modules/                 # Module controllers and routers
    │   ├── user/
    │   │   ├── user.routes.js        # Core user route mapping
    │   │   ├── user.controller.js    # Order filing & user management controllers
    │   │   └── checkUser.controller.js # Sync user profile hooks
    │   │
    │   └── admin/
    │       ├── admin.routes.js       # Secured admin endpoints
    │       └── admin.controller.js   # Control room operations (order processing, service pricing)
    │
    └── services/
        └── (Optional helper files for external utilities e.g. Razorpay, mail dispatchers)
```

---

## 2. Server Request Lifecycle

```
[Client Request]
       │
       ▼
 [Express CORS / Parser Middleware]
       │
       ▼
 [Clerk Authentication Middleware]  ──► (Verifies Clerk Session JWT)
       │
       ▼
 [AuthGuard / AdminGuard Middleware] ──► (Checks role-permissions / checks local User ID matching)
       │
       ▼
   [Router] ────────────────────────► (Matches endpoint paths)
       │
       ▼
 [Controller] ──────────────────────► (Executes business logic, reads Mongoose DB)
       │
       ▼
 [JSON Response / Error Boundary]
```

---

## 3. Strict Coding Rules (The Senior Checklist)

To ensure the backend remains secure, fast, and easily maintainable, follow these rules:

### A. Routing & HTTP Status Codes

- **Restful Routing**: Endpoints should use standard HTTP verbs (`GET` to fetch, `POST` to create, `PUT` to update, `DELETE` to remove).
- **Correct Status Codes**:
  - `200 OK` for successful fetches or updates.
  - `201 Created` for new records (e.g. creating orders).
  - `400 Bad Request` for invalid input parameters or schemas.
  - `401 Unauthorized` for failed authentication or missing tokens.
  - `403 Forbidden` for authenticated users trying to access unauthorized domains (e.g., non-admins visiting admin panel).
  - `404 Not Found` for missing database records.
  - `500 Internal Server Error` for unhandled runtime failures.

### B. Controller & Error Handling Rules

- **No Uncaught Exceptions**: Every controller block *must* use `try-catch` structures. Never let an async method reject without handling it.
- **Payload Validation**: Always inspect incoming body variables (`req.body`) before querying database layers. Reject bad input payloads early with a `400` status.
- **Fail Gracefully**: Return a clean JSON envelope on failure:

  ```json
  { "success": false, "message": "Descriptive error message" }
  ```

### C. Database Practices

- **Lean Queries**: Use `.lean()` in read-only Mongoose queries to return plain JavaScript objects, improving execution speeds.
- **Define Indexes**: Ensure fields used regularly in filters (`clerkId`, `status`, `userId`) have indexes defined in their Mongoose Schema.
- **Environment Safety**: Never commit credentials. DB Connection URIs must be read exclusively from `process.env.MONGODB_URI`.

---

## 4. Scalability Roadmap

### A. Connection Pooling

Configure MongoDB client options inside [db.config.js](file:///d:/WEBSITE%20DEVELOPMENT/filingbycom/BACKEND/src/config/db.config.js) to scale connections as server load rises:

```javascript
mongoose.connect(URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
});
```

### B. Redis Caching

For high-traffic operations (such as listing services or fetching city rates), integrate a **Redis** caching middleware. Cache pricing tables and invalidate the keys only when pricing changes are updated from the admin console.

### C. Cluster Mode (PM2)

In production, run the server in PM2 cluster mode to balance workload across multiple CPU threads:

```bash
pm2 start server.js -i max
```

Ensure controllers are **stateless** (e.g., store sessions inside DB or JWT cookies instead of in-memory maps) so they function perfectly across separate server instances.
