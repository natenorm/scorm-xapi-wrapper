<template>
  <div class="page">
    <h2>Page 4: Completion</h2>
    <p>Congratulations! You've reached the end of the course.</p>
    <p>Click the button below to mark this course as complete:</p>
    
    <button 
      class="complete-btn"
      @click="handleComplete"
      :disabled="completed"
    >
      {{ completed ? '✓ Completed' : 'Complete Course' }}
    </button>

    <div v-if="completed" class="completion-message">
      ✓ Course completed successfully!
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Page4',
  emits: ['complete'],
  setup(props, { emit }) {
    const completed = ref(false);

    const handleComplete = () => {
      emit('complete');
      completed.value = true;
    };

    return {
      completed,
      handleComplete
    };
  }
};
</script>

