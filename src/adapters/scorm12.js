/**
 * SCORM 1.2 Adapter
 * Implements SCORM 1.2 API communication
 */

export class SCORM12Adapter {
  constructor(api) {
    this.api = api;
    this.initialized = false;
  }

  async initialize() {
    try {
      const result = this.api.LMSInitialize('');
      if (result === 'true') {
        this.initialized = true;
        console.log('[SCORM 1.2] Initialized successfully');
        
        // Clear localStorage
        this.clearLocalStorageData();
        
        // Set initial status
        const status = this.api.LMSGetValue('cmi.core.lesson_status');
        if (!status || status === '' || status === 'not attempted') {
          this.api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
          this.api.LMSCommit('');
        }
        
        return true;
      } else {
        throw new Error('LMSInitialize failed');
      }
    } catch (error) {
      console.error('[SCORM 1.2] Initialization error:', error);
      throw error;
    }
  }

  clearLocalStorageData() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('scorm')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.log('[SCORM 1.2] Cleared local storage data');
      }
    } catch (error) {
      // Ignore
    }
  }

  async saveProgress(data) {
    if (!this.initialized) {
      throw new Error('SCORM 1.2 API not initialized');
    }

    try {
      const serialized = JSON.stringify(data);
      
      // SCORM 1.2 suspend_data limit is 4,096 characters
      if (serialized.length > 4096) {
        console.warn('[SCORM 1.2] Data exceeds 4KB limit');
      }
      
      this.api.LMSSetValue('cmi.suspend_data', serialized);
      
      if (data.location !== undefined) {
        this.api.LMSSetValue('cmi.core.lesson_location', String(data.location));
      }
      
      const result = this.api.LMSCommit('');
      
      if (result === 'true') {
        console.log('[SCORM 1.2] Progress saved');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SCORM 1.2] Error saving:', error);
      return false;
    }
  }

  async getProgress() {
    if (!this.initialized) {
      throw new Error('SCORM 1.2 API not initialized');
    }

    try {
      const suspendData = this.api.LMSGetValue('cmi.suspend_data');
      
      if (!suspendData || suspendData === '') {
        return null;
      }
      
      return JSON.parse(suspendData);
    } catch (error) {
      console.error('[SCORM 1.2] Error loading:', error);
      return null;
    }
  }

  async setComplete(passed = true) {
    if (!this.initialized) {
      throw new Error('SCORM 1.2 API not initialized');
    }

    try {
      // SCORM 1.2 uses lesson_status (passed, completed, failed, incomplete, browsed, not attempted)
      this.api.LMSSetValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
      
      const result = this.api.LMSCommit('');
      
      if (result === 'true') {
        console.log(`[SCORM 1.2] Course marked as ${passed ? 'passed' : 'failed'}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SCORM 1.2] Error setting completion:', error);
      return false;
    }
  }

  async setScore(score) {
    if (!this.initialized) {
      throw new Error('SCORM 1.2] API not initialized');
    }

    try {
      this.api.LMSSetValue('cmi.core.score.raw', String(score));
      this.api.LMSSetValue('cmi.core.score.min', '0');
      this.api.LMSSetValue('cmi.core.score.max', '100');
      
      const result = this.api.LMSCommit('');
      
      if (result === 'true') {
        console.log('[SCORM 1.2] Score set:', score);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SCORM 1.2] Error setting score:', error);
      return false;
    }
  }

  async terminate() {
    if (!this.initialized) {
      return true;
    }

    try {
      const result = this.api.LMSFinish('');
      
      if (result === 'true') {
        console.log('[SCORM 1.2] Terminated successfully');
        this.initialized = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[SCORM 1.2] Error terminating:', error);
      return false;
    }
  }

  async setValue(key, value) {
    if (!this.initialized) {
      throw new Error('SCORM 1.2 API not initialized');
    }

    try {
      this.api.LMSSetValue(key, value);
      this.api.LMSCommit('');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getValue(key) {
    if (!this.initialized) {
      throw new Error('SCORM 1.2 API not initialized');
    }

    try {
      return this.api.LMSGetValue(key);
    } catch (error) {
      return null;
    }
  }
}


