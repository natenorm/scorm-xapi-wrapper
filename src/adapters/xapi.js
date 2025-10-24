/**
 * xAPI (Experience API / Tin Can API) Adapter
 * Handles communication with Learning Record Stores (LRS)
 */

export class XAPIAdapter {
    constructor() {
        this.initialized = false;
        this.config = null;
        this.activityId = null;
        this.registrationId = null;
    }

    /**
     * Initialize xAPI connection
     * @param {Object} config - xAPI configuration
     * @param {string} config.endpoint - LRS endpoint URL
     * @param {string} config.auth - Authorization header value (e.g., "Basic base64credentials")
     * @param {Object} config.actor - Actor object { name, mbox }
     * @param {string} config.activityId - Activity IRI
     * @param {string} config.registration - Registration UUID (optional)
     */
    initialize(config) {
        if (this.initialized) {
            return true;
        }

        // Validate required config
        if (!config) {
            throw new Error('xAPI config is required');
        }

        // Normalize endpoint (remove trailing slash)
        let endpoint = config.endpoint || null;
        if (endpoint && endpoint.endsWith('/')) {
            endpoint = endpoint.slice(0, -1);
        }

        // Normalize actor (SCORM Cloud passes name as array)
        let actor = config.actor || {
            name: 'Test User',
            mbox: 'mailto:test@example.com'
        };
        
        // Fix actor format if name is an array
        if (actor.name && Array.isArray(actor.name)) {
            actor.name = actor.name[0]; // Take first element
        }
        
        // Fix account if it's an array
        if (actor.account && Array.isArray(actor.account)) {
            actor.account = actor.account[0]; // Take first element
        }

        // Normalize account object to xAPI spec
        if (actor.account) {
            // Rename accountServiceHomePage to homePage
            if (actor.account.accountServiceHomePage) {
                actor.account.homePage = actor.account.accountServiceHomePage;
                delete actor.account.accountServiceHomePage;
            }
            // Rename accountName to name
            if (actor.account.accountName) {
                actor.account.name = actor.account.accountName;
                delete actor.account.accountName;
            }
        }

        // For local development, we can work without endpoint/auth
        this.config = {
            endpoint: endpoint,
            auth: config.auth || null,
            actor: actor,
            activityId: config.activityId || 'http://example.com/activities/course',
            registration: config.registration || this.generateUUID()
        };

        this.activityId = this.config.activityId;
        this.registrationId = this.config.registration;

        // Check if we have a real LRS endpoint
        if (this.config.endpoint && this.config.auth) {
            console.log('[xAPI] Initializing with LRS:', this.config.endpoint);
            console.log('[xAPI] Registration ID:', this.registrationId);
            console.log('[xAPI] Activity ID:', this.activityId);
            console.log('[xAPI] Actor:', this.config.actor);
            this.initialized = true;
            return true;
        } else {
            console.log('[xAPI] Initializing in local mode (no LRS configured)');
            this.initialized = true;
            return true;
        }
    }

