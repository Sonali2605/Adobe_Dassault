import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCourse = ({ onSave, onCancel, onGoToCourseDetails }) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  // const [moduleDuration, setModuleDuration] = useState(0);
  // const [durationBetweenModules, setDurationBetweenModules] = useState(0);
  const [numberOfModules, setNumberOfModules] = useState(0);
  const [courseId, setCourseId] = useState('');
  // const [contentUrl, setContentUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false); // Track whether the course is published
  const [courseToPublish, setCourseToPublish] = useState('');
  const [moduleData, setModuleData] = useState([]); // Store module data dynamically

  // Update moduleData when numberOfModules changes
  useEffect(() => {
    const newModuleData = Array.from({ length: numberOfModules }, (_, index) => ({
      name: '',
      contentUrl: '',
    }));
    setModuleData(newModuleData);
  }, [numberOfModules]);

  const handleModuleChange = (index, key, value) => {
    const updatedModuleData = [...moduleData];
    updatedModuleData[index][key] = value;
    setModuleData(updatedModuleData);
  };

  const handleSubmit = () => {
    // Check if any field is empty
    if (!title || !instructor || !numberOfModules || !courseId ) {
      alert('Please fill in all fields.');
      return;
    }

    const courseData = {
      name: title,
      id: courseId,
      no_of_modules: numberOfModules,
      instructor: instructor,
      published: false,
      modules: moduleData // Pass moduleData along with course data
    };

    axios.post('http://localhost:3000/courseData', courseData)
      .then(response => {
        console.log('Course added successfully:', response.data);
        onSave(response.data); // Pass the added course data to the parent component
        setCourseToPublish(response.data.courseId); // Set the courseId received from the response
        alert('Course added successfully!');
        setIsPublished(true);
      })
      .catch(error => {
        console.error('Error adding course:', error);
        alert('Error adding course. Please try again.');
      });
  };

  const clearFields = () => {
    setTitle('');
    setInstructor('');
    setNumberOfModules(0);
    setCourseId('');
    setIsPublished(false); // Disable the "Publish" button after clearing the fields
    setModuleData([]); // Clear module data when fields are cleared
  };

  const handleCancel = () => {
    clearFields();
    onCancel(); // Callback to handle cancel action in parent component
  };

  const handlePublish = () => {
    // Publish the course along with moduleData
    setIsPublished(false);
    axios.put('http://localhost:3000/publishCourse', { ids: courseToPublish, modules: moduleData })
      .then(publishResponse => {
        console.log('Course published successfully:', publishResponse.data.msg);
        alert('Course published successfully!');
        // Optionally do something with the publishResponse, like show a toast message
      })
      .catch(publishError => {
        console.error('Error publishing course:', publishError);
        setIsPublished(false);
        // Optionally show an error message to the user
      });
  };

  const handleInputChange = () => {
    setIsPublished(false); // Set isEditing to true when any input field is changed
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-2xl font-bold mb-4">Add Course</h2>
        <div style={{ background: "#f4f4f6", padding: "30px" }}>
          <div className="form-row">
            <label className="form-label">Course Id:</label>
            <input type="text" value={courseId} onChange={e => { setCourseId(e.target.value); handleInputChange(); }} className="input-field" />
          </div>
          <div className="form-row">
            <label className="form-label">Title:</label>
            <input type="text" value={title} onChange={e => { setTitle(e.target.value); handleInputChange(); }} className="input-field" />
          </div>
          <div className="form-row">
            <label className="form-label">Instructor Name:</label>
            <input type="text" value={instructor} onChange={e => { setInstructor(e.target.value); handleInputChange(); }} className="input-field" />
          </div>
          {/* <div className="form-row">
            <label className="form-label">Module Duration:</label>
            <input type="number" value={moduleDuration} onChange={e => { setModuleDuration(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
          </div>
          <div className="form-row">
            <label className="form-label">Duration Between Modules:</label>
            <input type="number" value={durationBetweenModules} onChange={e => { setDurationBetweenModules(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
          </div> */}
          <div className="form-row">
            <label className="form-label">Number of Modules:</label>
            <input type="number" value={numberOfModules} onChange={e => { setNumberOfModules(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
          </div>
          {moduleData.map((module, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <div className="form-row">
                <label className="form-label">Module {index + 1} Name:</label>
                <input type="text" value={module.name} onChange={e => handleModuleChange(index, 'name', e.target.value)} className="input-field" />
              </div>
              <div className="form-row">
                <label className="form-label">Module {index + 1} Content Url:</label>
                <input type="text" value={module.contentUrl} onChange={e => handleModuleChange(index, 'contentUrl', e.target.value)} className="input-field" />
              </div>
            </div>
          ))}
          {/* <div className="form-row">
            <label className="form-label">Content Url:</label>
            <input type="text" value={contentUrl} onChange={e => { setContentUrl(e.target.value); handleInputChange(); }} className="input-field" />
          </div> */}
          <div style={{ display: "flex" }}>
            <div className="button-container" style={{ justifyContent: "flex-start", marginTop: "40px", width: "50%" }}>
              <button type="submit" className="button save-button" onClick={handleSubmit}>Save</button>
              <button type="button "
              className="button cancel-button" 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="publishBtn" 
              style={{ width: "auto", height: "auto", padding: "0 28px", marginLeft: "10px" }} 
              onClick={handlePublish} 
              disabled={!isPublished}
            >
              Publish
            </button>
          </div>
          <div style={{ justifyContent: "flex-end", display: "flex", marginTop: "40px", width: "50%" }}>
            <button 
              type="button" 
              className="button cancel-button" 
              onClick={onGoToCourseDetails}
            >
              Go to All Courses
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddCourse;

