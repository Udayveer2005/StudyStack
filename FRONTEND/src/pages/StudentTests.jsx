import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import {
  getCourses,
  getEnrollments,
  getMyTestSubmissions,
  getTests,
  submitTestAttempt
} from '../api/api';
import './TeacherDashboard.css';

function StudentTests({ navigateTo }) {
  const userId = Number(localStorage.getItem('userId'));
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('role') === 'teacher') {
      navigateTo('teacher-dashboard');
    }
  }, [navigateTo]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [courses, enrollments, allTests, mySubs] = await Promise.all([
        getCourses(),
        getEnrollments(userId),
        getTests(),
        getMyTestSubmissions()
      ]);
      const enrolledIds = new Set((enrollments || []).map((e) => Number(e.courseId)));
      const courseMap = new Map((courses || []).map((c) => [Number(c.id), c.title]));
      const filtered = (allTests || [])
        .filter((t) => enrolledIds.has(Number(t.courseId)))
        .map((t) => ({ ...t, courseTitle: courseMap.get(Number(t.courseId)) || `Course ${t.courseId}` }));
      setTests(filtered);
      setSubmissions(Array.isArray(mySubs) ? mySubs : []);
    } catch (err) {
      setError(err.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const submissionMap = useMemo(() => {
    const map = new Map();
    submissions.forEach((s) => map.set(String(s.testId), s));
    return map;
  }, [submissions]);

  const openTest = (test) => {
    setSelectedTest(test);
    setAnswers(new Array(test.questions.length).fill(-1));
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;
    if (answers.some((a) => a < 0)) {
      setError('Please answer all questions before submit.');
      return;
    }
    setError('');
    try {
      await submitTestAttempt(selectedTest._id, answers);
      setSelectedTest(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit test');
    }
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="teacher-dashboard-page">
        <h1 className="teacher-title">Course Tests</h1>
        <p className="teacher-subtitle">Attempt tests for your enrolled courses and track your grades.</p>
        {error && <div className="teacher-error">{error}</div>}
        {loading ? <p>Loading tests...</p> : null}

        {!selectedTest && (
          <section className="teacher-panel">
            <h2>Available Tests</h2>
            <div className="teacher-courses-grid">
              {tests.map((test) => {
                const sub = submissionMap.get(String(test._id));
                return (
                  <div key={test._id} className="teacher-course-card">
                    <h3>{test.title}</h3>
                    <p>{test.courseTitle}</p>
                    <p>Questions: {Array.isArray(test.questions) ? test.questions.length : 0}</p>
                    {sub ? (
                      <>
                        <p>
                          Score: {sub.score}/{sub.totalQuestions} ({sub.autoPercent}%)
                        </p>
                        <p>Teacher Grade: {sub.teacherGrade || 'Pending'}</p>
                      </>
                    ) : (
                      <p>Not attempted yet</p>
                    )}
                    <div className="teacher-actions">
                      <button type="button" onClick={() => openTest(test)}>
                        {sub ? 'Re-attempt Test' : 'Start Test'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {selectedTest && (
          <section className="teacher-panel">
            <h2>{selectedTest.title}</h2>
            <p>Course ID: {selectedTest.courseId}</p>
            {selectedTest.questions.map((q, qIdx) => (
              <div key={`${selectedTest._id}-${qIdx}`} className="teacher-course-card">
                <h3>
                  Q{qIdx + 1}. {q.question}
                </h3>
                <div className="teacher-actions">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={`${selectedTest._id}-${qIdx}-${optIdx}`}
                      type="button"
                      onClick={() => handleAnswer(qIdx, optIdx)}
                      className={answers[qIdx] === optIdx ? 'danger-btn' : ''}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="teacher-actions">
              <button type="button" onClick={() => setSelectedTest(null)}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit}>
                Submit Test
              </button>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export default StudentTests;
