import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import { getCourseById, getProgress, saveProgress, API_BASE } from '../api/api';
import './Course.css';
import './EnrolledCourse.css';

function buildDefaultLessons(courseTitle) {
  const title = String(courseTitle || '').toLowerCase();
  if (title.includes('spring')) {
    return [
      { id: 1, title: 'Spring Core and IoC Basics', duration: '18 min' },
      { id: 2, title: 'Dependency Injection in Practice', duration: '22 min' },
      { id: 3, title: 'Building REST APIs with Spring Boot', duration: '25 min' },
      { id: 4, title: 'Validation, Error Handling, and Security', duration: '20 min' },
      { id: 5, title: 'Packaging and Deployment Tips', duration: '16 min' }
    ];
  }
  if (title.includes('hibernate') || title.includes('jpa')) {
    return [
      { id: 1, title: 'JPA Entities and Mapping Fundamentals', duration: '17 min' },
      { id: 2, title: 'One-to-One, One-to-Many, Many-to-Many', duration: '24 min' },
      { id: 3, title: 'Repositories, Queries, and Pagination', duration: '21 min' },
      { id: 4, title: 'Transactions and Fetch Strategies', duration: '19 min' },
      { id: 5, title: 'Performance and N+1 Query Fixes', duration: '18 min' }
    ];
  }
  return [
    { id: 1, title: 'Course Introduction', duration: '12 min' },
    { id: 2, title: 'Core Concepts', duration: '20 min' },
    { id: 3, title: 'Hands-on Walkthrough', duration: '24 min' },
    { id: 4, title: 'Common Pitfalls and Best Practices', duration: '18 min' },
    { id: 5, title: 'Project-Ready Implementation', duration: '22 min' }
  ];
}

function buildLessonTheory(courseTitle, lesson) {
  if (!lesson) return [];

  const title = String(lesson.title || '').toLowerCase();
  const course = String(courseTitle || '').toLowerCase();

  if (course.includes('spring')) {
    if (title.includes('ioc') || title.includes('core')) {
      return [
        'Inversion of Control means the framework creates and manages objects instead of your code using direct constructors everywhere.',
        'A Spring container stores bean definitions and resolves dependencies at runtime.',
        'Loose coupling improves testing and makes modules easier to maintain and replace.'
      ];
    }
    if (title.includes('dependency injection')) {
      return [
        'Dependency Injection can be done via constructor, setter, or field injection; constructor injection is preferred for required dependencies.',
        'Injecting interfaces rather than concrete classes keeps your code extensible.',
        'Bean scopes (singleton, prototype, request, session) affect lifecycle and state handling.'
      ];
    }
    if (title.includes('rest')) {
      return [
        'REST endpoints in Spring Boot are typically created with `@RestController`, `@RequestMapping`, and HTTP method annotations.',
        'DTOs separate API contracts from entity persistence models.',
        'Validation and clear response codes improve API reliability for frontend consumers.'
      ];
    }
  }

  if (course.includes('hibernate') || course.includes('jpa')) {
    if (title.includes('mapping') || title.includes('entities')) {
      return [
        'Entities model database tables using annotations like `@Entity`, `@Table`, and `@Column`.',
        'Primary keys are defined with `@Id`, and strategies such as `IDENTITY` or `SEQUENCE` control ID generation.',
        'Good entity design reduces redundancy and improves query readability.'
      ];
    }
    if (title.includes('many') || title.includes('one-to')) {
      return [
        'Relationship mapping defines ownership (`mappedBy`) and cascade behavior between entities.',
        'Lazy and eager loading determine when related data is fetched from the database.',
        'Bidirectional relationships need careful JSON serialization handling to avoid recursive output.'
      ];
    }
    if (title.includes('performance') || title.includes('n+1')) {
      return [
        'The N+1 problem happens when related entities are fetched in many small queries instead of fewer optimized queries.',
        'Fetch joins, entity graphs, and batching are common optimization tools.',
        'Always verify performance fixes with logs and query analysis.'
      ];
    }
  }

  return [
    'Focus on understanding the main concept, then connect it with practical backend use cases.',
    'Notice how this lesson builds on previous topics in the same course path.',
    'After watching, summarize the key idea in 2-3 lines to improve long-term retention.'
  ];
}

