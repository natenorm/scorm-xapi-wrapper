/**
 * xAPI (Tin Can) Adapter
 * Implements xAPI/Tin Can API communication
 */

export class XAPIAdapter {
  constructor(config) {
    this.endpoint = config.endpoint;
    this.auth = config.auth;
    this.actor = config.actor;
    this.activityId = config.activityId || window.location.href;
    this.initialized = false;
    this.registrationId = this.generateUUID();
  }

  async initialize() {
    try {
      // Verify connection by sending an initialized statement
      await this.sendStatement({
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/initialized',
          display: { 'en-US': 'initialized' }
        },
        object: {
          id: this.activityId,
          definition: {
            type: 'http://adlnet.gov/expapi/activities/course'
          }
        }
      });

      this.initialized = true;
      console.log('[xAPI] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[xAPI] Initialization error:', error);
      throw error;
    }
  }

  async saveProgress(data) {
    if (!this.initialized) {
      throw new Error('xAPI not initialized');
    }

    try {
      // Use State API to store progress data
      const stateUrl = `${this.endpoint}/activities/state?` +
        `activityId=${encodeURIComponent(this.activityId)}&` +
        `agent=${encodeURIComponent(JSON.stringify(this.actor))}&` +
        `stateId=progress&` +
        `registration=${this.registrationId}`;

      const response = await fetch(stateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': this.auth,
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('[xAPI] Progress saved successfully');
        
        // Send progressed statement
        await this.sendStatement({
          verb: {
            id: 'http://adlnet.gov/expapi/verbs/progressed',
            display: { 'en-US': 'progressed' }
          },
          object: {
            id: this.activityId,
            definition: {
              type: 'http://adlnet.gov/expapi/activities/course'
            }
          }
        });
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[xAPI] Error saving progress:', error);
      return false;
    }
  }

  async getProgress() {
    if (!this.initialized) {
      throw new Error('xAPI not initialized');
    }

    try {
      const stateUrl = `${this.endpoint}/activities/state?` +
        `activityId=${encodeURIComponent(this.activityId)}&` +
        `agent=${encodeURIComponent(JSON.stringify(this.actor))}&` +
        `stateId=progress&` +
        `registration=${this.registrationId}`;

      const response = await fetch(stateUrl, {
        method: 'GET',
        headers: {
          'Authorization': this.auth,
          'X-Experience-API-Version': '1.0.3'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[xAPI] Progress loaded');
        return data;
      } else if (response.status === 404) {
        // No progress saved yet
        return null;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[xAPI] Error loading progress:', error);
      return null;
    }
  }

  async setComplete() {
    if (!this.initialized) {
      throw new Error('xAPI not initialized');
    }

    try {
      await this.sendStatement({
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/completed',
          display: { 'en-US': 'completed' }
        },
        object: {
          id: this.activityId,
          definition: {
            type: 'http://adlnet.gov/expapi/activities/course'
          }
        },
        result: {
          completion: true,
          success: true
        }
      });

      console.log('[xAPI] Course marked as complete');
      return true;
    } catch (error) {
      console.error('[xAPI] Error setting completion:', error);
      return false;
    }
  }

  async setScore(score) {
    if (!this.initialized) {
      throw new Error('xAPI not initialized');
    }

    try {
      await this.sendStatement({
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/scored',
          display: { 'en-US': 'scored' }
        },
        object: {
          id: this.activityId,
          definition: {
            type: 'http://adlnet.gov/expapi/activities/course'
          }
        },
        result: {
          score: {
            scaled: score / 100,
            raw: score,
            min: 0,
            max: 100
          }
        }
      });

      console.log('[xAPI] Score set:', score);
      return true;
    } catch (error) {
      console.error('[xAPI] Error setting score:', error);
      return false;
    }
  }

  async terminate() {
    if (!this.initialized) {
      return true;
    }

    try {
      await this.sendStatement({
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/terminated',
          display: { 'en-US': 'terminated' }
        },
        object: {
          id: this.activityId,
          definition: {
            type: 'http://adlnet.gov/expapi/activities/course'
          }
        }
      });

      console.log('[xAPI] Terminated successfully');
      this.initialized = false;
      return true;
    } catch (error) {
      console.error('[xAPI] Error terminating:', error);
      return false;
    }
  }

  async sendStatement(statement) {
    const fullStatement = {
      actor: this.actor,
      ...statement,
      timestamp: new Date().toISOString(),
      context: {
        registration: this.registrationId
      }
    };

    const response = await fetch(`${this.endpoint}/statements`, {
      method: 'POST',
      headers: {
        'Authorization': this.auth,
        'Content-Type': 'application/json',
        'X-Experience-API-Version': '1.0.3'
      },
      body: JSON.stringify(fullStatement)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