    /**
     * Send an xAPI statement to the LRS
     * @param {Object} statement - xAPI statement object
     * @param {number} retryCount - Internal retry counter
     */
    async sendStatement(statement, retryCount = 0) {
        if (!this.initialized) {
            throw new Error('xAPI adapter not initialized');
        }

        // Add required fields if not present
        if (!statement.id) {
            statement.id = this.generateUUID();
        }
        if (!statement.timestamp) {
            statement.timestamp = new Date().toISOString();
        }
        if (!statement.actor) {
            statement.actor = this.config.actor;
        }

        console.log('[xAPI] Statement:', statement);
        console.log('[xAPI] Statement registration:', statement.context?.registration);
        console.log('[xAPI] Wrapper registrationId:', this.registrationId);

        // If we have a real LRS, send the statement
        if (this.config.endpoint && this.config.auth) {
            try {
                const response = await fetch(`${this.config.endpoint}/statements`, {
                    method: 'POST',
                    headers: {
                        'Authorization': this.config.auth,
                        'Content-Type': 'application/json',
                        'X-Experience-API-Version': '1.0.3'
                    },
                    body: JSON.stringify(statement)
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    
                    // Check for UUID collision (403 with "existing registration" message)
                    if (response.status === 403 && errorBody.includes('existing registration')) {
                        console.warn(`[xAPI] ⚠️ UUID collision detected! Retrying with new UUID (attempt ${retryCount + 1}/5)`);
                        
                        // Retry up to 5 times with new UUIDs
                        if (retryCount < 5) {
                            const oldId = statement.id;
                            statement.id = this.generateUUID(); // Generate fresh UUID
                            console.log(`[xAPI] Replaced ${oldId} with ${statement.id}`);
                            return this.sendStatement(statement, retryCount + 1);
                        } else {
                            console.error('[xAPI] ❌ Max retries reached - UUID collision could not be resolved');
                            throw new Error(`UUID collision after ${retryCount} retries: ${errorBody}`);
                        }
                    }
                    
                    console.error('[xAPI] Statement error response:', errorBody);
                    throw new Error(`LRS returned ${response.status}: ${errorBody}`);
                }

                // Log successful response details
                const responseText = await response.text();
                if (retryCount > 0) {
                    console.log(`[xAPI] ✅ Statement sent successfully after ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}!`);
                } else {
                    console.log('[xAPI] Statement sent successfully - Response:', response.status, responseText || '(empty body)');
                }
                console.log('[xAPI] Statement ID:', statement.id);
                return true;
            } catch (error) {
                console.error('[xAPI] Failed to send statement:', error);
                return false;
            }
        } else {
            // Local mode - just log it
            console.log('[xAPI] Local mode - statement logged (not sent to LRS)');
            return true;
        }
    }

    /**
     * Save progress data using xAPI State API
     * @param {Object} data - Progress data to save
     */
    async saveProgress(data) {
        if (!this.initialized) {
            throw new Error('xAPI adapter not initialized');
        }

        const stateId = 'progress';
        
        // If we have a real LRS, use State API
        if (this.config.endpoint && this.config.auth) {
            try {
                const url = new URL(`${this.config.endpoint}/activities/state`);
                url.searchParams.append('activityId', this.activityId);
                url.searchParams.append('agent', JSON.stringify(this.config.actor));
                url.searchParams.append('stateId', stateId);
                if (this.registrationId) {
                    url.searchParams.append('registration', this.registrationId);
                }

                const response = await fetch(url.toString(), {
                    method: 'PUT',
                    headers: {
                        'Authorization': this.config.auth,
                        'Content-Type': 'application/json',
                        'X-Experience-API-Version': '1.0.3'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error('[xAPI] Save state error response:', errorBody);
                    throw new Error(`LRS returned ${response.status}: ${errorBody}`);
                }

                console.log('[xAPI] State saved to LRS');
                return true;
            } catch (error) {
                console.error('[xAPI] Failed to save state:', error);
                // Fall back to localStorage
                return this.saveToLocalStorage(data);
            }
        } else {
            // Local mode - use localStorage
            return this.saveToLocalStorage(data);
        }
    }

    /**
     * Get progress data using xAPI State API
     */
    async getProgress() {
        if (!this.initialized) {
            throw new Error('xAPI adapter not initialized');
        }

        const stateId = 'progress';

        // If we have a real LRS, use State API
        if (this.config.endpoint && this.config.auth) {
            try {
                const url = new URL(`${this.config.endpoint}/activities/state`);
                url.searchParams.append('activityId', this.activityId);
                url.searchParams.append('agent', JSON.stringify(this.config.actor));
                url.searchParams.append('stateId', stateId);
                if (this.registrationId) {
                    url.searchParams.append('registration', this.registrationId);
                }

                const response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: {
                        'Authorization': this.config.auth,
                        'X-Experience-API-Version': '1.0.3'
                    }
                });

                if (response.status === 404) {
                    console.log('[xAPI] No saved state found in LRS');
                    return {};
                }

                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error('[xAPI] Load state error response:', errorBody);
                    throw new Error(`LRS returned ${response.status}: ${errorBody}`);
                }

                const data = await response.json();
                console.log('[xAPI] State loaded from LRS:', data);
                return data;
            } catch (error) {
                console.error('[xAPI] Failed to load state:', error);
                // Fall back to localStorage
                return this.loadFromLocalStorage();
            }
        } else {
            // Local mode - use localStorage
            return this.loadFromLocalStorage();
        }
    }

