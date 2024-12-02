'use client';

import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [activeSection, setActiveSection] = useState('profile'); // State for active section

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    } else {
      setProfileData({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    }
  }, []);

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
    localStorage.setItem('profile', JSON.stringify(updatedData));
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    // Clear local storage and redirect to login (if you have authentication)
    localStorage.removeItem('profile');
    // window.location.href = '/login'; 
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex' }}>
        {/* Left Section Menu */}
        <div style={{ width: '200px', marginRight: '2rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li
              onClick={() => handleSectionClick('profile')}
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: activeSection === 'profile' ? '#eee' : 'transparent',
              }}
            >
              Profile
            </li>
            <li
              onClick={() => handleSectionClick('tickets')}
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: activeSection === 'tickets' ? '#eee' : 'transparent',
              }}
            >
              Tickets
            </li>
            <li
              onClick={() => handleSectionClick('history')}
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: activeSection === 'history' ? '#eee' : 'transparent',
              }}
            >
              History
            </li>
            <li
              onClick={() => handleSectionClick('payment')}
              style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: activeSection === 'payment' ? '#eee' : 'transparent',
              }}
            >
              Payment
            </li>
            <li
              onClick={handleLogout}
              style={{ padding: '10px', cursor: 'pointer' }}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* Right Section Content */}
        <div style={{ flex: 1 }}> {/* Take up remaining space */}
          {activeSection === 'profile' && (
            <div>
              <h1>Profile</h1>
              <p>Name: {profileData.name}</p>
              <p>Email: {profileData.email}</p>

              <h2>Edit Profile</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedData = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                };
                handleProfileUpdate(updatedData);
              }}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" defaultValue={profileData.name} />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" defaultValue={profileData.email} />
                </div>
                <button type="submit">Save Changes</button>
              </form>
            </div>
          )}

          {activeSection === 'tickets' && (
            <div>
              <h1>Tickets</h1>
              {/* ... display user's tickets ... */}
            </div>
          )}

          {/* ... other sections (history, payment) ... */}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;