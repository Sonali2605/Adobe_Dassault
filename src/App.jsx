import React, { useState } from 'react';
import './App.css';
import CourseList from './components/CourseList';
import Header from './components/Header';
import AddCourse from './components/AddCourse';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveCourse = (courseData) => {
    setCourses([...courses, courseData]);
    toast.success('Course created successfully!');
  };

  const handleCancelAddCourse = () => {
  };

  const handleGoToCourseDetails = () => {
    setShowAddCourse(false); // Hide the AddCourse component
    setActiveTab('courses'); // Switch tab to 'courses'
  };

  return (
    <>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'home' && <div className="text-2xl">Hello</div>}
        {activeTab === 'courses' && (
          <>
            {showAddCourse ? (
              <AddCourse onSave={handleSaveCourse} onCancel={handleCancelAddCourse} onGoToCourseDetails={handleGoToCourseDetails} />
            ) : (
              <>
                <button className="addCourse" onClick={() => setShowAddCourse(true)}>New Course</button>
                <CourseList courses={courses} />
              </>
            )}
          </>
        )}
        {activeTab === 'reports' && <div className="text-2xl">Reports</div>}
      </div>
    </>
  );
}

export default App;
