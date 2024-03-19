import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseList = ({ onAddCourse }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init =async () =>{
    await axios.get('http://localhost:3000/courseData')
      .then(response => {
        setCourses(response.data.courses);
      })
      .catch(error => {
        console.error('Error fetching course data:', error);
      });
  };

  const handleCheckboxChange = (courseId, checked) => {
    if (checked) {
      setSelectedCourses(prevState => [...prevState, courseId]);
    } else {
      setSelectedCourses(prevState => prevState.filter(id => id !== courseId));
    }
  };

  const handlePublishClick = async () => {
    try {
      const response = await axios.put('http://localhost:3000/publishCourse', { ids: selectedCourses });
      console.log(response.data.msg); // Display success message
      alert('Course published successfully!');
      init();
      setSelectedCourses([]);
      // Optionally, update UI or perform additional actions upon successful publishing
    } catch (error) {
      console.error('Error publishing courses:', error);
    }
  };

  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-4">Courses</h2> */}
      <button
        className="bg-blue-500 text-white py-2 px-4 mb-4 publishBtn"
        onClick={handlePublishClick}
        disabled={selectedCourses.length === 0}
      >
        Publish
      </button>
      <table className="course-table" >
        <thead>
          <tr className="header-row">
            <th style= {{textAlign:'left'}}>Course ID</th>
            <th style= {{textAlign:'left'}}>Title</th>
            <th style= {{textAlign:'center'}}>Modules</th>
            <th style= {{textAlign:'left'}}>Instructor</th>
            <th style= {{textAlign:'left'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id} className="course-row">
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td style= {{textAlign:'center'}}>{course.no_of_modules}</td>
              <td>{course.instructor}</td>
              <td>
                {course.published ? (
                  <span className="published-label">Published</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={(e) => handleCheckboxChange(course._id, e.target.checked)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
