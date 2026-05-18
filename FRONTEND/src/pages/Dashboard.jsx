/**
 * Dashboard Page
 * ==============
 * Shows the logged-in user's learning items (tasks/to-dos) and allows add, edit, delete.
 * All data comes from the backend: GET /items (list), POST /items (add), PUT /items/:id (edit), DELETE /items/:id (delete).
 * Protected route: only visible after login; userId is read from localStorage to filter items.
 */
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import ItemCard from '../components/ItemCard/ItemCard.jsx';
import ItemForm from '../components/ItemForm/ItemForm.jsx';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getCourses,
  getEnrollments,
  getTests,
  getMyTestSubmissions
} from '../api/api';
import './Dashboard.css';

function Dashboard({ navigateTo }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const userId = parseInt(localStorage.getItem('userId'));
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [enrolledError, setEnrolledError] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [testSubmissions, setTestSubmissions] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsError, setTestsError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const allItems = await getItems();
      const userItems = allItems.filter((item) => item.userId === userId);
      setItems(userItems);
    } catch (err) {
      setError('Failed to load items. Please check if backend server is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const loadEnrolled = async () => {
      if (!userId) return;
      setEnrolledLoading(true);
      setEnrolledError('');
      setTestsLoading(true);
      setTestsError('');
      try {
        const [courses, enrollments, tests, submissions] = await Promise.all([
          getCourses(),
          getEnrollments(userId),
          getTests(),
          getMyTestSubmissions()
        ]);
        const enrolledCourseIds = Array.isArray(enrollments)
          ? enrollments.map((e) => e.courseId)
          : [];
        const userCourses = Array.isArray(courses)
          ? courses.filter((c) => enrolledCourseIds.includes(c.id))
          : [];
        setEnrolledCourses(userCourses);

        const courseTitleById = new Map(
          userCourses.map((course) => [Number(course.id), course.title])
        );
        const linkedTests = Array.isArray(tests)
          ? tests
              .filter((test) => enrolledCourseIds.includes(Number(test.courseId)))
              .map((test) => ({
                ...test,
                courseTitle:
                  courseTitleById.get(Number(test.courseId)) ||
                  `Course ${test.courseId}`
              }))
          : [];
        setAvailableTests(linkedTests);
        setTestSubmissions(Array.isArray(submissions) ? submissions : []);
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
        setEnrolledError('Failed to load enrolled courses.');
        setTestsError('Failed to load tests.');
      } finally {
        setEnrolledLoading(false);
        setTestsLoading(false);
      }
    };
    loadEnrolled();
  }, [userId]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingItem) {
        const updated = await updateItem(editingItem.id, {
          ...formData,
          userId: userId
        });
        setItems(items.map((item) => (item.id === editingItem.id ? updated : item)));
      } else {
        const newItem = await createItem({
          ...formData,
          userId: userId
        });
        setItems([...items, newItem]);
      }

      setFormData({ title: '', description: '', status: 'pending' });
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      setError('Failed to save item. Please try again.');
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      status: item.status
    });
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteItem(itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', status: 'pending' });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleGoToEnrolledCourse = (course) => {
    if (course.id === 5) {
      navigateTo('operating-system');
      return;
    }
    localStorage.setItem('selectedEnrolledCourseId', String(course.id));
    if (course.id === 4) {
      navigateTo('react-course-overview');
      return;
    }
    navigateTo('enrolled-course');
  };

  const getSubmissionForTest = (testId) =>
    testSubmissions.find((submission) => String(submission.testId) === String(testId));

  return (
    <Layout navigateTo={navigateTo}>
      <div className="dashboard-page">
        <section className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Dashboard</h1>
            <button onClick={() => setShowForm(true)} className="btn-add">
              + Add New Item
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-message">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <p>No items yet. Click "Add New Item" to get started!</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-container dashboard-enrolled-section">
          <div className="dashboard-header">
            <h2 className="dashboard-subtitle">My Enrolled Courses</h2>
            <button className="btn-add" onClick={() => navigateTo('student-tests')}>
              Attempt Tests
            </button>
          </div>
          {enrolledLoading && (
            <div className="loading-message">Loading enrolled courses...</div>
          )}
          {enrolledError && (
            <div className="error-message">{enrolledError}</div>
          )}
          {!enrolledLoading && !enrolledError && enrolledCourses.length === 0 && (
            <div className="empty-state">
              <p>You are not enrolled in any courses yet.</p>
              <button className="btn-add" onClick={() => navigateTo('course')}>
                Browse Courses
              </button>
            </div>
          )}
          {!enrolledLoading && enrolledCourses.length > 0 && (
            <div className="enrolled-courses-grid">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="enrolled-course-card">
                  <h3 className="enrolled-course-title">{course.title}</h3>
                  <p className="enrolled-course-meta">
                    {course.level || course.category}
                  </p>
                  <div className="enrolled-course-footer">
                    <span className="enrolled-course-price">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                    <button
                      className="btn-add"
                      onClick={() => handleGoToEnrolledCourse(course)}
                    >
                      Go to Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-container dashboard-tests-section">
          <div className="dashboard-header">
            <h2 className="dashboard-subtitle">Published Tests For My Courses</h2>
            <button className="btn-add" onClick={() => navigateTo('student-tests')}>
              Open Test Center
            </button>
          </div>

          {testsLoading && <div className="loading-message">Loading tests...</div>}
          {testsError && <div className="error-message">{testsError}</div>}

          {!testsLoading && !testsError && availableTests.length === 0 && (
            <div className="empty-state">
              <p>No tests published yet by teachers for your enrolled courses.</p>
            </div>
          )}

          {!testsLoading && availableTests.length > 0 && (
            <div className="dashboard-tests-grid">
              {availableTests.map((test) => {
                const submission = getSubmissionForTest(test._id);
                return (
                  <div key={test._id} className="dashboard-test-card">
                    <h3 className="dashboard-test-title">{test.title}</h3>
                    <p className="dashboard-test-meta">{test.courseTitle}</p>
                    <p className="dashboard-test-meta">
                      Questions: {Array.isArray(test.questions) ? test.questions.length : 0}
                    </p>
                    {submission ? (
                      <>
                        <p className="dashboard-test-meta">
                          Score: {submission.score}/{submission.totalQuestions} ({submission.autoPercent}%)
                        </p>
                        <p className="dashboard-test-meta">
                          Grade: {submission.teacherGrade || 'Pending teacher grading'}
                        </p>
                      </>
                    ) : (
                      <p className="dashboard-test-meta">Status: Not attempted</p>
                    )}
                    <div className="enrolled-course-footer">
                      <button className="btn-add" onClick={() => navigateTo('student-tests')}>
                        {submission ? 'View / Re-attempt' : 'Attempt Test'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <ItemForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitButtonText={editingItem ? 'Update Item' : 'Add Item'}
          isEditing={!!editingItem}
        />
      )}
    </Layout>
  );
}

export default Dashboard;

