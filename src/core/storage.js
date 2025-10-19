/**
 * Local Storage Adapter
 * Fallback adapter for local development and testing
 */

export class LocalStorageAdapter {
  constructor() {
    this.storageKey = 'scorm_local_data';
    this.initialized = false;
  }

  async initialize() {
    console.log('[LocalStorage] Running in local development mode');
    this.initialized = true;
    return true;
  }

  async saveProgress(data) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.storageKey, serialized);
      console.log('[LocalStorage] Progress saved:', data);
      return true;
    } catch (error) {
      console.error('[LocalStorage] Error saving progress:', error);
      return false;
    }
  }

  async getProgress() {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    try {
      const serialized = localStorage.getItem(this.storageKey);
      if (!serialized) {
        return null;
      }
      const data = JSON.parse(serialized);
      console.log('[LocalStorage] Progress loaded:', data);
      return data;
    } catch (error) {
      console.error('[LocalStorage] Error loading progress:', error);
      return null;
    }
  }

  async setComplete() {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    const currentData = await this.getProgress() || {};
    currentData._completed = true;
    currentData._completedAt = new Date().toISOString();
    await this.saveProgress(currentData);
    console.log('[LocalStorage] Course marked as complete');
    return true;
  }

  async setScore(score) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    const currentData = await this.getProgress() || {};
    currentData._score = score;
    await this.saveProgress(currentData);
    console.log('[LocalStorage] Score set:', score);
    return true;
  }

  async terminate() {
    console.log('[LocalStorage] Terminating connection');
    this.initialized = false;
    return true;
  }

  async setValue(key, value) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    try {
      localStorage.setItem(`scorm_${key}`, value);
      return true;
    } catch (error) {
      console.error('[LocalStorage] Error setting value:', error);
      return false;
    }
  }

  async getValue(key) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    try {
      return localStorage.getItem(`scorm_${key}`);
    } catch (error) {
      console.error('[LocalStorage] Error getting value:', error);
      return null;
    }
  }
}