    /**
     * Mark course as complete
     * @param {boolean} success - Whether the learner succeeded (passed)
     */
    async setComplete(success = true) {
        const statement = {
            id: this.generateUUID(),
            actor: this.config.actor,
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/completed',
                display: { 'en-US': 'completed' }
            },
            object: {
                id: this.activityId,
                objectType: 'Activity'
            },
            result: {
                completion: true,
                success: success
            },
            context: {
                registration: this.registrationId
            }
        };

        return this.sendStatement(statement);
    }

    /**
     * Set score
     * @param {number} score - Score (0-100)
     * @param {number} min - Minimum score
     * @param {number} max - Maximum score
     */
    async setScore(score, min = 0, max = 100) {
        const scaled = (score - min) / (max - min);
        
        const statement = {
            id: this.generateUUID(),
            actor: this.config.actor,
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/scored',
                display: { 'en-US': 'scored' }
            },
            object: {
                id: this.activityId,
                objectType: 'Activity'
            },
            result: {
                score: {
                    scaled: scaled,
                    raw: score,
                    min: min,
                    max: max
                }
            },
            context: {
                registration: this.registrationId
            }
        };

        return this.sendStatement(statement);
    }

    /**
     * Terminate the session
     */
    async terminate() {
        if (!this.initialized) {
            return true;
        }

        // Send termination statement
        const statement = {
            id: this.generateUUID(),
            actor: this.config.actor,
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/terminated',
                display: { 'en-US': 'terminated' }
            },
            object: {
                id: this.activityId,
                objectType: 'Activity'
            },
            context: {
                registration: this.registrationId
            }
        };

        await this.sendStatement(statement);
        
        console.log('[xAPI] Terminated');
        this.initialized = false;
        return true;
    }

    /**
     * Helper: Save to localStorage (fallback)
     */
    saveToLocalStorage(data) {
        try {
            const key = `xapi_progress_${this.activityId}`;
            localStorage.setItem(key, JSON.stringify(data));
            console.log('[xAPI] State saved to localStorage');
            return true;
        } catch (error) {
            console.error('[xAPI] Failed to save to localStorage:', error);
            return false;
        }
    }

    /**
     * Helper: Load from localStorage (fallback)
     */
    loadFromLocalStorage() {
        try {
            const key = `xapi_progress_${this.activityId}`;
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('[xAPI] State loaded from localStorage:', parsed);
                return parsed;
            }
            return {};
        } catch (error) {
            console.error('[xAPI] Failed to load from localStorage:', error);
            return {};
        }
    }

    /**
     * Helper: Generate UUID (with crypto for better randomness)
     */
    generateUUID() {
        // Use crypto.randomUUID if available (modern browsers)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            const uuid = crypto.randomUUID();
            console.log('[xAPI] Generated UUID using crypto.randomUUID():', uuid);
            return uuid;
        }
        
        // Fallback: UUID v4 with timestamp for extra entropy
        console.warn('[xAPI] crypto.randomUUID() not available, using fallback');
        const timestamp = Date.now().toString(16);
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c, i) {
            // Mix in timestamp for first 8 chars
            const r = i < 8 && timestamp[i] ? 
                parseInt(timestamp[i], 16) ^ (Math.random() * 16 | 0) :
                16 * Math.random() | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return this.config;
    }

    /**
     * Get normalized actor object
     */
    getActor() {
        return this.config.actor;
    }

    /**
     * Check if initialized
     */
    isInitialized() {
        return this.initialized;
    }
}
