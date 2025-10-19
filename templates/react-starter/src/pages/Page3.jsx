import { useState } from 'react';

function Page3({ userData, updateUserData }) {
  const [inputValue, setInputValue] = useState(userData.name || '');

  const handleSave = () => {
    updateUserData('name', inputValue);
  };

  return (
    <div className="page">
      <h2>Page 3: Interactive Example</h2>
      <p>This page demonstrates saving user data:</p>
      
      <div className="interaction">
        <label htmlFor="nameInput">Enter your name:</label>
        <input
          id="nameInput"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={handleSave}>Save</button>
        
        {userData.name && (
          <p className="greeting">Hello, {userData.name}!</p>
        )}
      </div>

      <p className="note">
        Your data is saved automatically and will be restored when you return to the course.
      </p>
    </div>
  );
}

export default Page3;

