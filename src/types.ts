export interface Psych {
  to: (id: string) => void
  run: (timeline: any[]) => void
  prev: () => void
  next: () => void
  variables: (key: string) => () => unknown
  trigger: (eventName: string, options: Record<string, any>) => void
  setData: (obj: Record<string, any>) => void
}

export enum NodeType {
  Item,
  Group
}