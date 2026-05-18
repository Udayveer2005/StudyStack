# StudyStack Backend

Node.js + Express server for the StudyStack full stack application. Uses **JSON files** as a temporary database (file handling with `fs.readFile` / `fs.writeFile`).

## Folder Structure

```
backend
├── server.js              # Entry point: Express app, CORS, middleware, routes
├── routes                 # Modular routing
│   ├── courses.js         # GET /courses, GET /courses/:id, POST /courses
│   ├── enrollments.js     # (used via controller in server.js)
│   ├── users.js           # GET /users, POST /users, POST /users/login, POST /users/register
│   ├── items.js           # Dashboard items: GET/POST/PUT/DELETE /items
│   └── testimonials.js    # GET /testimonials
├── controllers            # Request handling logic + file I/O
│   ├── courseController.js
│   ├── enrollmentController.js
│   ├── userController.js
│   ├── itemController.js
│   └── testimonialController.js
├── data                   # JSON “database” files
│   ├── courses.json
│   ├── enrollments.json
│   ├── users.json
│   ├── items.json
│   └── testimonials.json
├── middleware
│   └── errorHandler.js    # 404 + global error handler
└── public                 # Static files (optional)
```

## API Endpoints

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | /courses        | All courses              |
| GET    | /courses/:id    | Course by id             |
| POST   | /courses        | Add course               |
| POST   | /enroll         | Enroll user in course    |
| GET    | /enrollments    | List enrollments         |
| GET    | /users          | All users                |
| POST   | /users          | Register (sign up)       |
| POST   | /login          | Login                    |
| POST   | /register       | Register (alternate)     |
| GET    | /items          | All dashboard items      |
| GET    | /items/:id      | Item by id               |
| POST   | /items          | Add item                 |
| PUT    | /items/:id      | Update item              |
| DELETE | /items/:id      | Delete item              |
| GET    | /testimonials   | Testimonials list        |

## Run

- Install: `npm install`
- Start: `npm start` (port 5000) or `npm run dev` (nodemon)
- Optional: copy `.env.example` to `.env` and set `PORT` if needed.

## Syllabus Topics Covered

- Client–server architecture (React client ↔ Node server)
- Node.js setup, modules, NPM
- File handling (fs readFile/writeFile)
- HTTP request handling, Express, routing, route parameters
- Serving static files, response methods, CORS
- Exception handling (centralized error middleware)
