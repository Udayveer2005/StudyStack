# Data Folder – JSON File Structures

This folder holds JSON files that act as our **temporary database**. The backend reads and writes these files using Node's `fs` module (see the controllers). Standard JSON does not support comments, so this file documents the structure of each JSON file for your report and viva.

---

## courses.json

**Purpose:** Stores the list of courses available for purchase (e.g. Java Frameworks, React Development).

**Structure:** Array of objects. Each object has:

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| `id`     | number | Unique course id               |
| `title`  | string | Course name                    |
| `category` | string | e.g. "Web Development", "Frontend" |
| `price`  | number | Price (e.g. 999, 2000)        |
| `level`  | string | Optional; e.g. "Intermediate · 8 Hours · 12 Modules" |

---

## users.json

**Purpose:** Stores registered users. Used for login (match username/password) and signup (check duplicates, add new user).

**Structure:** Array of objects. Each object has:

| Field      | Type   | Description        |
|------------|--------|--------------------|
| `id`       | number | Unique user id     |
| `username` | string | Login username     |
| `email`    | string | User email         |
| `password` | string | Stored in plain text for this demo (in production we would hash it) |

---

## enrollments.json

**Purpose:** Records which user is enrolled in which course (created when the user completes checkout).

**Structure:** Array of objects. Each object has:

| Field       | Type   | Description                    |
|-------------|--------|--------------------------------|
| `id`        | number | Unique enrollment id           |
| `userId`    | number | References a user in users.json |
| `courseId`  | number | References a course in courses.json |
| `enrolledAt` | string | ISO date when enrollment was created |

---

## items.json

**Purpose:** Dashboard learning items (tasks/to-dos) for each user. Each item belongs to a user via `userId`.

**Structure:** Array of objects. Each object has:

| Field        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| `id`         | number | Unique item id                       |
| `title`      | string | Item title                           |
| `description`| string | Optional description                 |
| `status`     | string | e.g. "pending", "completed"          |
| `userId`     | number | Owner of this item (references users.json) |

---

## testimonials.json

**Purpose:** Testimonials shown on the Home page (“What Our Students Say”).

**Structure:** Array of objects. Each object has:

| Field  | Type   | Description              |
|--------|--------|--------------------------|
| `id`   | number | Unique id                |
| `name` | string | Person's name            |
| `role` | string | e.g. "Computer Science Student" |
| `image`| string | Path to image, e.g. "/images/person-1.jpg" |
| `text` | string | The testimonial quote    |
