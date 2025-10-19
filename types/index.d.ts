/**
 * TypeScript definitions for SCORM/xAPI Wrapper
 */

export interface ProgressData {
  [key: string]: any;
}

export interface XAPIConfig {
  endpoint: string;
  auth: string;
  actor: any;
  activityId?: string;
}

export interface EnvironmentDetection {
  type: 'scorm2004' | 'scorm12' | 'xapi' | 'local';
  api: any;
}

export class EnvironmentDetector {
  static detect(): EnvironmentDetection;
  static findSCORM2004API(): any;
  static findSCORM12API(): any;
  static findXAPIConfig(): XAPIConfig | null;
}

export class SCORM2004Adapter {
  constructor(api: any);
  initialize(): Promise<boolean>;
  saveProgress(data: ProgressData): Promise<boolean>;
  getProgress(): Promise<ProgressData | null>;
  setComplete(): Promise<boolean>;
  setScore(score: number): Promise<boolean>;
  terminate(): Promise<boolean>;
  setValue(key: string, value: string): Promise<boolean>;
  getValue(key: string): Promise<string | null>;
}

export class XAPIAdapter {
  constructor(config: XAPIConfig);
  initialize(): Promise<boolean>;
  saveProgress(data: ProgressData): Promise<boolean>;
  getProgress(): Promise<ProgressData | null>;
  setComplete(): Promise<boolean>;
  setScore(score: number): Promise<boolean>;
  terminate(): Promise<boolean>;
  sendStatement(statement: any): Promise<any>;
}

export class LocalStorageAdapter {
  constructor();
  initialize(): Promise<boolean>;
  saveProgress(data: ProgressData): Promise<boolean>;
  getProgress(): Promise<ProgressData | null>;
  setComplete(): Promise<boolean>;
  setScore(score: number): Promise<boolean>;
  terminate(): Promise<boolean>;
  setValue(key: string, value: string): Promise<boolean>;
  getValue(key: string): Promise<string | null>;
}

export class ScormWrapperClass {
  initialize(): Promise<boolean>;
  saveProgress(data: ProgressData): Promise<boolean>;
  getProgress(): Promise<ProgressData | null>;
  setComplete(): Promise<boolean>;
  setScore(score: number): Promise<boolean>;
  terminate(): Promise<boolean>;
  setValue(key: string, value: string): Promise<boolean>;
  getValue(key: string): Promise<string | null>;
  getEnvironmentType(): 'scorm2004' | 'scorm12' | 'xapi' | 'local' | 'unknown';
  isInitialized(): boolean;
}

export const ScormWrapper: ScormWrapperClass;
export default ScormWrapper;

