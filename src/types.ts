import type { Psych } from './hooks/useProviderPsych'

type Key = string | number | symbol

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
  onStart?(data?: TimelineData): void
  onFinish?(data?: TimelineData): void
}

export interface TrialNode {
  index: number
  source: TimelineNode
  sourceGroup: TimelineNode
  outputData?: TimelineData
  startTime: number
  timeElapsed: number
  triggers?: Array<{
    eventName: string
    now: number
    rt: number
    [key: string]: unknown
  }>
}

export type PsychPlugin = () => {
  load(trial: TimelineNode, psych: Psych, _handler?: PsychPluginHandler): void
  unload(): void
}

export type PsychPluginHandler = (event: KeyboardEvent) => void
