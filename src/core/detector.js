/**
 * Environment Detector
 * Detects which LMS environment is available (SCORM 2004, SCORM 1.2, xAPI, or local)
 * Based on pipwerks SCORM API Wrapper approach
 */

export class EnvironmentDetector {
  /**
   * Finds SCORM API in window hierarchy
   * Traverses parent frames looking for API or API_1484_11
   * @param {Window} win - Window object to search from
   * @returns {Object|null} - { type, handle } or null
   */
  static findAPI(win) {
    let API = null;
    let findAttempts = 0;
    const findAttemptLimit = 500;
    
    try {
      // Traverse parent frame hierarchy
      while ((!win.API && !win.API_1484_11) &&
             (win.parent) &&
             (win.parent !== win) &&
             (findAttempts <= findAttemptLimit)) {
        findAttempts++;
        win = win.parent;
      }
      
      // Determine which API was found
      if (win.API_1484_11) {
        API = { type: 'scorm2004', handle: win.API_1484_11 };
      } else if (win.API) {
        API = { type: 'scorm12', handle: win.API };
      }
    } catch (e) {
      // Cross-origin restrictions may prevent access
    }
    
    return API;
  }

  /**
   * Detects the available LMS environment
   * Uses multiple search strategies (pipwerks approach)
   * @returns {Object} - { type: 'scorm2004' | 'scorm12' | 'xapi' | 'local', api: object }
   */
  static detect() {
    let API = null;

    // Strategy 1: Search from current window
    API = this.findAPI(window);

    // Strategy 2: Search from parent window
    if (!API && window.parent && window.parent !== window) {
      try {
        API = this.findAPI(window.parent);
      } catch (e) {
        // Cross-origin restriction
      }
    }

    // Strategy 3: Search from opener window
    if (!API && window.top && window.top.opener) {
      try {
        API = this.findAPI(window.top.opener);
      } catch (e) {
        // Cross-origin restriction
      }
    }

    // Strategy 4: Plateau LMS special handling
    if (!API && window.top && window.top.opener && window.top.opener.document) {
      try {
        API = this.findAPI(window.top.opener.document);
      } catch (e) {
        // Cross-origin restriction
      }
    }

    // If SCORM API found, return it
    if (API) {
      return { type: API.type, api: API.handle };
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

