# StudyStack - React Learning Project

A beginner-friendly React application with 5 pages, JSON Server integration, and CRUD operations. This project demonstrates React Router, authentication, and RESTful API interactions using fetch().

## 📋 Project Overview

StudyStack is an educational platform that helps students organize their learning journey. It includes user authentication, a dashboard for managing learning items, and educational content about Java Frameworks.

## 🎯 Features

- **5 Pages**: Home, Sign Up, Login, Dashboard, and Course
- **User Authentication**: Sign up and login with localStorage-based session management
- **CRUD Operations**: Create, Read, Update, and Delete items in the Dashboard
- **Protected Routes**: Dashboard is only accessible after login
- **JSON Server Integration**: RESTful API using fetch() (no axios)
- **Responsive Design**: Works on desktop and mobile devices
- **Component Architecture**: Parent-child component structure with proper imports/exports

## 📁 Project Structure

```
studystack/
├── data/
│   └── users.json              # JSON Server database file
├── public/
│   ├── images/                 # Image assets
│   │   ├── certification.jpg
│   │   ├── designing.jpg
│   │   ├── development.jpg
│   │   ├── innovation.jpg
│   │   ├── internship.jpg
│   │   ├── javascript.jpg
│   │   ├── lecture.jpg
│   │   ├── microsoft.jpg
│   │   ├── mobile.jpg
│   │   ├── network.jpg
│   │   ├── person-1.jpg
│   │   ├── person-2.jpg
│   │   ├── person-3.jpg
│   │   ├── person-4.jpg
│   │   ├── person-5.jpg
│   │   ├── person-6.jpg
│   │   ├── skill.jpg
│   │   ├── specialize.jpg
│   │   └── vibrant.jpg
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/             # Reusable components
│   │   ├── AuthForm/
│   │   │   ├── AuthForm.jsx   # Reusable authentication form component
│   │   │   └── AuthForm.css   # AuthForm styles
│   │   ├── ItemCard/
│   │   │   ├── ItemCard.jsx   # Item display card component
│   │   │   └── ItemCard.css   # ItemCard styles
│   │   ├── ItemForm/
│   │   │   ├── ItemForm.jsx   # Item add/edit form component
│   │   │   └── ItemForm.css   # ItemForm styles
│   │   ├── Layout/
│   │   │   ├── Layout.jsx     # Page layout wrapper component
│   │   │   └── Layout.css     # Layout styles
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx     # Navigation bar component
│   │   │   └── Navbar.css     # Navbar styles
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.jsx  # Route protection component
│   ├── pages/                  # Page components
│   │   ├── Home.jsx           # Home/Landing page
│   │   ├── Home.css           # Home page styles
│   │   ├── SignUp.jsx         # Sign up page
│   │   ├── Login.jsx          # Login page
│   │   ├── Dashboard.jsx      # Dashboard page (protected)
│   │   ├── Dashboard.css      # Dashboard styles
│   │   ├── Course.jsx         # Course page (Java Frameworks)
│   │   └── Course.css         # Course page styles
│   ├── App.js                 # Main app component with routing
│   ├── App.css                # Global app styles
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd studystack
npm install
```

This will install:
- React and React DOM
- React Router DOM (for navigation)
- JSON Server (for mock API)

### Step 2: Start JSON Server

Open a **new terminal window** and run JSON Server:

```bash
npm run server
```

Or manually:
```bash
npx json-server --watch data/users.json --port 3001
```

The server will start on `http://localhost:3001`

**Important**: Keep this terminal window open while developing!

**Note**: If port 3000 is already in use, the React app will automatically use port 3000, so we use port 3001 for JSON Server.

### Step 3: Start React Development Server

Open **another terminal window** and start the React app:

```bash
npm start
```

The app will open in your browser at `http://localhost:3000` (or the next available port)

## 📊 Database Structure (data/users.json)

