/**
 * SCORM/xAPI Wrapper
 * Main unified API for SCORM 2004 and xAPI tracking
 */

import { EnvironmentDetector } from './detector.js';
import { SCORM2004Adapter } from '../adapters/scorm2004.js';
import { XAPIAdapter } from '../adapters/xapi.js';
import { LocalStorageAdapter } from './storage.js';

class ScormWrapperClass {
  constructor() {
    this.adapter = null;
    this.environment = null;
    this.initialized = false;
  }

  /**
   * Initialize connection to LMS
   * Auto-detects environment and sets up appropriate adapter
   */
  async initialize() {
    if (this.initialized) {
      console.warn('[Wrapper] Already initialized');
      return true;
    }

    // Detect environment
    this.environment = EnvironmentDetector.detect();
    console.log(`[Wrapper] Detected environment: ${this.environment.type}`);

    // Create appropriate adapter
    switch (this.environment.type) {
      case 'scorm2004':
        this.adapter = new SCORM2004Adapter(this.environment.api);
        break;
      case 'xapi':
        this.adapter = new XAPIAdapter(this.environment.api);
        break;
      case 'local':
      default:
        this.adapter = new LocalStorageAdapter();
        break;
    }

    // Initialize the adapter
    await this.adapter.initialize();
    this.initialized = true;

    // Setup auto-save on page unload
    this.setupAutoTerminate();

    return true;
  }

  /**
   * Save progress data
   * @param {Object} data - Any JSON-serializable object with course progress
   */
  async saveProgress(data) {
    this.ensureInitialized();
    return await this.adapter.saveProgress(data);
  }

  /**
   * Load saved progress data
   * @returns {Object|null} - Previously saved progress data or null
   */
  async getProgress() {
    this.ensureInitialized();
    return await this.adapter.getProgress();
  }

  /**
   * Mark course as complete
   */
  async setComplete() {
    this.ensureInitialized();
    return await this.adapter.setComplete();
  }

  /**
   * Set course score
   * @param {number} score - Score value (0-100)
   */
  async setScore(score) {
    this.ensureInitialized();
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('Score must be a number between 0 and 100');
    }
    
    return await this.adapter.setScore(score);
  }

  /**
   * Terminate connection to LMS
   */
  async terminate() {
    if (!this.initialized) {
      return true;
    }

    const result = await this.adapter.terminate();
    this.initialized = false;
    return result;
  }

  /**
   * Set a custom value in the LMS
   * @param {string} key - Key name
   * @param {string} value - Value to set
   */
  async setValue(key, value) {
    this.ensureInitialized();
    
    if (this.adapter.setValue) {
      return await this.adapter.setValue(key, value);
    }
    
    console.warn('[Wrapper] setValue not supported by current adapter');
    return false;
  }

  /**
   * Get a custom value from the LMS
   * @param {string} key - Key name
   * @returns {string|null} - Value or null
   */
  async getValue(key) {
    this.ensureInitialized();
    
    if (this.adapter.getValue) {
      return await this.adapter.getValue(key);
    }
    
    console.warn('[Wrapper] getValue not supported by current adapter');
    return null;
  }

  /**
   * Get current environment type
   * @returns {string} - 'scorm2004', 'xapi', or 'local'
   */
  getEnvironmentType() {
    return this.environment?.type || 'unknown';
  }

  /**
   * Check if wrapper is initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Setup auto-terminate on page unload
   * @private
   */
  setupAutoTerminate() {
    window.addEventListener('beforeunload', () => {
      if (this.initialized) {
        // Use synchronous termination for unload
        this.terminate();
      }
    });

    // Also handle visibility change for mobile
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.initialized) {
        this.terminate();
      }
    });
  }

  /**
   * Ensure wrapper is initialized
   * @private
   */
  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Wrapper not initialized. Call initialize() first.');
    }
  }
}

// Export singleton instance
export const ScormWrapper = new ScormWrapperClass();

