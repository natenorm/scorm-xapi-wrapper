<template>
  <nav class="navigation">
    <button 
      @click="$emit('previous')"
      :disabled="currentPage === 1"
    >
      ← Previous
    </button>
    <span class="page-indicator">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button 
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
    >
      Next →
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['next', 'previous']
};
</script>

