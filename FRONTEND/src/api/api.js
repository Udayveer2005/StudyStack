/**
 * Centralized API Helper (Frontend)
 * =================================
 * This file is the single place where we define how the React app talks to the backend.
 * Instead of calling fetch() with full URLs in every component, we use these helper functions.
 * Benefits: one place to change the base URL, consistent error handling, and clearer component code.
 *
 * All helpers return Promises (use async/await or .then() in components).
 * Failed responses (e.g. 400, 404, 500) are converted to thrown Errors with the server's message.
 */

// Base URL of our Node/Express backend. The frontend runs on port 3000, backend on 5001.
// Changing this constant updates all API calls at once (e.g. for production you might use a different URL).
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) return false;
  const data = await response.json();
  if (data?.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    return true;
  }
  return false;
}

async function fetchWithAuthRetry(url, options = {}) {
  const baseOptions = {
    credentials: 'include',
    ...options
  };
  let response = await fetch(url, baseOptions);

  if (response.status !== 401) return response;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return response;

  const retryHeaders = {
    ...(baseOptions.headers || {}),
    ...getAuthHeaders()
  };
  response = await fetch(url, {
    ...baseOptions,
    headers: retryHeaders
  });
  return response;
}

function normalizeCourse(course) {
  if (!course || typeof course !== 'object') return course;
  return {
    ...course,
    id: course.id ?? course.legacyId ?? course._id,
  };
}

/**
 * handleJsonResponse(response)
 * ----------------------------
 * Shared response handler for fetch(). If the response is not OK (status outside 200-299),
 * we try to read the JSON body (our backend sends { message: "..." }) and throw an Error
 * with that message so the component can show it. If the response is OK, we parse and return the JSON.
 * This way every API helper gets consistent error handling without repeating the same logic.
 */
async function handleJsonResponse(response) {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      if (data && data.message) {
        message = data.message;
      }
    } catch (err) {
      // ignore JSON parse errors and use default message
    }
    throw new Error(message);
  }
  return response.json();
}

// ===== Courses =====

/** getCourses() - GET /courses. Returns a Promise that resolves to the array of courses. Used by the Course page to display the list. */
export function getCourses() {
  return fetch(`${API_BASE}/courses`)
    .then(handleJsonResponse)
    .then((data) => (Array.isArray(data) ? data.map(normalizeCourse) : []));
}

/** getCourseById(id) - GET /courses/:id. Returns a single course object (including lectures if present). */
export function getCourseById(id) {
  return fetch(`${API_BASE}/courses/${id}`)
    .then(handleJsonResponse)
    .then(normalizeCourse);
}

export function createCourse(data) {
  return fetchWithAuthRetry(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
    credentials: 'include'
  })
    .then(handleJsonResponse)
    .then(normalizeCourse);
}

export function updateCourseById(id, data) {
  return fetchWithAuthRetry(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
    credentials: 'include'
  })
    .then(handleJsonResponse)
    .then(normalizeCourse);
}

export function deleteCourseById(id) {
  return fetchWithAuthRetry(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
    credentials: 'include'
  }).then(async (response) => {
    if (!response.ok) {
      let message = 'Failed to delete course';
      try {
        const data = await response.json();
        if (data && data.message) message = data.message;
      } catch (_) {
        // ignore parse errors
      }
      throw new Error(message);
    }
    return true;
  });
}

// ===== Tests / Assessments =====

export function getTests(courseId) {
  const url = courseId
    ? `${API_BASE}/tests?courseId=${encodeURIComponent(courseId)}`
    : `${API_BASE}/tests`;
  return fetch(url).then(handleJsonResponse);
}

export function createTest(data) {
  return fetchWithAuthRetry(`${API_BASE}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(handleJsonResponse);
}

export function submitTestAttempt(testId, answers) {
  return fetchWithAuthRetry(`${API_BASE}/tests/${testId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ answers }),
    credentials: 'include'
  }).then(handleJsonResponse);
}

export function getMyTestSubmissions() {
  return fetchWithAuthRetry(`${API_BASE}/tests/submissions/me`, {
    headers: { ...getAuthHeaders() },
    credentials: 'include'
  }).then(handleJsonResponse);
}

