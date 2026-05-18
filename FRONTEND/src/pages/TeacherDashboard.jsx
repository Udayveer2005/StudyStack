import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import {
  createCourse,
  deleteCourseById,
  getCourses,
  updateCourseById
} from '../api/api';
import './TeacherDashboard.css';

const EMPTY_LECTURE = { title: '', videoUrl: '', duration: '' };

function TeacherDashboard({ navigateTo }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    price: 0,
    lectures: [{ ...EMPTY_LECTURE }]
  });

  const isTeacher = localStorage.getItem('role') === 'teacher';

  const resetForm = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      category: '',
      level: '',
      price: 0,
      lectures: [{ ...EMPTY_LECTURE }]
    });
  };

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTeacher) {
      navigateTo('home');
      return;
    }
    loadCourses();
  }, [isTeacher, navigateTo]);

  const sortedCourses = useMemo(
    () => [...courses].sort((a, b) => String(a.title).localeCompare(String(b.title))),
    [courses]
  );

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleLectureChange = (index, field, value) => {
    setFormData((prev) => {
      const lectures = [...prev.lectures];
      lectures[index] = { ...lectures[index], [field]: value };
      return { ...prev, lectures };
    });
  };

  const addLectureRow = () => {
    setFormData((prev) => ({
      ...prev,
      lectures: [...prev.lectures, { ...EMPTY_LECTURE }]
    }));
  };

  const removeLectureRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      lectures: prev.lectures.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (course) => {
    setEditingCourseId(course.id);
    setFormData({
      title: course.title || '',
      category: course.category || '',
      level: course.level || '',
      price: Number(course.price || 0),
      lectures:
        Array.isArray(course.lectures) && course.lectures.length
          ? course.lectures.map((lecture) => ({
              title: lecture.title || '',
              videoUrl: lecture.videoUrl || '',
              duration: lecture.duration || ''
            }))
          : [{ ...EMPTY_LECTURE }]
    });
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course permanently?')) return;
    setError('');
    try {
      await deleteCourseById(courseId);
      await loadCourses();
      if (editingCourseId === courseId) resetForm();
    } catch (err) {
      setError(err.message || 'Failed to delete course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const cleanLectures = formData.lectures
        .filter((l) => l.title && l.videoUrl)
        .map((l, index) => ({
          id: index + 1,
          title: l.title.trim(),
          videoUrl: l.videoUrl.trim(),
          duration: l.duration?.trim() || ''
        }));

      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        level: formData.level.trim(),
        price: Number(formData.price),
        lectures: cleanLectures
      };

      if (editingCourseId) {
        await updateCourseById(editingCourseId, payload);
      } else {
        await createCourse(payload);
      }

      resetForm();
      await loadCourses();
    } catch (err) {
      setError(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="teacher-dashboard-page">
        <h1 className="teacher-title">Teacher Dashboard</h1>
        <p className="teacher-subtitle">
          Manage all student-visible courses and lectures from here. Tests are in the dedicated Tests Section.
        </p>

        {error && <div className="teacher-error">{error}</div>}

        <section className="teacher-panel">
          <div className="teacher-actions">
            <button type="button" onClick={() => navigateTo('teacher-tests')}>
              Open Tests Section
            </button>
          </div>
        </section>

        <section className="teacher-panel">
          <h2>{editingCourseId ? 'Edit Course' : 'Create New Course'}</h2>
          <form onSubmit={handleSubmit} className="teacher-form">
            <input
              name="title"
              value={formData.title}
              onChange={handleCourseChange}
              placeholder="Course Title"
              required
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleCourseChange}
              placeholder="Category"
              required
            />
            <input
              name="level"
              value={formData.level}
              onChange={handleCourseChange}
              placeholder="Level (Beginner/Intermediate)"
            />
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleCourseChange}
              placeholder="Price"
              required
            />

            <h3>Lectures</h3>
            {formData.lectures.map((lecture, index) => (
              <div key={`lecture-${index}`} className="lecture-row">
                <input
                  value={lecture.title}
                  onChange={(e) => handleLectureChange(index, 'title', e.target.value)}
                  placeholder="Lecture title"
                />
                <input
                  value={lecture.videoUrl}
                  onChange={(e) => handleLectureChange(index, 'videoUrl', e.target.value)}
                  placeholder="Video URL"
                />
                <input
                  value={lecture.duration}
                  onChange={(e) => handleLectureChange(index, 'duration', e.target.value)}
                  placeholder="Duration (e.g., 12:30)"
                />
                {formData.lectures.length > 1 && (
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => removeLectureRow(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <div className="teacher-actions">
              <button type="button" onClick={addLectureRow}>
                + Add Lecture
              </button>
              {editingCourseId && (
                <button type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingCourseId ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </section>

        <section className="teacher-panel">
          <h2>All Courses</h2>
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="teacher-courses-grid">
              {sortedCourses.map((course) => (
                <div key={course.id} className="teacher-course-card">
                  <h3>{course.title}</h3>
                  <p>{course.category} | {course.level || 'N/A'}</p>
                  <p>{course.price === 0 ? 'Free' : `INR ${course.price}`}</p>
                  <p>Lectures: {Array.isArray(course.lectures) ? course.lectures.length : 0}</p>
                  <div className="teacher-actions">
                    <button type="button" onClick={() => handleEdit(course)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default TeacherDashboard;