The JSON Server uses `data/users.json` as the database. It contains:

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@studystack.com",
      "password": "admin123"
    }
  ],
  "items": [
    {
      "id": 1,
      "title": "Learn React Hooks",
      "description": "Master useState, useEffect, and other React hooks",
      "status": "pending",
      "userId": 1
    }
  ]
}
```

## 🔐 Default Login Credentials

You can use the default account to test the application:

- **Username**: `admin`
- **Password**: `admin123`

Or create a new account using the Sign Up page.

## 🎨 Pages Overview

### 1. Home Page (`/`)
- Enhanced landing page with hero section
- Statistics section showing platform metrics
- Feature cards with images explaining the platform
- Testimonials carousel with auto-rotation
- Call-to-action section

### 2. Sign Up Page (`/signup`)
- User registration form
- Validates username, email, and password
- Checks for duplicate usernames/emails
- Automatically logs in after successful signup

### 3. Login Page (`/login`)
- User authentication form
- Validates credentials against JSON Server
- Stores login status in localStorage
- Redirects to Dashboard on success

### 4. Dashboard Page (`/dashboard`)
- **Protected Route**: Requires login
- Displays user's learning items
- CRUD operations:
  - **Create**: Add new items
  - **Read**: View all items
  - **Update**: Edit existing items
  - **Delete**: Remove items
- Filter items by status (pending, in-progress, completed)

### 5. Course Page (`/course`)
- Enhanced educational page about Java Frameworks
- Interactive tabbed interface (Overview, Frameworks, Features, Comparison)
- Includes:
  - Hero banner with course metadata
  - Learning path visualization
  - Framework cards with images and tags
  - Enhanced features grid with icons
  - Comparison table with badges
  - Code examples section
- Navigation links to other pages

## 🔧 API Endpoints

The application uses the following JSON Server endpoints:

### Users
- `GET http://localhost:3001/users` - Get all users
- `POST http://localhost:3001/users` - Create new user

### Items
- `GET http://localhost:3001/items` - Get all items
- `POST http://localhost:3001/items` - Create new item
- `PUT http://localhost:3001/items/:id` - Update item
- `DELETE http://localhost:3001/items/:id` - Delete item

## 🧩 Component Architecture

The project follows a parent-child component structure:

### Parent Components (Pages)
- `Home.jsx` → Uses `Layout` component
- `SignUp.jsx` → Uses `Layout` and `AuthForm` components
- `Login.jsx` → Uses `Layout` and `AuthForm` components
- `Dashboard.jsx` → Uses `Layout`, `ItemCard`, `ItemForm`, and `ProtectedRoute`
- `Course.jsx` → Uses `Layout` component

### Child Components
- `Layout` → Wraps pages with Navbar
- `Navbar` → Navigation bar with auth-aware links
- `AuthForm` → Reusable form for login/signup
- `ItemCard` → Displays individual items
- `ItemForm` → Form for adding/editing items
- `ProtectedRoute` → Protects routes requiring authentication

## 🎯 Key Concepts Demonstrated

1. **React Hooks**: useState, useEffect
2. **React Router**: BrowserRouter, Routes, Route, Navigate, Link, useNavigate
3. **RESTful API**: GET, POST, PUT, DELETE using fetch()
4. **Authentication**: localStorage-based session management
5. **Protected Routes**: Route protection based on authentication
6. **Component Composition**: Parent-child component relationships
7. **Form Handling**: Controlled components and form validation
8. **Error Handling**: Try-catch blocks and error messages

## 🐛 Troubleshooting

### JSON Server not starting
- Make sure `data/users.json` exists
- Check if port 3001 is available
- Try running: `npx json-server --watch data/users.json --port 3001`

### API calls failing
- Ensure JSON Server is running on port 3001
- Check browser console for CORS errors
- Verify the API endpoint URLs in the code

### Login not working
- Check if JSON Server is running
- Verify user exists in `data/users.json`
- Check browser console for errors
- Clear localStorage and try again

### Dashboard not accessible
- Make sure you're logged in (check localStorage)
- Try logging out and logging back in
- Check browser console for errors

## 📝 Development Notes

- All API calls use `fetch()` (no axios)
- Authentication uses localStorage flags
- Components are well-commented for learning
- CSS is simple and responsive (no Tailwind)
- Error messages are user-friendly
- All React components use `.jsx` extension
- Images are stored in `public/images/` folder
- Parent-child component architecture with proper imports/exports

## 🚀 Build for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 👨‍💻 Author

StudyStack - A beginner-friendly React project for learning web development.

## 📄 License

This project is for educational purposes.

---

**Happy Learning! 🎓**
