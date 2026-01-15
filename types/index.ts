export type TemplateType = 'general' | 'pm' | 'ops' | 'dev' | 'project' | 'sales'

export type OutputStyle = 'stable' | 'result' | 'collaboration'

export type OutputLength = 'short' | 'medium' | 'long'

export type ReportType = 'daily' | 'weekly' | 'monthly'

export interface WeeklyItem {
  id: string
  task: string
  output?: string
  data?: string
  collaboration?: string
}

export interface GenerateRequest {
  template: TemplateType
  items: WeeklyItem[]
  risks?: string
  support?: string
  nextWeek: string[]
  style: OutputStyle
  length: OutputLength
  projectName?: string
  metrics?: string
  reportType?: ReportType
}

export interface GenerateResponse {
  progress: string
  keyResults: string
  collaboration: string
  risks: string
  nextWeek: string
}

export interface ComparisonResponse {
  free: GenerateResponse
  pro: GenerateResponse
}
