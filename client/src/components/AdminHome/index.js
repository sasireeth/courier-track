import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './index.css'

const AdminHome = () => {
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [newItem, setNewItem] = useState({
    trackingNumber: '',
    status: '',
    location: '',
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const token = Cookies.get('admin_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await fetch('http://localhost:7000/api/admin/tracking', options);
      const result = await response.json();
      setTrackingInfo(result);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (value !== undefined && value !== null) {
      setNewItem((prevNewItem) => ({
        ...prevNewItem,
        [field]: value,
      }));
    }
  };

  const handleAddItem = async () => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      };
      const response = await fetch('http://localhost:7000/api/admin/tracking', options);
      const result = await response.message;
      console.log(result);
      setNewItem({ trackingNumber: '', status: '', location: '' });
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error('Error adding tracking info:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    const {status,location}=newItem

    try {
      const response = await fetch(`http://localhost:7000/api/admin/tracking/${selectedItem.trackingNumber}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({status, location}),
      });
      const result = await response.json();
      console.log('Tracking info updated:', result);
      setNewItem({ trackingNumber: '', status: '', location: '' });
      setSelectedItem(null);
      fetchData();
      
    } catch (error) {
      console.error('Error updating tracking info:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:7000/api/admin/tracking/${itemId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      console.log('Tracking info deleted:', result);
      fetchData();
    } catch (error) {
      console.error('Error deleting tracking info:', error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setNewItem({ ...item });
  };

  return (
    <div className="admin-home-page">
  <h1>Admin Home Page</h1>
  <div className="tracking-number-input">
    <label htmlFor="trackingNumber">Tracking Number:</label>
    <input
      type="text"
      id="trackingNumber"
      name="trackingNumber"
      value={newItem.trackingNumber}
      onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
      disabled={selectedItem}
      className="input-field"
    />
  </div>

  <div className="status-input">
    <label htmlFor="status">Status:</label>
    <input
      type="text"
      id="status"
      name="status"
      value={newItem.status}
      onChange={(e) => handleInputChange('status', e.target.value)}
      className="input-field"
    />
  </div>

  <div className="location-input">
    <label htmlFor="location">Location:</label>
    <input
      type="text"
      id="location"
      name="location"
      value={newItem.location}
      onChange={(e) => handleInputChange('location', e.target.value)}
      className="input-field"
    />
  </div>

  <div className="action-button">
    <button onClick={selectedItem ? handleUpdateItem : handleAddItem} className="primary-button">
      {selectedItem ? 'Update' : 'Add'}
    </button>
  </div>

  <ul className="tracking-info-list">
    <li className="info-header">
      <p>Tracking Number</p>
      <p>Status</p>
      <p>Location</p>
      <p>Edit</p>
      <p>Delete</p>
    </li>
    {trackingInfo.map((item) => (
      <li key={item._id} className="info-item">
        <p className='c'>{item.trackingNumber}</p>
        <p className='c'>{item.status}</p>
        <p className='c'>{item.location}</p>
        <button onClick={() => handleEditClick(item)} className="secondary-button c">Edit</button>
        <button onClick={() => handleDeleteItem(item.trackingNumber)} className="secondary-button c">Delete</button>
      </li>
    ))}
  </ul>
</div>

  );
};

export default AdminHome;
