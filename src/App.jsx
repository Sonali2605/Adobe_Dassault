import React, { useState } from 'react';
import './App.css';
import CourseList from './components/CourseList';
import Header from './components/Header';
import AddCourse from './components/AddCourse';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [courses, setCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(true);

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
    setActiveTab('home'); // Switch tab to 'courses'
  };

  return (
    <>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'home' && <div className="text-2xl"> 
        <button className="addCourse" onClick={() => setActiveTab("courses")}>New Course</button>
        <CourseList courses={courses} /></div>}
        {activeTab === 'courses' && (
          <>
              <AddCourse onSave={handleSaveCourse} onCancel={handleCancelAddCourse} onGoToCourseDetails={handleGoToCourseDetails} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