function EnrolledCourse({ navigateTo }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ completedLectureIds: [] });
  const [activeLessonId, setActiveLessonId] = useState(null);
  const userId = Number(localStorage.getItem('userId'));

  const lessons = useMemo(() => {
    if (!course) return [];
    if (Array.isArray(course.lectures) && course.lectures.length > 0) {
      return course.lectures.map((lecture) => ({
        id: Number(lecture.id),
        title: lecture.title,
        duration: lecture.duration || 'Self-paced',
        videoUrl: lecture.videoUrl || ''
      }));
    }
    return buildDefaultLessons(course.title);
  }, [course]);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) || null,
    [lessons, activeLessonId]
  );
  const showLectureTheory = useMemo(() => {
    const courseTitle = String(course?.title || '').toLowerCase();
    return !courseTitle.includes('react');
  }, [course]);

  useEffect(() => {
    const loadCourse = async () => {
      const selectedCourseId = localStorage.getItem('selectedEnrolledCourseId');
      if (!selectedCourseId) {
        setError('No enrolled course selected. Please open a course from Dashboard.');
        setLoading(false);
        return;
      }

      try {
        const data = await getCourseById(selectedCourseId);
        setCourse(data || null);
        if (userId) {
          try {
            const progressData = await getProgress(userId, Number(selectedCourseId));
            if (progressData && Array.isArray(progressData.completedLectureIds)) {
              setProgress({
                completedLectureIds: progressData.completedLectureIds.map(Number)
              });
            }
          } catch (progressErr) {
            console.error('Failed to load progress:', progressErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load enrolled course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [userId]);

  useEffect(() => {
    if (!activeLessonId && lessons.length > 0) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const handleMarkCompleted = async (lessonId) => {
    if (!course || !userId) return;

    const selectedCourseId = Number(localStorage.getItem('selectedEnrolledCourseId'));
    const updated = Array.from(new Set([...(progress.completedLectureIds || []), Number(lessonId)]));
    setProgress({ completedLectureIds: updated });

    try {
      await saveProgress({
        userId,
        courseId: selectedCourseId,
        completedLectureIds: updated
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const completedCount = progress.completedLectureIds?.length || 0;
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Layout navigateTo={navigateTo}>
      <div className="course-wrapper">
        <section className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-image">
              <img src="/images/java-frameworks.png" alt="Enrolled Java course" />
            </div>
            <div className="course-hero-text">
              <h1 className="course-hero-title">
                {course?.title || 'Enrolled Course'}
              </h1>
              <p className="course-hero-subtitle">
                Continue your purchased Java learning path from your dashboard.
              </p>
              {course && (
                <div className="course-meta">
                  <span className="meta-item">{course.category}</span>
                  <span className="meta-item">{course.level || 'Self-paced'}</span>
                  <span className="meta-item">
                    {course.price === 0 ? 'Free' : `Purchased · ₹${course.price}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="course-container">
          <div className="course-content">
            {loading && <p className="section-text">Loading course...</p>}
            {error && <p className="section-text" style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && course && (
              <>
                <section className="course-section">
                  <h2 className="section-title">Course Overview</h2>
                  <p className="section-text">
                    You are now inside your enrolled course workspace. Select lessons,
                    track completion, and continue where you left off.
                  </p>
                  <div className="ec-progress-bar-wrapper">
                    <div className="ec-progress-header">
                      <span>Course Progress</span>
                      <span>
                        {completedCount}/{totalCount} lessons · {progressPercent}%
                      </span>
                    </div>
                    <div className="ec-progress-bar">
                      <div
                        className="ec-progress-bar-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </section>

                <section className="course-section">
                  <h2 className="section-title">Curriculum</h2>
                  <div className="ec-course-layout">
                    <aside className="ec-lecture-list">
                      <h3 className="ec-section-title">Lessons</h3>
                      <ul>
                        {lessons.map((lesson) => {
                          const isCompleted = (progress.completedLectureIds || []).includes(lesson.id);
                          const isActive = lesson.id === activeLessonId;
                          return (
                            <li
                              key={lesson.id}
                              className={`ec-lecture-item${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
                              onClick={() => setActiveLessonId(lesson.id)}
                            >
                              <div className="ec-lecture-main">
                                <span className="ec-lecture-title">
                                  {lesson.id}. {lesson.title}
                                </span>
                                <span className="ec-lecture-duration">{lesson.duration}</span>
                              </div>
                              <div className="ec-lecture-actions">
                                {isCompleted ? (
                                  <span className="ec-lecture-status">Completed</span>
                                ) : (
                                  <button
                                    className="btn-ec-small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkCompleted(lesson.id);
                                    }}
                                  >
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </aside>

                    <div className="ec-lecture-player">
                      <h3 className="ec-section-title">Lesson Content</h3>
                      {!selectedLesson && (
                        <p className="section-text">Select a lesson to start learning.</p>
                      )}
                      {selectedLesson && (
                        <>
                          <h3 className="ec-current-lecture-title">{selectedLesson.title}</h3>
                          {selectedLesson.videoUrl ? (
                            <div className="ec-video-wrapper">
                              <video
                                key={selectedLesson.id}
                                className="ec-video-player"
                                controls
                                onEnded={() => handleMarkCompleted(selectedLesson.id)}
                              >
                                <source src={selectedLesson.videoUrl?.startsWith('/') ? `${API_BASE}${selectedLesson.videoUrl}` : selectedLesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="ec-empty-state">
                              <p>
                                Video content for this lesson will be added soon. You can still
                                track your learning progress here.
                              </p>
                              <button
                                className="btn-add"
                                onClick={() => handleMarkCompleted(selectedLesson.id)}
                              >
                                Mark This Lesson Completed
                              </button>
                            </div>
                          )}

                          {showLectureTheory && (
                            <div className="ec-theory-block">
                              <h4>Lecture Theory</h4>
                              <ul>
                                {buildLessonTheory(course?.title, selectedLesson).map((point, idx) => (
                                  <li key={`${selectedLesson.id}-theory-${idx}`}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </section>

                <section className="course-section course-actions">
                  <div className="action-buttons">
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="btn-course btn-secondary"
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      onClick={() => navigateTo('course')}
                      className="btn-course btn-primary"
                    >
                      Browse More Courses →
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EnrolledCourse;
