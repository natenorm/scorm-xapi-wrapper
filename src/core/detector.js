/**
 * Environment Detector
 * Detects which LMS environment is available (SCORM 2004, xAPI, or local)
 */

export class EnvironmentDetector {
  /**
   * Detects the available LMS environment
   * @returns {Object} - { type: 'scorm2004' | 'xapi' | 'local', api: object }
   */
  static detect() {
    // Check for SCORM 2004 API
    const scorm2004API = this.findSCORM2004API();
    if (scorm2004API) {
      return { type: 'scorm2004', api: scorm2004API };
    }

    // Check for SCORM 1.2 API (optional future support)
    const scorm12API = this.findSCORM12API();
    if (scorm12API) {
      return { type: 'scorm12', api: scorm12API };
    }

    // Check for xAPI configuration
    const xapiConfig = this.findXAPIConfig();
    if (xapiConfig) {
      return { type: 'xapi', api: xapiConfig };
    }

    // Default to local development mode
    return { type: 'local', api: null };
  }

  /**
   * Finds SCORM 2004 API (API_1484_11)
   * Searches current window and parent windows
   */
  static findSCORM2004API() {
    let win = window;
    let attempts = 0;
    const maxAttempts = 500;

    while (win && attempts < maxAttempts) {
      attempts++;

      if (win.API_1484_11) {
        return win.API_1484_11;
      }

      if (win.parent && win.parent !== win) {
        win = win.parent;
      } else {
        break;
      }
    }

    return null;
  }

  /**
   * Finds SCORM 1.2 API
   * Searches current window and parent windows
   */
  static findSCORM12API() {
    let win = window;
    let attempts = 0;
    const maxAttempts = 500;

    while (win && attempts < maxAttempts) {
      attempts++;

      if (win.API) {
        return win.API;
      }

      if (win.parent && win.parent !== win) {
        win = win.parent;
      } else {
        break;
      }
    }

    return null;
  }

  /**
   * Finds xAPI configuration
   * Checks for xAPI endpoint configuration in various locations
   */
  static findXAPIConfig() {
    // Check for xAPI launch data in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const endpoint = urlParams.get('endpoint');
    const auth = urlParams.get('auth');
    const actor = urlParams.get('actor');
    const activityId = urlParams.get('activity_id');

    if (endpoint) {
      return {
        endpoint,
        auth,
        actor: actor ? JSON.parse(decodeURIComponent(actor)) : null,
        activityId
      };
    }

    // Check for global xAPI configuration
    if (window.xAPIConfig) {
      return window.xAPIConfig;
    }

    return null;
  }
}

