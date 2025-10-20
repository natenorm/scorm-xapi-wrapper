/**
 * SCORM 2004 Adapter
 * Implements SCORM 2004 4th Edition API communication
 */

export class SCORM2004Adapter {
  constructor(api) {
    this.api = api;
    this.initialized = false;
  }

  async initialize() {
    try {
      const result = this.api.Initialize('');
      if (result === 'true') {
        this.initialized = true;
        
        // Clear any localStorage that might interfere from local testing
        this.clearLocalStorageData();
        
        // Set initial status if not already set
        const completionStatus = this.api.GetValue('cmi.completion_status');
        if (completionStatus === 'unknown' || completionStatus === 'not attempted') {
          this.api.SetValue('cmi.completion_status', 'incomplete');
          this.api.Commit('');
        }
        
        return true;
      } else {
        throw new Error(this.getLastError());
      }
    } catch (error) {
      console.error('[SCORM 2004] Initialization error:', error);
      throw error;
    }
  }
  
  clearLocalStorageData() {
    // Clear any localStorage from local testing to prevent conflicts
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('scorm')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Ignore localStorage errors (might be blocked in some LMS iframes)
    }
  }

  async saveProgress(data) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      // Serialize data to JSON string for suspend_data
      const serialized = JSON.stringify(data);
      
      // SCORM 2004 suspend_data limit is 64,000 characters
      if (serialized.length > 64000) {
        console.warn('[SCORM 2004] Data exceeds 64KB limit');
      }
      
      this.api.SetValue('cmi.suspend_data', serialized);
      
      // Update location if provided
      if (data.location !== undefined) {
        this.api.SetValue('cmi.location', String(data.location));
      }
      
      // Commit the data
      const result = this.api.Commit('');
      
      if (result === 'true') {
        return true;
      } else {
        throw new Error(this.getLastError());
      }
    } catch (error) {
      console.error('[SCORM 2004] Error saving progress:', error);
      return false;
    }
  }

  async getProgress() {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      const suspendData = this.api.GetValue('cmi.suspend_data');
      
      if (!suspendData || suspendData === '') {
        return null;
      }
      
      return JSON.parse(suspendData);
    } catch (error) {
      console.error('[SCORM 2004] Error loading progress:', error);
      return null;
    }
  }

  async setComplete(passed = true) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      // Only mark complete if not already completed
      const currentStatus = this.api.GetValue('cmi.completion_status');
      if (currentStatus === 'completed') {
        return true;
      }
      
      // Set completion and success status
      this.api.SetValue('cmi.completion_status', 'completed');
      this.api.SetValue('cmi.success_status', passed ? 'passed' : 'failed');
      
      // Commit immediately
      const result = this.api.Commit('');
      
      if (result === 'true') {
        return true;
      } else {
        throw new Error(this.getLastError());
      }
    } catch (error) {
      console.error('[SCORM 2004] Error setting completion:', error);
      return false;
    }
  }

  async setScore(score) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      // SCORM 2004 uses scaled score (0-1)
      const scaledScore = score / 100;
      
      this.api.SetValue('cmi.score.scaled', String(scaledScore));
      this.api.SetValue('cmi.score.raw', String(score));
      this.api.SetValue('cmi.score.min', '0');
      this.api.SetValue('cmi.score.max', '100');
      
      const result = this.api.Commit('');
      
      if (result === 'true') {
        return true;
      } else {
        throw new Error(this.getLastError());
      }
    } catch (error) {
      console.error('[SCORM 2004] Error setting score:', error);
      return false;
    }
  }

  async terminate() {
    if (!this.initialized) {
      return true;
    }

    try {
      // Set exit mode to "suspend" ONLY for incomplete courses
      // Completed courses should NOT set exit mode (let LMS use default behavior)
      const completionStatus = this.api.GetValue('cmi.completion_status');
      if (completionStatus !== 'completed') {
        this.api.SetValue('cmi.exit', 'suspend');
      }
      
      // Final commit before terminating
      this.api.Commit('');
      
      const result = this.api.Terminate('');
      
      if (result === 'true') {
        this.initialized = false;
        return true;
      } else {
        throw new Error(this.getLastError());
      }
    } catch (error) {
      console.error('[SCORM 2004] Error terminating:', error);
      return false;
    }
  }

  async setValue(key, value) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      this.api.SetValue(key, value);
      this.api.Commit('');
      return true;
    } catch (error) {
      console.error('[SCORM 2004] Error setting value:', error);
      return false;
    }
  }

  async getValue(key) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      return this.api.GetValue(key);
    } catch (error) {
      console.error('[SCORM 2004] Error getting value:', error);
      return null;
    }
  }

  getLastError() {
    const errorCode = this.api.GetLastError();
    const errorString = this.api.GetErrorString(errorCode);
    const diagnostic = this.api.GetDiagnostic(errorCode);
    return `Error ${errorCode}: ${errorString} - ${diagnostic}`;
  }
}

