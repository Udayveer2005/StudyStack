/**
 * Course Page
 * ===========
 * Displays the course listing (Java Frameworks content + purchasable courses).
 * Course list is loaded from the backend via GET /courses when the page mounts.
 * Uses getCourses() from api.js; no local JSON or mock data.
 */
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import { getCourses } from '../api/api';
import './Course.css';

function Course({ navigateTo, onAddToCart }) {
  // Tab for content sections (overview, frameworks, features, comparison)
  const [activeTab, setActiveTab] = useState('overview');
  // Course list from API; empty until fetch completes
  const [courses, setCourses] = useState([]);
  // True while GET /courses is in progress (show "Loading courses...")
  const [loading, setLoading] = useState(true);
  // Error message if the API call fails (e.g. backend not running)
  const [error, setError] = useState('');

  // When the component mounts (user navigates to this page), we fetch courses once.
  // Empty dependency array [] means this effect runs only on mount, not on every re-render.
  useEffect(() => {
    const fetchCoursesFromApi = async () => {
      setError('');
      try {
        const data = await getCourses(); // API call: GET http://localhost:5000/courses
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
        setCourses([]);
        console.error(err);
      } finally {
        setLoading(false); // Always turn off loading when request finishes (success or fail)
      }
    };
    fetchCoursesFromApi();
  }, []);

  return (
    <Layout navigateTo={navigateTo}>
      <div className="course-wrapper">
        {/* Hero Banner */}
        <section className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-image">
              <img src="/images/javascript.jpg" alt="Java Programming" />
            </div>
            <div className="course-hero-text">
              <h1 className="course-hero-title">Java Frameworks</h1>
              <p className="course-hero-subtitle">
                Master the most popular Java frameworks used in enterprise development
              </p>
              <div className="course-meta">
                <span className="meta-item">⏱️ 8 Hours</span>
                <span className="meta-item">📚 12 Modules</span>
                <span className="meta-item">⭐ 4.8 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="course-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'frameworks' ? 'active' : ''}`}
            onClick={() => setActiveTab('frameworks')}
          >
            Frameworks
          </button>
          <button 
            className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison
          </button>
        </div>

        <div className="course-container">
          <div className="course-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <section className="course-section">
                  <div className="section-header-with-image">
                    <div className="section-image">
                      <img src="/images/designing.jpg" alt="Java Development" />
                    </div>
                    <div className="section-text-content">
                      <h2 className="section-title">What are Java Frameworks?</h2>
                      <p className="section-text">
                        Java frameworks are pre-written code structures that provide a foundation for 
                        developing Java applications. They offer reusable components, libraries, and 
                        tools that simplify the development process, allowing developers to focus on 
                        business logic rather than low-level implementation details.
                      </p>
                      <p className="section-text">
                        Frameworks follow design patterns and best practices, ensuring consistency, 
                        maintainability, and scalability in application development. They provide 
                        solutions for common problems like dependency injection, data persistence, 
                        web request handling, and more.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Learning Path */}
                <section className="course-section">
                  <h2 className="section-title">Learning Path</h2>
                  <div className="learning-path">
                    <div className="path-step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h3>Foundation</h3>
                        <p>Understand core Java concepts and OOP principles</p>
                      </div>
                    </div>
                    <div className="path-step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h3>Spring Basics</h3>
                        <p>Learn dependency injection and IoC container</p>
                      </div>
                    </div>
                    <div className="path-step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h3>Spring Boot</h3>
                        <p>Build production-ready applications with Spring Boot</p>
                      </div>
                    </div>
                    <div className="path-step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h3>Hibernate & ORM</h3>
                        <p>Master database operations with Hibernate</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Frameworks Tab */}
            {activeTab === 'frameworks' && (
              <section className="course-section">
                <h2 className="section-title">Popular Java Frameworks</h2>
                <div className="frameworks-grid">
                  <div className="framework-card">
                    <div className="framework-image">
                      <img src="/images/development.jpg" alt="Spring Framework" />
                    </div>
                    <div className="framework-content">
                      <h3 className="framework-name">Spring Framework</h3>
                      <p className="framework-description">
                        Spring is one of the most popular Java frameworks, providing comprehensive 
                        infrastructure support for developing Java applications. It offers features 
                        like dependency injection, aspect-oriented programming, and transaction 
                        management. Spring Boot, built on top of Spring, simplifies the creation 
                        of production-ready applications with minimal configuration.
                      </p>
                      <div className="framework-tags">
                        <span className="tag">Dependency Injection</span>
                        <span className="tag">IoC Container</span>
                        <span className="tag">AOP</span>
                      </div>
                    </div>
                  </div>

                  <div className="framework-card">
                    <div className="framework-image">
                      <img src="/images/specialize.jpg" alt="Hibernate" />
                    </div>
                    <div className="framework-content">
                      <h3 className="framework-name">Hibernate</h3>
                      <p className="framework-description">
                        Hibernate is an object-relational mapping (ORM) framework that simplifies 
                        database interactions in Java applications. It maps Java objects to database 
                        tables, eliminating the need for writing complex SQL queries. Hibernate 
                        provides features like lazy loading, caching, and automatic table generation, 
                        making database operations more efficient and developer-friendly.
                      </p>
                      <div className="framework-tags">
                        <span className="tag">ORM</span>
                        <span className="tag">JPA</span>
                        <span className="tag">Database</span>
                      </div>
                    </div>
                  </div>

                  <div className="framework-card">
                    <div className="framework-image">
                      <img src="/images/internship.jpg" alt="Apache Struts" />
                    </div>
                    <div className="framework-content">
                      <h3 className="framework-name">Apache Struts</h3>
                      <p className="framework-description">
                        Apache Struts is a web application framework that follows the Model-View-Controller 
                        (MVC) architecture pattern. It helps in building enterprise-level Java web 
                        applications by separating business logic, presentation, and control flow. 
                        Struts provides features like form validation, internationalization, and 
                        tag libraries for creating dynamic web pages.
                      </p>
                      <div className="framework-tags">
                        <span className="tag">MVC</span>
                        <span className="tag">Web Apps</span>
                        <span className="tag">Enterprise</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <section className="course-section">
                <h2 className="section-title">Key Features of Java Frameworks</h2>
                <div className="features-grid-enhanced">
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">💉</div>
                    <h3>Dependency Injection</h3>
                    <p>Manages object dependencies and promotes loose coupling between components</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">🔄</div>
                    <h3>Inversion of Control (IoC)</h3>
                    <p>Allows frameworks to control the flow of the application, reducing boilerplate code</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">🗄️</div>
                    <h3>ORM Support</h3>
                    <p>Simplifies database operations by mapping objects to database tables</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">🔒</div>
                    <h3>Security</h3>
                    <p>Built-in security features for authentication and authorization</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">🧪</div>
                    <h3>Testing Support</h3>
                    <p>Provides tools and utilities for unit and integration testing</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">🧩</div>
                    <h3>Modularity</h3>
                    <p>Allows developers to use only the components they need</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">👥</div>
                    <h3>Community Support</h3>
                    <p>Large communities provide extensive documentation and support</p>
                  </div>
                  <div className="feature-item-enhanced">
                    <div className="feature-icon-enhanced">⚡</div>
                    <h3>Performance</h3>
                    <p>Optimized for high performance and scalability</p>
                  </div>
                </div>
              </section>
            )}

            {/* Comparison Tab */}
            {activeTab === 'comparison' && (
              <section className="course-section">
                <h2 className="section-title">Framework Comparison</h2>
                <div className="table-container">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Framework</th>
                        <th>Primary Use Case</th>
                        <th>Learning Curve</th>
                        <th>Community Size</th>
                        <th>Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Spring</strong></td>
                        <td>Enterprise Applications</td>
                        <td><span className="badge moderate">Moderate to Steep</span></td>
                        <td><span className="badge large">Very Large</span></td>
                        <td>Large-scale applications</td>
                      </tr>
                      <tr>
                        <td><strong>Hibernate</strong></td>
                        <td>Database Operations</td>
                        <td><span className="badge moderate">Moderate</span></td>
                        <td><span className="badge large">Large</span></td>
                        <td>ORM and data persistence</td>
                      </tr>
                      <tr>
                        <td><strong>Struts</strong></td>
                        <td>Web Applications</td>
                        <td><span className="badge moderate">Moderate</span></td>
                        <td><span className="badge medium">Medium</span></td>
                        <td>MVC-based web apps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Code Example Section */}
                <div className="code-example-section">
                  <h3 className="code-example-title">Quick Example: Spring Dependency Injection</h3>
                  <div className="code-block">
                    <pre><code>{`@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User findUser(Long id) {
        return userRepository.findById(id);
    }
}`}</code></pre>
                  </div>
                </div>
              </section>
            )}

            {/* Courses to Purchase - from backend API (GET /courses) */}
            <section className="course-section">
              <h2 className="section-title">Available Courses</h2>
              {loading && <p className="section-text">Loading courses...</p>}
              {error && <p className="section-text" style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && courses.length === 0 && (
                <p className="section-text">No courses available at the moment.</p>
              )}
              <div className="courses-list">
                {!loading && courses
                  .filter((course) => course.id !== 5) // hide OS course from this Java-related list
                  .map((course) => (
                    <div key={course.id} className="course-card">
                      <h3 className="course-card-title">{course.title}</h3>
                      <p className="course-card-level">{course.level || course.category}</p>
                      <div className="course-card-footer">
                        <span className="course-card-price">₹{course.price}</span>
                        <button
                          className="btn-course btn-primary"
                          onClick={() => onAddToCart(course)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Navigation Links */}
            <section className="course-section course-actions">
              <div className="action-buttons">
                <button onClick={() => navigateTo('home')} className="btn-course btn-secondary">
                  ← Back to Home
                </button>
                <button onClick={() => navigateTo('cart')} className="btn-course btn-primary">
                  Go to Cart →
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Course;

