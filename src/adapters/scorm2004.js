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
        console.log('[SCORM 2004] Initialized successfully');
        
        // Set initial status if not already set
        const status = this.api.GetValue('cmi.completion_status');
        if (status === 'unknown' || status === 'not attempted') {
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

  async saveProgress(data) {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      // Serialize data to JSON string for suspend_data
      const serialized = JSON.stringify(data);
      
      // SCORM 2004 suspend_data limit is 64,000 characters
      if (serialized.length > 64000) {
        console.warn('[SCORM 2004] Data exceeds 64KB limit, truncating...');
      }
      
      this.api.SetValue('cmi.suspend_data', serialized);
      
      // Update location if provided
      if (data.location !== undefined) {
        this.api.SetValue('cmi.location', String(data.location));
      }
      
      // Commit the data
      const result = this.api.Commit('');
      
      if (result === 'true') {
        console.log('[SCORM 2004] Progress saved successfully');
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
      
      const data = JSON.parse(suspendData);
      console.log('[SCORM 2004] Progress loaded');
      return data;
    } catch (error) {
      console.error('[SCORM 2004] Error loading progress:', error);
      return null;
    }
  }

  async setComplete() {
    if (!this.initialized) {
      throw new Error('SCORM API not initialized');
    }

    try {
      this.api.SetValue('cmi.completion_status', 'completed');
      this.api.SetValue('cmi.success_status', 'passed');
      
      const result = this.api.Commit('');
      
      if (result === 'true') {
        console.log('[SCORM 2004] Course marked as complete');
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
        console.log('[SCORM 2004] Score set:', score);
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
      const result = this.api.Terminate('');
      
      if (result === 'true') {
        console.log('[SCORM 2004] Terminated successfully');
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

