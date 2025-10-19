import { useState } from 'react';

function Page4({ onComplete }) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    await onComplete();
    setCompleted(true);
  };

  return (
    <div className="page">
      <h2>Page 4: Completion</h2>
      <p>Congratulations! You've reached the end of the course.</p>
      <p>Click the button below to mark this course as complete:</p>
      
      <button 
        className="complete-btn"
        onClick={handleComplete}
        disabled={completed}
      >
        {completed ? '✓ Completed' : 'Complete Course'}
      </button>

      {completed && (
        <div className="completion-message">
          ✓ Course completed successfully!
        </div>
      )}
    </div>
  );
}

export default Page4;

