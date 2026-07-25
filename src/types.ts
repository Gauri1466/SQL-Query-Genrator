export type QueryMode = 'SQL' | 'Excel' | 'Both';
export type DatabaseType = 'MySQL' | 'PostgreSQL' | 'SQLite' | 'SQL Server' | 'Oracle';
export type ExcelVersion = '365' | '2019' | '2016';

export interface GenerationRequest {
  userQuery: string;
  schema?: string;
  mode: QueryMode;
  dbType: DatabaseType;
  excelVersion: ExcelVersion;
  language: string;
}

export interface GenerationResponse {
  sql_query: string;
  excel_formula: string;
  explanation: string;
  common_mistake: string;
  optimization_tip: string;
}

export interface ExplanationBreakdownItem {
  part: string;
  description: string;
}

export interface QueryExplanationResponse {
  summary: string;
  breakdown: ExplanationBreakdownItem[];
  performance_considerations: string;
  suggested_improvements: string;
}

export interface SampleDataResponse {
  columns: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  userQuery: string;
  schema?: string;
  mode: QueryMode;
  dbType: DatabaseType;
  excelVersion: ExcelVersion;
  result: GenerationResponse;
  isFavorite?: boolean;
}
