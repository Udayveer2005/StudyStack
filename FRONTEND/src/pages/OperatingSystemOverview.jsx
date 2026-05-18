import React from 'react';
import Layout from '../components/Layout/Layout.jsx';
import './Course.css';

function OperatingSystemOverview({ navigateTo }) {
  return (
    <Layout navigateTo={navigateTo}>
      <div className="course-wrapper">
        <section className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-image">
              <img
                src="/images/computer-operating-sytem.jpg"
                alt="Operating Systems course"
              />
            </div>
            <div className="course-hero-text">
              <h1 className="course-hero-title">Operating Systems Fundamentals</h1>
              <p className="course-hero-subtitle">
                Understand how operating systems manage processes, memory, files,
                and devices in real-world systems.
              </p>
              <div className="course-meta">
                <span className="meta-item">📽️ 6 Video Lectures</span>
                <span className="meta-item">⏱️ 3 Hours</span>
                <span className="meta-item">₹0 Free</span>
              </div>
            </div>
          </div>
        </section>

        <div className="course-container">
          <div className="course-content">
            <section className="course-section">
              <h2 className="section-title">Course Description</h2>
              <p className="section-text">
                Operating Systems Fundamentals gives you a practical and
                beginner-friendly understanding of how a computer actually runs
                applications behind the scenes. You will explore how the OS acts
                as a bridge between hardware and software, coordinating CPU time,
                memory, storage, and input/output resources so programs can run
                smoothly and securely.
              </p>
              <p className="section-text">
                Instead of only theory, this course explains each topic with
                real examples used in Windows, Linux, and modern mobile systems.
                By the end, you will understand why processes get scheduled the
                way they do, how memory is protected and shared, how files are
                organized on disk, and how these concepts affect software
                performance and reliability in real projects.
              </p>
              <p className="section-text">
                If you are planning to learn system design, backend engineering,
                cloud infrastructure, cybersecurity, or interview-focused computer
                science subjects, this course builds the strong foundation you
                need before moving to advanced topics.
              </p>
            </section>

            <section className="course-section">
              <h2 className="section-title">What You Will Learn</h2>
              <div className="features-grid-enhanced">
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">🧠</div>
                  <h3>OS Basics</h3>
                  <p>Role and architecture of operating systems</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">⚙️</div>
                  <h3>Processes and Threads</h3>
                  <p>How programs run and share CPU time</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">🧮</div>
                  <h3>Memory Management</h3>
                  <p>Paging, virtual memory, and allocation strategies</p>
                </div>
                <div className="feature-item-enhanced">
                  <div className="feature-icon-enhanced">💾</div>
                  <h3>File Systems</h3>
                  <p>How data is organized and accessed on disk</p>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Detailed Syllabus</h2>
              <div className="learning-path">
                <div className="path-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Introduction to Operating Systems</h3>
                    <p>
                      Understand OS goals, kernel vs user mode, system calls, and
                      the role of process abstraction in modern computing.
                    </p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Processes and Threads</h3>
                    <p>
                      Learn process lifecycle, context switching, concurrency
                      basics, and how threads improve responsiveness.
                    </p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>CPU Scheduling Strategies</h3>
                    <p>
                      Compare FCFS, SJF, Round Robin, and priority scheduling, and
                      study fairness, throughput, and turnaround trade-offs.
                    </p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Memory Management</h3>
                    <p>
                      Explore contiguous allocation, segmentation, paging, and
                      virtual memory concepts used to run many programs safely.
                    </p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Virtual Memory and Paging</h3>
                    <p>
                      Understand page tables, address translation, page faults,
                      and replacement policies in high-level terms.
                    </p>
                  </div>
                </div>
                <div className="path-step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h3>File Systems and I/O</h3>
                    <p>
                      Learn how files are stored, indexed, and retrieved, plus
                      how device I/O is handled through OS abstractions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Who Should Take This Course</h2>
              <div className="frameworks-grid">
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Computer Science Students</h3>
                    <p className="framework-description">
                      Ideal for students preparing for semester exams, lab work,
                      and placement interviews involving operating systems topics.
                    </p>
                  </div>
                </div>
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Backend and DevOps Beginners</h3>
                    <p className="framework-description">
                      Helpful if you work with servers, containers, processes, and
                      performance tuning, where OS-level behavior directly matters.
                    </p>
                  </div>
                </div>
                <div className="framework-card">
                  <div className="framework-content">
                    <h3 className="framework-name">Interview Preparation Learners</h3>
                    <p className="framework-description">
                      Great for refreshing key concepts often asked in technical
                      interviews such as scheduling, deadlocks, memory, and paging.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="course-section">
              <h2 className="section-title">Prerequisites and Outcomes</h2>
              <p className="section-text">
                <strong>Prerequisites:</strong> Basic programming knowledge and
                familiarity with how applications run on a computer are enough.
                No prior operating systems course is required.
              </p>
              <p className="section-text">
                <strong>Outcomes:</strong> After completing this course, you will
                be able to explain core OS mechanisms confidently, reason about
                process and memory behavior in applications, and build a stronger
                base for advanced CS and software engineering topics.
              </p>
            </section>

            <section className="course-section course-actions">
              <div className="action-buttons">
                <button
                  onClick={() => navigateTo('all-courses')}
                  className="btn-course btn-secondary"
                >
                  ← Back to Courses
                </button>
                <button
                  onClick={() => navigateTo('operating-system')}
                  className="btn-course btn-primary"
                >
                  Start Course →
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OperatingSystemOverview;
