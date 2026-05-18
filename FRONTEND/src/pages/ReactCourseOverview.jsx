import React from 'react';
import Layout from '../components/Layout/Layout.jsx';
import './Course.css';

const REACT_COURSE_ID = 4;

function ReactCourseOverview({ navigateTo }) {
  const handleStartCourse = () => {
    localStorage.setItem('selectedEnrolledCourseId', String(REACT_COURSE_ID));
    navigateTo('enrolled-course');
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="course-wrapper">
        <section className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-image">
              <img src="/images/react_description.png" alt="React Development course" />
            </div>
            <div className="course-hero-text">
              <h1 className="course-hero-title">React Development</h1>
              <p className="course-hero-subtitle">
                Build modern, component-driven web applications with practical React patterns used in real frontend teams.
              </p>
              <div className="course-meta">
                <span className="meta-item">📽️ 6 Video Lectures</span>
                <span className="meta-item">⏱️ 12 Hours</span>
                <span className="meta-item">🧩 Beginner to Intermediate</span>
              </div>
            </div>
          </div>
        </section>

        <div className="course-container">
          <div className="course-content">
            <section className="course-section">
              <h2 className="section-title">Detailed Course Description</h2>
              <p className="section-text">
                React Development is a complete, project-oriented frontend course designed to help you move from
                basic JavaScript knowledge to building scalable single-page applications. The course starts with core
                React concepts such as JSX, component architecture, and state-driven UI updates, then gradually
                introduces real production concerns like routing, API integration, reusable component design, and
                maintainable folder structures.
              </p>
              <p className="section-text">
                Rather than learning isolated syntax, you will understand the reasoning behind component composition,
                state lifting, and effect management so you can structure applications cleanly as the codebase grows.
                Each module emphasizes practical decisions frontend developers make every day: where to keep state,
                how to avoid prop drilling, when to split components, and how to keep UI behavior predictable.
              </p>
              <p className="section-text">
                By the end of the course, you will be confident in building responsive, reusable interfaces that
                consume backend APIs, manage user interactions smoothly, and follow modern React best practices.
                This makes the course a strong foundation for internships, freelance projects, and frontend interview
                preparation.
              </p>
            </section>

            <section className="course-section">
              <h2 className="section-title">What You Will Learn</h2>
              <div className="features-grid-enhanced">
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">⚛️</div>
                  <h3>React Core</h3>
                  <p>JSX, rendering flow, props, state, and component lifecycle using hooks</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">🧭</div>
                  <h3>Navigation and Routing</h3>
                  <p>Design multi-page app experiences with clean route structure</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">🌐</div>
                  <h3>API Integration</h3>
                  <p>Fetch, display, and manage backend data with loading and error states</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">🧱</div>
                  <h3>Reusable Components</h3>
                  <p>Create scalable UI patterns and reduce duplication in larger apps</p>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Detailed Syllabus</h2>
              <div className="learning-path">
                <div className="path-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>React Fundamentals and JSX</h3>
                    <p>Understand virtual DOM basics, JSX syntax, and how React updates UI efficiently.</p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Components, Props, and State</h3>
                    <p>Model UIs using component trees and make components dynamic with state and props.</p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Handling Events and Forms</h3>
                    <p>Build interactive forms, manage input state, and implement validation-friendly patterns.</p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>useEffect and Data Fetching</h3>
                    <p>Work with side effects, asynchronous requests, and robust loading/error handling.</p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>React Router and Navigation</h3>
                    <p>Create seamless navigation across views while preserving application state where needed.</p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h3>State Management Patterns</h3>
                    <p>Learn practical state organization strategies for growing codebases.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Who Should Take This Course</h2>
              <div className="frameworks-grid">
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Beginners in Frontend Development</h3>
                    <p className="framework-description">
                      Perfect if you know HTML, CSS, and JavaScript basics and want to build modern web apps.
                    </p>
                  </div>
                </div>
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Students Building Projects</h3>
                    <p className="framework-description">
                      Helps you create polished portfolio projects with reusable components and real API usage.
                    </p>
                  </div>
                </div>
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Internship and Job Seekers</h3>
                    <p className="framework-description">
                      Strengthens your React fundamentals and practical confidence for assessments and interviews.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Prerequisites and Outcomes</h2>
              <p className="section-text">
                <strong>Prerequisites:</strong> Basic HTML, CSS, JavaScript, and familiarity with ES6 syntax are
                enough to begin this course.
              </p>
              <p className="section-text">
                <strong>Outcomes:</strong> You will be able to design and build complete React interfaces,
                integrate backend APIs cleanly, and structure frontend projects in a maintainable way.
              </p>
            </section>

            <section className="course-section course-actions">
              <div className="action-buttons">
                <button onClick={() => navigateTo('dashboard')} className="btn-course btn-secondary">
                  ← Back to Dashboard
                </button>
                <button onClick={handleStartCourse} className="btn-course btn-primary">
                  Start React Course →
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ReactCourseOverview;
