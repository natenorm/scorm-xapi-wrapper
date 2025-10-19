<template>
  <div class="progress-bar">
    <div 
      class="progress-fill" 
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProgressBar',
  props: {
    current: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const progress = computed(() => {
      return (props.current / props.total) * 100;
    });

    return {
      progress
    };
  }
};
</script>

