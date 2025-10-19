<template>
  <div v-if="!initialized" class="loading">
    <h2>Initializing course...</h2>
  </div>

  <div v-else class="course-container">
    <header>
      <h1>Vue SCORM Course</h1>
      <ProgressBar :current="currentPage" :total="totalPages" />
    </header>

    <main>
      <component 
        :is="currentPageComponent" 
        :userData="userData"
        @update-data="updateUserData"
        @complete="handleComplete"
      />
    </main>

    <Navigation
      :currentPage="currentPage"
      :totalPages="totalPages"
      @next="handleNext"
      @previous="handlePrevious"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useScorm } from './composables/useScorm';
import Page1 from './pages/Page1.vue';
import Page2 from './pages/Page2.vue';
import Page3 from './pages/Page3.vue';
import Page4 from './pages/Page4.vue';
import Navigation from './components/Navigation.vue';
import ProgressBar from './components/ProgressBar.vue';

export default {
  name: 'App',
  components: {
    Navigation,
    ProgressBar
  },
  setup() {
    const { initialized, saveProgress, getProgress, setComplete, setScore } = useScorm();
    const currentPage = ref(1);
    const userData = ref({});
    const pages = [Page1, Page2, Page3, Page4];
    const totalPages = pages.length;
    let autoSaveInterval = null;

    const currentPageComponent = computed(() => pages[currentPage.value - 1]);

    // Load saved progress
    const loadProgress = async () => {
      const progress = await getProgress();
      if (progress) {
        console.log('Loaded progress:', progress);
        currentPage.value = progress.currentPage || 1;
        userData.value = progress.userData || {};
      }
    };

    // Save current progress
    const saveCurrentProgress = async () => {
      await saveProgress({
        currentPage: currentPage.value,
        userData: userData.value,
        timestamp: new Date().toISOString()
      });
    };

    // Watch for initialization
    watch(initialized, (isInit) => {
      if (isInit) {
        loadProgress();
        
        // Setup auto-save
        autoSaveInterval = setInterval(() => {
          saveCurrentProgress();
        }, 30000);
      }
    });

    // Watch for changes to save
    watch([currentPage, userData], () => {
      if (initialized.value) {
        saveCurrentProgress();
      }
    }, { deep: true });

    onMounted(() => {
      if (initialized.value) {
        loadProgress();
      }
    });

    onUnmounted(() => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    });

    const handleNext = () => {
      if (currentPage.value < totalPages) {
        currentPage.value++;
      }
    };

    const handlePrevious = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const handleComplete = async () => {
      await setComplete();
      await setScore(100);
      alert('Course completed successfully!');
    };

    const updateUserData = (key, value) => {
      userData.value = {
        ...userData.value,
        [key]: value
      };
    };

    return {
      initialized,
      currentPage,
      totalPages,
      userData,
      currentPageComponent,
      handleNext,
      handlePrevious,
      handleComplete,
      updateUserData
    };
  }
};
</script>

