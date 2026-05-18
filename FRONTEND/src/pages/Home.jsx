/**
 * Home Page (Landing Page)
 * ========================
 * First page users see: hero, stats, features, testimonials, CTA.
 * Testimonials are loaded from the backend (GET /testimonials) when the page mounts.
 * If the API fails, we keep the default testimonials so the page still looks good.
 */
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import { getTestimonials, getCourses, getEnrollments, getAllProgressForUser } from '../api/api';
import './Home.css';

// Fallback data used if GET /testimonials fails (e.g. backend not running)
const DEFAULT_TESTIMONIALS = [
  { name: 'Sarah Johnson', role: 'Computer Science Student', image: '/images/person-1.jpg', text: 'StudyStack has transformed how I organize my learning. The dashboard keeps me focused and motivated!' },
  { name: 'Michael Chen', role: 'Software Developer', image: '/images/person-2.jpg', text: 'The course content is comprehensive and well-structured. Highly recommend for anyone learning Java frameworks.' },
  { name: 'Emily Rodriguez', role: 'Web Developer', image: '/images/person-3.jpg', text: "Love the clean interface and easy-to-use features. It's become an essential part of my learning routine." }
];

function Home({ navigateTo }) {
  // Which testimonial is currently shown (index in the testimonials array)
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // Testimonials list: starts with defaults, replaced by API response if GET /testimonials succeeds
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role') || 'student';
  const isTeacher = role === 'teacher';
  const userId = isLoggedIn ? Number(localStorage.getItem('userId')) : null;
  const [progressSummary, setProgressSummary] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  // On mount, fetch testimonials from backend. API call: GET /testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        if (data && data.length) setTestimonials(data);
      } catch (err) {
        console.error('Testimonials fetch failed, using default:', err);
      }
    };
    loadTestimonials();
  }, []);

  // Auto-rotate testimonials every 5 seconds. Cleanup: clear interval when component unmounts.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Load course progress summary for logged-in user
  useEffect(() => {
    if (!userId) {
      setProgressSummary([]);
      return;
    }

    const loadProgress = async () => {
      setProgressLoading(true);
      try {
        const [courses, enrollments, progress] = await Promise.all([
          getCourses(),
          getEnrollments(userId),
          getAllProgressForUser(userId)
        ]);

        const enrolled = Array.isArray(enrollments) ? enrollments : [];
        const courseList = Array.isArray(courses) ? courses : [];
        const progressList = Array.isArray(progress) ? progress : [];

        const summary = enrolled
          .map((enrollment) => {
            const course = courseList.find((c) => c.id === enrollment.courseId);
            if (!course) return null;

            const courseProgress = progressList.find(
              (p) => p.courseId === course.id
            );

            const lectures = Array.isArray(course.lectures)
              ? course.lectures
              : [];
            const completedIds = Array.isArray(
              courseProgress?.completedLectureIds
            )
              ? courseProgress.completedLectureIds
              : [];
            const totalLectures = lectures.length;
            const completedCount = completedIds.length;
            const percent =
              totalLectures > 0
                ? Math.round((completedCount / totalLectures) * 100)
                : null;

            return {
              id: course.id,
              title: course.title,
              level: course.level || course.category,
              percent,
              completedCount,
              totalLectures
            };
          })
          .filter(Boolean)
          .slice(0, 3); // show top 3

        setProgressSummary(summary);
      } catch (err) {
        console.error('Failed to load progress summary:', err);
        setProgressSummary([]);
      } finally {
        setProgressLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  // Stats data
  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "500+", label: "Courses Available" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <Layout navigateTo={navigateTo}>
      <div className="home-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="highlight">StudyStack</span>
              </h1>
              <p className="hero-subtitle">Your Learning Companion for Success</p>
              <p className="hero-description">
                Transform your learning journey with our comprehensive platform. 
                Organize, track, and excel in your studies with cutting-edge tools 
                designed for modern learners.
              </p>
              <div className="hero-buttons">
                {!isLoggedIn && (
                  <button onClick={() => navigateTo('signup')} className="btn btn-hero-primary">
                    Continue as Student
                  </button>
                )}
                {!isLoggedIn && (
                  <button onClick={() => navigateTo('signup')} className="btn btn-hero-secondary">
                    Join as Teacher
                  </button>
                )}
                {(!isLoggedIn || !isTeacher) && (
                  <button onClick={() => navigateTo('all-courses')} className="btn btn-hero-secondary">
                    Explore Courses
                  </button>
                )}
                {(!isLoggedIn || !isTeacher) && (
                  <button onClick={() => navigateTo('operating-system')} className="btn btn-hero-secondary">
                    Start OS Course (Free)
                  </button>
                )}
                {isLoggedIn && (
                  <button
                    onClick={() =>
                      navigateTo(
                        isTeacher ? 'teacher-dashboard' : 'dashboard'
                      )
                    }
                    className="btn btn-hero-primary"
                  >
                    {isTeacher ? 'Go to Teacher Dashboard' : 'Go to Dashboard'}
                  </button>
                )}
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/innovation.jpg" alt="Learning Innovation" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose StudyStack?</h2>
            <p className="section-subtitle">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/lecture.jpg" alt="Learn" />
              </div>
              <h3>📚 Comprehensive Learning</h3>
              <p>Access high-quality educational content and courses curated by industry experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/development.jpg" alt="Organize" />
              </div>
              <h3>📝 Smart Organization</h3>
              <p>Manage your learning items, tasks, and progress with our intuitive dashboard</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/skill.jpg" alt="Track" />
              </div>
              <h3>🎯 Progress Tracking</h3>
              <p>Monitor your achievements and stay motivated with detailed progress analytics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/certification.jpg" alt="Certify" />
              </div>
              <h3>🏆 Certifications</h3>
              <p>Earn certificates upon course completion to showcase your skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/mobile.jpg" alt="Mobile" />
              </div>
              <h3>📱 Mobile Friendly</h3>
              <p>Learn on the go with our responsive design that works on all devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/images/network.jpg" alt="Community" />
              </div>
              <h3>👥 Community Support</h3>
              <p>Connect with fellow learners and get help from our active community</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">Real feedback from real learners</p>
          </div>
          <div className="testimonials-container">
            <div className="testimonial-card active">
              <div className="testimonial-image">
                <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonials[currentTestimonial].text}"</p>
                <div className="testimonial-author">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Progress Summary Section (logged in only) */}
        {isLoggedIn && (
          <section className="progress-summary-section">
            <div className="section-header">
              <h2 className="section-title">My Course Progress</h2>
              <p className="section-subtitle">
                See how far you&apos;ve come in your enrolled courses
              </p>
            </div>
            {progressLoading && (
              <p className="section-text">Loading your progress...</p>
            )}
            {!progressLoading && progressSummary.length === 0 && (
              <p className="section-text">
                You haven&apos;t started any courses yet. Enroll to see your
                progress here.
              </p>
            )}
            {!progressLoading && progressSummary.length > 0 && (
              <div className="progress-summary-grid">
                {progressSummary.map((course) => (
                  <div key={course.id} className="progress-summary-card">
                    <h3 className="progress-course-title">{course.title}</h3>
                    <p className="progress-course-meta">{course.level}</p>
                    {course.percent === null ? (
                      <p className="section-text">
                        Progress data will appear once lectures are defined.
                      </p>
                    ) : (
                      <>
                        <div className="progress-bar-wrapper">
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${course.percent}%` }}
                            />
                          </div>
                          <div className="progress-bar-labels">
                            <span>
                              {course.completedCount}/{course.totalLectures}{' '}
                              lectures
                            </span>
                            <span>{course.percent}%</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already using StudyStack to achieve their goals</p>
            <div className="cta-buttons">
              {!isLoggedIn && (
                <button onClick={() => navigateTo('signup')} className="btn btn-cta-primary">
                  Create Free Account
                </button>
              )}
              {isLoggedIn ? (
                <button onClick={() => navigateTo('dashboard')} className="btn btn-cta-secondary">
                  Go to Dashboard
                </button>
              ) : (
                <button onClick={() => navigateTo('login')} className="btn btn-cta-secondary">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;

