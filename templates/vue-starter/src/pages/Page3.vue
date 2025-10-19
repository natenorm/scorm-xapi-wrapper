<template>
  <div class="page">
    <h2>Page 3: Interactive Example</h2>
    <p>This page demonstrates saving user data:</p>
    
    <div class="interaction">
      <label for="nameInput">Enter your name:</label>
      <input
        id="nameInput"
        v-model="inputValue"
        type="text"
        placeholder="Your name"
      />
      <button @click="handleSave">Save</button>
      
      <p v-if="userData.name" class="greeting">
        Hello, {{ userData.name }}!
      </p>
    </div>

    <p class="note">
      Your data is saved automatically and will be restored when you return to the course.
    </p>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'Page3',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-data'],
  setup(props, { emit }) {
    const inputValue = ref(props.userData.name || '');

    watch(() => props.userData.name, (newName) => {
      inputValue.value = newName || '';
    });

    const handleSave = () => {
      emit('update-data', 'name', inputValue.value);
    };

    return {
      inputValue,
      handleSave
    };
  }
};
</script>

