import { ref, onMounted, onUnmounted } from 'vue';
import ScormWrapper from 'scorm-xapi-wrapper';

export function useScorm() {
  const initialized = ref(false);

  onMounted(async () => {
    try {
      await ScormWrapper.initialize();
      console.log('SCORM initialized');
      console.log('Environment:', ScormWrapper.getEnvironmentType());
      initialized.value = true;
    } catch (error) {
      console.error('Error initializing SCORM:', error);
    }
  });

  onUnmounted(() => {
    if (ScormWrapper.isInitialized()) {
      ScormWrapper.terminate();
    }
  });

  const saveProgress = async (data) => {
    try {
      await ScormWrapper.saveProgress(data);
      console.log('Progress saved');
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getProgress = async () => {
    try {
      return await ScormWrapper.getProgress();
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  };

  const setComplete = async () => {
    try {
      await ScormWrapper.setComplete();
      console.log('Course marked complete');
    } catch (error) {
      console.error('Error setting completion:', error);
    }
  };

  const setScore = async (score) => {
    try {
      await ScormWrapper.setScore(score);
      console.log('Score set:', score);
    } catch (error) {
      console.error('Error setting score:', error);
    }
  };

  return {
    initialized,
    saveProgress,
    getProgress,
    setComplete,
    setScore
  };
}

