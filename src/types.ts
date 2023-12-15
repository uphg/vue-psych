import type { Psych } from './hooks/useProviderPsych'

type Key = string | number | symbol

export interface TimelineData {
  [key: Key]: unknown | ReturnType<Psych['variables']> | Array<unknown> | TimelineData
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
  later?(): TimelineNode | boolean
}

export interface TrialNode {
  id: string | number,
  index: number
  parameters: TimelineNode
  location?: [number, number]
  parentNode?: TrialNode
  trialData?: TimelineData
  trials?: TrialNode[]
  plugin?: PsychPlugin
  records?: {
    startTime: number
    timeElapsed?: number
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

export type PsychPluginReturn = ReturnType<PsychPlugin>

export type PsychPluginHandler = (event: KeyboardEvent) => void
