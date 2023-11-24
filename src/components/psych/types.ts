export interface Psych {
  to: (id: string) => void
  run: (timeline: any[]) => void
  prev: () => void
  next: () => void
  variables: (key: string) => () => unknown
}

export enum SourceType {
  Item,
  Group
}