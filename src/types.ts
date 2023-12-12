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
  onStart?(trial?: TrialNode): void
  onFinish?(trial?: TrialNode): void
  later?(): boolean
}

export interface TrialNode {
  index: number
  parameters: TimelineNode
  location?: [number, number]
  parentNode?: TrialNode
  trialData?: TimelineData
  records?: {
    startTime: number
    timeElapsed: number
    events?: Array<{
      eventName: string
      now: number
      rt: number
      [key: string]: unknown
    }>
  }
}

export type PsychPlugin = () => {
  load(trial: TimelineNode, psych: Psych, _handler?: PsychPluginHandler): void
  unload(): void
}

export type PsychPluginHandler = (event: KeyboardEvent) => void
