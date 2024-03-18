import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCourse = ({ onSave, onCancel, onGoToCourseDetails }) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [moduleDuration, setModuleDuration] = useState(0);
  const [durationBetweenModules, setDurationBetweenModules] = useState(0);
  const [numberOfModules, setNumberOfModules] = useState(0);
  const [courseId, setCourseId] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false); // Track whether the course is published
  const [courseToPublish, setCourseToPublish]= useState('');

  const handleSubmit = () => {
    // Check if any field is empty
    if (!title || !instructor || !moduleDuration || !durationBetweenModules || !numberOfModules || !courseId || !contentUrl) {
      alert('Please fill in all fields.');
      return;
    }

    const courseData = {
      name: title,
      id: courseId,
      no_of_modules: numberOfModules,
      module_duration: moduleDuration,
      duration_between_module: durationBetweenModules,
      instructor: instructor,
      content_url: contentUrl,
      published: false
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
    setModuleDuration(0);
    setDurationBetweenModules(0);
    setNumberOfModules(0);
    setCourseId('');
    setContentUrl('');
    setIsPublished(false); // Disable the "Publish" button after clearing the fields
  };

  const handleCancel = () => {
    clearFields();
    onCancel(); // Callback to handle cancel action in parent component
  };

  const handlePublish = () => {
    // Publish the course
    setIsPublished(false)
    axios.put('http://localhost:3000/publishCourse', { ids: [courseToPublish] })
      .then(publishResponse => {
        console.log('Course published successfully:', publishResponse.data.msg);
        alert('Course publised successfully!');
        // Optionally do something with the publishResponse, like show a toast message
      })
      .catch(publishError => {
        console.error('Error publishing course:', publishError);
        setIsPublished(false)
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
        <div className="form-row">
          <label className="form-label">Title:</label>
          <input type="text" value={title} onChange={e => { setTitle(e.target.value); handleInputChange(); }} className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Instructor Name:</label>
          <input type="text" value={instructor} onChange={e => { setInstructor(e.target.value); handleInputChange(); }} className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Module Duration:</label>
          <input type="number" value={moduleDuration} onChange={e => { setModuleDuration(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Duration Between Modules:</label>
          <input type="number" value={durationBetweenModules} onChange={e => { setDurationBetweenModules(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Number of Modules:</label>
          <input type="number" value={numberOfModules} onChange={e => { setNumberOfModules(parseInt(e.target.value)); handleInputChange(); }} className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Course ID:</label>
          <input type="text" value={courseId} onChange={e => {setCourseId(e.target.value);handleInputChange();} } className="input-field" />
        </div>
        <div className="form-row">
          <label className="form-label">Content Url:</label>
          <input type="text" value={contentUrl} onChange={e => {setContentUrl(e.target.value);handleInputChange();} } className="input-field" />
        </div>
        <div className="button-container">
          <button type="submit" className="button save-button" onClick={handleSubmit}>Save</button>
          <button type="button" className="button cancel-button" onClick={handleCancel}>Cancel</button>
          <button type="button" className="button" onClick={onGoToCourseDetails}>Go to Course Details</button>
          <button type="button" className="button publish-button" onClick={handlePublish} disabled={!isPublished}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
