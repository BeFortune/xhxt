export enum Tab {
  OVERVIEW = 'overview',
  PROCESS = 'process',
  VISUALIZATION = 'visualization',
  ADVANCED = 'advanced',
}

export interface DataPoint {
  x: number;
  y: number;
  type?: string;
}

export interface BerDataPoint {
  snr: number;
  ber: number;
}