export function getAllTestSubmissions(courseId) {
  const url = courseId
    ? `${API_BASE}/tests/submissions?courseId=${encodeURIComponent(courseId)}`
    : `${API_BASE}/tests/submissions`;
  return fetchWithAuthRetry(url, {
    headers: { ...getAuthHeaders() },
    credentials: 'include'
  }).then(handleJsonResponse);
}

export function gradeTestSubmission(submissionId, payload) {
  return fetchWithAuthRetry(`${API_BASE}/tests/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
    credentials: 'include'
  }).then(handleJsonResponse);
}

// ===== Testimonials =====

/** getTestimonials() - GET /testimonials. Returns the array of testimonials for the Home page. */
export function getTestimonials() {
  return fetch(`${API_BASE}/testimonials`).then(handleJsonResponse);
}

// ===== Users / Auth =====

/** loginUser(credentials) - POST /login. credentials = { username, password }. Returns user object { id, username, email } on success; throws on invalid login. */
export function loginUser(credentials) {
  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include'
  }).then(handleJsonResponse);
}

/** registerUser(data) - POST /register. data = { username, email, password }. Creates a new user; throws if username/email already exists. */
export function registerUser(data) {
  return fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleJsonResponse);
}

/** getUsers() - GET /users. Returns array of all users. Used by SignUp to check if username or email is already taken. */
export function getUsers() {
  return fetch(`${API_BASE}/users`).then(handleJsonResponse);
}

// ===== Enrollments =====

/** enrollUser(data) - POST /enroll. data = { userId, courseId }. Enrolls the user in the course. Called from Checkout for each course in the cart after "payment". */
export function enrollUser(data) {
  return fetch(`${API_BASE}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleJsonResponse);
}

/** getEnrollments(userId?) - GET /enrollments. Optional userId filters to a single user's enrollments. */
export function getEnrollments(userId) {
  const url = userId
    ? `${API_BASE}/enrollments?userId=${encodeURIComponent(userId)}`
    : `${API_BASE}/enrollments`;
  return fetch(url).then(handleJsonResponse);
}

// ===== Course Progress =====

/** getProgress(userId, courseId) - GET /progress?userId=&courseId=. Returns progress for that user+course. */
export function getProgress(userId, courseId) {
  const url = `${API_BASE}/progress?userId=${encodeURIComponent(
    userId
  )}&courseId=${encodeURIComponent(courseId)}`;
  return fetch(url).then(handleJsonResponse);
}

/** getAllProgressForUser(userId) - GET /progress?userId=. Returns array of all progress records for this user. */
export function getAllProgressForUser(userId) {
  const url = `${API_BASE}/progress?userId=${encodeURIComponent(userId)}`;
  return fetch(url).then(handleJsonResponse);
}

/** saveProgress(data) - POST /progress. data = { userId, courseId, completedLectureIds }. Upserts a progress record. */
export function saveProgress(data) {
  return fetch(`${API_BASE}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleJsonResponse);
}

// ===== Dashboard Items =====

/** getItems() - GET /items. Returns all dashboard items; the Dashboard component filters by userId to show only the current user's items. */
export function getItems() {
  return fetch(`${API_BASE}/items`).then(handleJsonResponse);
}

/** createItem(data) - POST /items. data = { title, description?, status?, userId }. Creates a new dashboard item. */
export function createItem(data) {
  return fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleJsonResponse);
}

/** updateItem(id, data) - PUT /items/:id. Updates an existing item with the given id. */
export function updateItem(id, data) {
  return fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleJsonResponse);
}

/** deleteItem(id) - DELETE /items/:id. Removes the item. On success returns a resolved promise; on failure throws with the server's message. */
export function deleteItem(id) {
  return fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    if (!response.ok) {
      let message = 'Failed to delete item';
      try {
        const data = await response.json();
        if (data && data.message) {
          message = data.message;
        }
      } catch (err) {
        // ignore
      }
      throw new Error(message);
    }
    return true;
  });
}
