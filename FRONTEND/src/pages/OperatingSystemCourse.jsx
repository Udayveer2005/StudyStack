import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import {
  getCourseById,
  enrollUser,
  getEnrollments,
  getProgress,
  saveProgress,
  API_BASE
} from '../api/api';
import './OperatingSystemCourse.css';

const OS_COURSE_ID = 5;

function OperatingSystemCourse({ navigateTo }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState({ completedLectureIds: [] });
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const userId = localStorage.getItem('userId');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const lectures = useMemo(
    () => (course && Array.isArray(course.lectures) ? course.lectures : []),
    [course]
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseData = await getCourseById(OS_COURSE_ID);
        setCourse(courseData || null);

        if (isLoggedIn && userId) {
          const enrollments = await getEnrollments(Number(userId));
          const enrolled = Array.isArray(enrollments)
            ? enrollments.some((e) => e.courseId === OS_COURSE_ID)
            : false;
          setIsEnrolled(enrolled);

          try {
            const progressData = await getProgress(Number(userId), OS_COURSE_ID);
            if (progressData && Array.isArray(progressData.completedLectureIds)) {
              setProgress({
                completedLectureIds: progressData.completedLectureIds.map(Number)
              });
            }
          } catch (progressErr) {
            console.error('Progress fetch failed:', progressErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load Operating Systems course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (!currentLectureId && lectures.length > 0) {
      setCurrentLectureId(lectures[0].id);
    }
  }, [lectures, currentLectureId]);

  const handleEnroll = async () => {
    if (!isLoggedIn || !userId) {
      alert('Please log in to enroll in this course.');
      navigateTo('login');
      return;
    }

    try {
      await enrollUser({ userId: Number(userId), courseId: OS_COURSE_ID });
      setIsEnrolled(true);
      alert('You are enrolled in Operating Systems Fundamentals!');
    } catch (err) {
      alert(err.message || 'Enrollment failed. Please try again.');
      console.error(err);
    }
  };

  const handleMarkCompleted = async (lectureId) => {
    if (!isLoggedIn || !userId) {
      alert('Please log in to track your progress.');
      navigateTo('login');
      return;
    }

    const updatedIds = Array.from(
      new Set([...(progress.completedLectureIds || []), Number(lectureId)])
    );
    setProgress({ completedLectureIds: updatedIds });

    try {
      await saveProgress({
        userId: Number(userId),
        courseId: OS_COURSE_ID,
        completedLectureIds: updatedIds
      });
      const storageKey = `progress:${userId}:${OS_COURSE_ID}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedIds));
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleLectureSelect = (lectureId) => {
    setCurrentLectureId(lectureId);
  };

  const selectedLecture = useMemo(
    () => lectures.find((l) => l.id === currentLectureId) || null,
    [lectures, currentLectureId]
  );

  const completedCount = progress.completedLectureIds
    ? progress.completedLectureIds.length
    : 0;
  const totalCount = lectures.length || 0;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Layout navigateTo={navigateTo}>
      <div className="os-course-wrapper">
        <section className="os-course-hero">
          <div className="os-course-hero-content">
            <div className="os-course-hero-text">
              <h1 className="os-course-title">Operating Systems Fundamentals</h1>
              <p className="os-course-subtitle">
                Learn how modern operating systems manage processes, memory, files,
                and hardware — completely free.
              </p>
              <div className="os-course-meta">
                <span className="os-meta-item">📽️ 6 Video Lectures</span>
                <span className="os-meta-item">💻 Hands-on Concepts</span>
                <span className="os-meta-item">₹0 · Free Course</span>
              </div>
              <div className="os-course-actions">
                {!isEnrolled ? (
                  <button className="btn-os-primary" onClick={handleEnroll}>
                    Enroll for Free
                  </button>
                ) : (
                  <button
                    className="btn-os-secondary"
                    onClick={() =>
                      setCurrentLectureId(
                        (progress.completedLectureIds || []).length > 0
                          ? progress.completedLectureIds[
                              progress.completedLectureIds.length - 1
                            ]
                          : lectures[0]?.id
                      )
                    }
                  >
                    Continue Learning
                  </button>
                )}
                <button
                  className="btn-os-link"
                  onClick={() => navigateTo('course')}
                >
                  ← Back to Courses
                </button>
              </div>
              {isLoggedIn && totalCount > 0 && (
                <div className="os-progress-bar-wrapper">
                  <div className="os-progress-header">
                    <span>Course Progress</span>
                    <span>
                      {completedCount}/{totalCount} lectures · {progressPercent}%
                    </span>
                  </div>
                  <div className="os-progress-bar">
                    <div
                      className="os-progress-bar-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="os-course-body">
          {loading && <p className="os-info-text">Loading course...</p>}
          {error && <p className="os-error-text">{error}</p>}

          {!loading && !error && (
            <div className="os-course-layout">
              <aside className="os-lecture-list">
                <h2 className="os-section-title">Lectures</h2>
                {lectures.length === 0 && (
                  <p className="os-info-text">
                    No lectures defined for this course yet.
                  </p>
                )}
                <ul>
                  {lectures.map((lecture) => {
                    const isCompleted = (progress.completedLectureIds || []).includes(
                      lecture.id
                    );
                    const isActive = lecture.id === currentLectureId;
                    return (
                      <li
                        key={lecture.id}
                        className={`os-lecture-item${
                          isActive ? ' active' : ''
                        }${isCompleted ? ' completed' : ''}`}
                        onClick={() => handleLectureSelect(lecture.id)}
                      >
                        <div className="os-lecture-main">
                          <span className="os-lecture-title">
                            {lecture.id}. {lecture.title}
                          </span>
                          <span className="os-lecture-duration">
                            {lecture.duration}
                          </span>
                        </div>
                        <div className="os-lecture-actions">
                          {isCompleted ? (
                            <span className="os-lecture-status">Completed</span>
                          ) : (
                            <button
                              className="btn-os-small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkCompleted(lecture.id);
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

              <div className="os-lecture-player">
                <h2 className="os-section-title">Lecture Player</h2>
                {!selectedLecture ? (
                  <p className="os-info-text">
                    Select a lecture from the list to start watching.
                  </p>
                ) : (
                  <>
                    <h3 className="os-current-lecture-title">
                      {selectedLecture.title}
                    </h3>
                    <div className="os-video-wrapper">
                      <video
                        key={selectedLecture.id}
                        className="os-video-player"
                        controls
                        onEnded={() => handleMarkCompleted(selectedLecture.id)}
                      >
                        <source
                          src={selectedLecture.videoUrl?.startsWith('/') ? `${API_BASE}${selectedLecture.videoUrl}` : selectedLecture.videoUrl}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default OperatingSystemCourse;

