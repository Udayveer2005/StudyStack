import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import { getCourses } from '../api/api';
import './Course.css';

function AllCourses({ navigateTo, onAddToCart }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      setError('');
      try {
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load courses. Please try again.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  return (
    <Layout navigateTo={navigateTo}>
      <div className="course-wrapper">
        <section className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-text">
              <h1 className="course-hero-title">All Courses</h1>
              <p className="course-hero-subtitle">
                Browse every course available on StudyStack, including our free
                Operating Systems course.
              </p>
            </div>
          </div>
        </section>

        <div className="course-container">
          <div className="course-content">
            <section className="course-section">
              <h2 className="section-title">Available Courses</h2>
              {loading && <p className="section-text">Loading courses...</p>}
              {error && (
                <p className="section-text" style={{ color: 'red' }}>
                  {error}
                </p>
              )}
              {!loading && !error && courses.length === 0 && (
                <p className="section-text">
                  No courses available at the moment.
                </p>
              )}
              <div className="courses-list">
                {!loading && (
                  <>
                    {courses
                      .filter((course) => course.id === 5)
                      .map((course) => (
                        <div key={course.id} className="course-card">
                          <div className="course-card-image">
                            <img
                              src="/images/computer-operating-sytem.jpg"
                              alt="Operating Systems course"
                            />
                          </div>
                          <h3 className="course-card-title">{course.title}</h3>
                          <p className="course-card-level">
                            {course.level || course.category}
                          </p>
                          <div className="course-card-footer">
                            <span className="course-card-price">Free</span>
                            <button
                              className="btn-course btn-primary"
                              onClick={() => navigateTo('operating-system-overview')}
                            >
                              Start Free Course
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* Java Frameworks course card, styled like OS course */}
                    <div className="course-card">
                      <div className="course-card-image">
                        <img
                          src="/images/java-frameworks.png"
                          alt="Java Frameworks course"
                        />
                      </div>
                      <h3 className="course-card-title">Java Frameworks</h3>
                      <p className="course-card-level">
                        Overview · Spring · Hibernate · Struts
                      </p>
                      <div className="course-card-footer">
                        <span className="course-card-price">Paid</span>
                        <button
                          className="btn-course btn-primary"
                          onClick={() => navigateTo('course')}
                        >
                          Start Course
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AllCourses;

