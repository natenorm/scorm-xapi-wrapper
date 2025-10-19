import { useState, useEffect } from 'react';
import { useScorm } from './hooks/useScorm';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Navigation from './components/Navigation';
import ProgressBar from './components/ProgressBar';

const PAGES = [Page1, Page2, Page3, Page4];

function App() {
  const { initialized, saveProgress, getProgress, setComplete, setScore } = useScorm();
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState({});
  
  const totalPages = PAGES.length;
  const CurrentPageComponent = PAGES[currentPage - 1];

  // Load saved progress
  useEffect(() => {
    if (initialized) {
      loadProgress();
    }
  }, [initialized]);

  // Auto-save progress
  useEffect(() => {
    if (initialized) {
      const interval = setInterval(() => {
        saveCurrentProgress();
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [initialized, currentPage, userData]);

  const loadProgress = async () => {
    const progress = await getProgress();
    if (progress) {
      console.log('Loaded progress:', progress);
      setCurrentPage(progress.currentPage || 1);
      setUserData(progress.userData || {});
    }
  };

  const saveCurrentProgress = async () => {
    await saveProgress({
      currentPage,
      userData,
      timestamp: new Date().toISOString()
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      saveCurrentProgress();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      saveCurrentProgress();
    }
  };

  const handleComplete = async () => {
    await setComplete();
    await setScore(100);
    alert('Course completed successfully!');
  };

  const updateUserData = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!initialized) {
    return (
      <div className="loading">
        <h2>Initializing course...</h2>
      </div>
    );
  }

  return (
    <div className="course-container">
      <header>
        <h1>React SCORM Course</h1>
        <ProgressBar current={currentPage} total={totalPages} />
      </header>

      <main>
        <CurrentPageComponent 
          userData={userData}
          updateUserData={updateUserData}
          onComplete={handleComplete}
        />
      </main>

      <Navigation
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

export default App;

