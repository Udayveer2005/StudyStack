import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import {
  createTest,
  getAllTestSubmissions,
  getCourses,
  getTests,
  gradeTestSubmission
} from '../api/api';
import './TeacherDashboard.css';

const EMPTY_QUESTION = {
  question: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0
};

function TeacherTests({ navigateTo }) {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [testForm, setTestForm] = useState({
    title: '',
    courseId: '',
    questions: [{ ...EMPTY_QUESTION }]
  });
  const [gradingDrafts, setGradingDrafts] = useState({});
  const isTeacher = localStorage.getItem('role') === 'teacher';

  const loadAll = async () => {
    setError('');
    const [courseResult, testResult, submissionResult] = await Promise.allSettled([
      getCourses(),
      getTests(),
      getAllTestSubmissions()
    ]);

    if (courseResult.status === 'fulfilled') {
      setCourses(Array.isArray(courseResult.value) ? courseResult.value : []);
    } else {
      setCourses([]);
      setError('Failed to load courses. Please refresh page.');
    }

    if (testResult.status === 'fulfilled') {
      setTests(Array.isArray(testResult.value) ? testResult.value : []);
    } else {
      setTests([]);
      if (!error) {
        setError('Failed to load published tests.');
      }
    }

    if (submissionResult.status === 'fulfilled') {
      setSubmissions(Array.isArray(submissionResult.value) ? submissionResult.value : []);
    } else {
      setSubmissions([]);
      const rawMessage =
        submissionResult.reason?.message || 'Unable to load submissions right now.';
      const friendlyMessage =
        rawMessage.toLowerCase().includes('access token expired')
          ? 'Session expired. Please logout and login once, then continue.'
          : rawMessage;
      setError(friendlyMessage);
    }
  };

  useEffect(() => {
    if (!isTeacher) {
      navigateTo('home');
      return;
    }
    loadAll();
  }, [isTeacher, navigateTo]);

  const sortedCourses = useMemo(
    () => [...courses].sort((a, b) => String(a.title).localeCompare(String(b.title))),
    [courses]
  );

  const handleTestChange = (e) => {
    const { name, value } = e.target;
    setTestForm((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setTestForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...EMPTY_QUESTION }]
    }));
  };

  const removeQuestion = (index) => {
    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, key, value) => {
    setTestForm((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [key]: value };
      return { ...prev, questions };
    });
  };

  const updateQuestionOption = (qIndex, optIndex, value) => {
    setTestForm((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[optIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, questions };
    });
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createTest({
        title: testForm.title.trim(),
        courseId: Number(testForm.courseId),
        questions: testForm.questions.map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctOptionIndex: Number(q.correctOptionIndex)
        }))
      });
      setTestForm({
        title: '',
        courseId: '',
        questions: [{ ...EMPTY_QUESTION }]
      });
      await loadAll();
    } catch (err) {
      const rawMessage = err.message || 'Failed to publish test';
      setError(
        rawMessage.toLowerCase().includes('access token expired')
          ? 'Session expired while publishing. Please logout/login and try again.'
          : rawMessage
      );
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const draft = gradingDrafts[submissionId] || {};
    if (!draft.teacherGrade) {
      setError('Please select a grade.');
      return;
    }
    try {
      await gradeTestSubmission(submissionId, {
        teacherGrade: draft.teacherGrade,
        teacherFeedback: draft.teacherFeedback || ''
      });
      await loadAll();
    } catch (err) {
      const rawMessage = err.message || 'Failed to grade submission';
      setError(
        rawMessage.toLowerCase().includes('access token expired')
          ? 'Session expired while grading. Please logout/login and retry.'
          : rawMessage
      );
    }
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="teacher-dashboard-page">
        <h1 className="teacher-title">Teacher Tests Section</h1>
        <p className="teacher-subtitle">
          Publish tests here. Students will see them in their dashboard automatically.
        </p>
        {error && <div className="teacher-error">{error}</div>}

        <section className="teacher-panel">
          <h2>Create and Publish Test</h2>
          <form onSubmit={handleCreateTest} className="teacher-form">
            <input
              name="title"
              value={testForm.title}
              onChange={handleTestChange}
              placeholder="Test title"
              required
            />
            <select
              name="courseId"
              value={testForm.courseId}
              onChange={handleTestChange}
              required
            >
              <option value="">Select course</option>
              {sortedCourses.map((course) => (
                <option key={`teacher-test-course-${course.id}`} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            {testForm.questions.map((question, qIndex) => (
              <div key={`teacher-test-question-${qIndex}`} className="teacher-course-card">
                <input
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder={`Question ${qIndex + 1}`}
                  required
                />
                {question.options.map((option, optIndex) => (
                  <input
                    key={`teacher-test-question-${qIndex}-option-${optIndex}`}
                    value={option}
                    onChange={(e) => updateQuestionOption(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    required
                  />
                ))}
                <select
                  value={question.correctOptionIndex}
                  onChange={(e) => updateQuestion(qIndex, 'correctOptionIndex', Number(e.target.value))}
                >
                  <option value={0}>Correct: Option 1</option>
                  <option value={1}>Correct: Option 2</option>
                  <option value={2}>Correct: Option 3</option>
                  <option value={3}>Correct: Option 4</option>
                </select>
                {testForm.questions.length > 1 && (
                  <div className="teacher-actions">
                    <button type="button" className="danger-btn" onClick={() => removeQuestion(qIndex)}>
                      Remove Question
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="teacher-actions">
              <button type="button" onClick={addQuestion}>
                + Add Question
              </button>
              <button type="submit">Publish Test</button>
            </div>
          </form>
        </section>

        <section className="teacher-panel">
          <h2>Published Tests</h2>
          <div className="teacher-courses-grid">
            {tests.map((test) => (
              <div key={test._id} className="teacher-course-card">
                <h3>{test.title}</h3>
                <p>Course ID: {test.courseId}</p>
                <p>Questions: {Array.isArray(test.questions) ? test.questions.length : 0}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="teacher-panel">
          <h2>Grade Student Submissions</h2>
          <div className="teacher-courses-grid">
            {submissions.map((submission) => (
              <div key={submission._id} className="teacher-course-card">
                <h3>{submission.testId?.title || 'Test'}</h3>
                <p>Student ID: {submission.userId}</p>
                <p>
                  Score: {submission.score}/{submission.totalQuestions} ({submission.autoPercent}%)
                </p>
                <p>Course Progress: {submission.progressPercent}%</p>
                <select
                  value={gradingDrafts[submission._id]?.teacherGrade || submission.teacherGrade || ''}
                  onChange={(e) =>
                    setGradingDrafts((prev) => ({
                      ...prev,
                      [submission._id]: {
                        ...prev[submission._id],
                        teacherGrade: e.target.value
                      }
                    }))
                  }
                >
                  <option value="">Select grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="Fail">Fail</option>
                </select>
                <input
                  value={gradingDrafts[submission._id]?.teacherFeedback || submission.teacherFeedback || ''}
                  onChange={(e) =>
                    setGradingDrafts((prev) => ({
                      ...prev,
                      [submission._id]: {
                        ...prev[submission._id],
                        teacherFeedback: e.target.value
                      }
                    }))
                  }
                  placeholder="Teacher feedback"
                />
                <div className="teacher-actions">
                  <button type="button" onClick={() => handleGradeSubmission(submission._id)}>
                    Save Grade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default TeacherTests;
