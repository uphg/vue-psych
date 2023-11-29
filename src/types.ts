type Key = string | number | symbol

export interface Psych {
  run(timeline: TimelineNode[]): void
  next(): void
  prev(): void
  to(id: string): void
  setData(obj: TimelineData): void
  getData(): TimelineData
  variables(key: string): () => unknown,
  trigger(eventName: string, options?: Record<string, any>): void
  getTrials(): TimelineNode[]
}

export interface TimelineData {
  [key: Key]: string | number | symbol | boolean | ReturnType<Psych['variables']> | null | Array<unknown> | TimelineData
}

export interface TimelineNode {
  name?: string
  type?: PsychPlugin
  choices?: string[]
  trialDuration?: number
  data?: TimelineData
  timeline?: TimelineNode[]
  timelineVariables?: TimelineData[]
  onStart?(data: TimelineData): void
  onFinish?(data: TimelineData): void
}

export interface TrialNode {
  source: TimelineNode
  outputData?: TimelineData
}

export type PsychPlugin = () => {
  load(trial: TimelineNode, psych: Psych, _handler?: PsychPluginHandler): void
  unload(): void
}

export type PsychPluginHandler = (event: KeyboardEvent) => void
