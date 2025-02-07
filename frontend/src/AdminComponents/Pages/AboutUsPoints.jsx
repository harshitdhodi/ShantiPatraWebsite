import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUsPoints = () => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(['']); // Initially one point input
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true); // To manage loading state
  const [id, setId] = useState(null); // To track the current record's ID

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/aboutUsPoint/get');
        const data = response.data;
  
        if (data) {
          setTitle(data.title || ''); // Fallback to an empty string if title is missing
          setPoints(data.points || ['']); // Fallback to an empty array if points are missing
          setStatus(data.status || 'active'); // Fallback to 'active' if status is missing
          setId(data._id || null); // Ensure id is null if not present
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchData();
  }, []);
  

  // Handler for adding a new point input field
  const addPointField = () => {
    setPoints([...points, '']);
  };

  // Handler for removing a point input field
  const removePointField = (index) => {
    const newPoints = points.filter((_, idx) => idx !== index);
    setPoints(newPoints);
  };

  // Handler for updating point value
  const handlePointChange = (index, value) => {
    const newPoints = points.map((point, idx) => (idx === index ? value : point));
    setPoints(newPoints);
  };

  // Form submission handler for updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3006/api/aboutUsPoint/edit?id=${id}`, {
        title,
        points,
        status,
      });
      console.log('Updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating data:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit About Us Points</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Points */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
          {points.map((point, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => removePointField(index)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={addPointField}
          >
            Add Point
          </button>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default AboutUsPoints;
