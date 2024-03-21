import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourseList.css'; // Import CSS for CourseList component

const CourseList = ({ onAddCourse }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [catalogId, setCatalogId] = useState([]);
  const [flag, setFlag] = useState(1);
  useEffect(() => {
    init();
  }, []);

  async function getRefreshToken() {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("client_id", "449923a1-a01c-4bf5-b7c8-2137718d6d04");
      urlencoded.append("client_secret", "b1b22c3e-900c-4bd1-b010-daf95c01b968");
      urlencoded.append("refresh_token", "cfc9007046dac38146b4eae495192d3c");

      const response = await axios.post(
        'https://learningmanager.adobe.com/oauth/token/refresh',
        urlencoded,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const init = async () => {
    try {
      const response = await axios.get('http://localhost:3000/courseData');
      setCourses(response.data.courses);

      const refreshTokenResponse = await getRefreshToken();
      const accessToken = refreshTokenResponse.access_token;

      // Fetch catalogs using the access token
      const catalogResponse = await axios.get(
        'https://learningmanager.adobe.com/primeapi/v2/catalogs?page[offset]=0&page[limit]=10&sort=name',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setCatalogId(catalogResponse?.data?.data);

    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleCheckboxChange = (courseId, checked) => {
    if (checked) {
      setSelectedCourses(prevState => [...prevState, courseId]);
    } else {
      setSelectedCourses(prevState => prevState.filter(id => id !== courseId));
    }
  };

  const handlePublishClick = () => {
    setShowModal(true);
    setFlag(1);
  };

  const handleMoveToCatalogClick = () => {
    setShowModal(true);
    setFlag(2);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCatalogId('');
  };

  const handlePublishConfirm = async () => {
    try {
      const response = await axios.put('http://localhost:3000/publishCourse', { ids: selectedCourses, catalogId: selectedCatalogId });
      console.log(response.data.msg); // Display success message
      alert('Course published successfully!');
      init();
      setSelectedCourses([]);
      handleModalClose();
      // Optionally, update UI or perform additional actions upon successful publishing
    } catch (error) {
      console.error('Error publishing courses:', error);
    }
  };

  const handleCatalogSelection = (e) => {
    setSelectedCatalogId(e.target.value);
    console.log("1111111111111111111111111111111111111", selectedCatalogId)
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" style={{ fontSize: "15px" }} onClick={handleModalClose}>&times;</span>
            <h4 style={{ textAlign: 'center' }}>{flag === 1 ? "Select Catalog ID to publish courses":"Change Catalog ID"}</h4>
            <select value={selectedCatalogId} onChange={handleCatalogSelection}>
              <option value="">Select Catalog ID</option>
              {catalogId?.map(catalog => (
                <option key={catalog.id} value={catalog.id}>{catalog.attributes.name}</option>
              ))}
            </select>
            <button onClick={handlePublishConfirm}>OK</button>
          </div>
        </div>
      )}
      <div>
        <button
          className="bg-blue-500 text-white py-2 px-4 mb-4 publishBtn"
          onClick={handlePublishClick}
          disabled={selectedCourses.length === 0}
        >
          Publish
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 mb-4 publishBtn" style={{marginLeft:"10px"}}
          onClick={handleMoveToCatalogClick}
          disabled={selectedCourses.length === 0}
        >
          Move to Catalog
        </button>
      </div>
      <table className="course-table">
        <thead>
          <tr className="header-row">
            <th style={{ textAlign: 'left' }}></th>
            <th style={{ textAlign: 'left' }}>Course Id</th>
            <th style={{ textAlign: 'left' }}>Title</th>
            <th style={{ textAlign: 'center' }}>Modules</th>
            <th style={{ textAlign: 'left' }}>Instructor</th>
            <th style={{ textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id} className="course-row">
              <td style={{textAlign:"center"}}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={(e) => handleCheckboxChange(course._id, e.target.checked)}
                />
              </td>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td style={{ textAlign: 'center' }}>{course.no_of_modules}</td>
              <td>{course.instructor}</td>
              <td>
                {course.published ? (
                  <span className="published-label" style={{ color: 'green' }}>Published</span>
                ) : (
                  <span className="published-label" style={{ color: '#e1e4ea' }}>Unpublished</span>
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
