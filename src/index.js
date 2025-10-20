/**
 * SCORM/xAPI Wrapper - Main Entry Point
 * Framework-agnostic wrapper for SCORM 2004 and xAPI
 */

export { ScormWrapper } from './core/wrapper.js';
export { EnvironmentDetector } from './core/detector.js';
export { SCORM2004Adapter } from './adapters/scorm2004.js';
export { SCORM12Adapter } from './adapters/scorm12.js';
export { XAPIAdapter } from './adapters/xapi.js';
export { LocalStorageAdapter } from './core/storage.js';

// Default export for convenience
import { ScormWrapper } from './core/wrapper.js';
export default ScormWrapper;

